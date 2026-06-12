import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  validateJsonMasterFormatV1,
  type JsonMasterAuditEvent,
  type JsonMasterFormatV1,
  type JsonMasterStatus,
  type JsonMasterWorkflow,
  type SegmentStatus,
  type TranslationStatus
} from "@laborator/shared";
import { randomUUID } from "node:crypto";
import { AuthService } from "../auth/auth.service";
import { DocumentsService } from "../documents/documents.service";
import { type Document } from "../documents/documents.types";
import { ProjectsService } from "../projects/projects.service";
import { type Project } from "../projects/projects.types";
import { type Segment } from "../segments/segments.types";
import { SegmentsService } from "../segments/segments.service";
import { type SegmentTranslation } from "../translations/translations.types";
import { TranslationsService } from "../translations/translations.service";
import { type WorkflowState } from "../workflow/workflow.types";
import { WorkflowService } from "../workflow/workflow.service";
import { DatabaseExportRepository } from "./export.repository";
import {
  type ExportActor,
  type ExportArtifact,
  type ExportAuditEvent,
  type ExportDocumentInput
} from "./export.types";

interface FoundationAuditRecord {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  beforeState?: object | null;
  afterState?: object | null;
  createdAt: string;
}

@Injectable()
export class ExportService {
  constructor(
    private readonly repository: DatabaseExportRepository,
    private readonly authService: AuthService,
    private readonly projectsService: ProjectsService,
    private readonly documentsService: DocumentsService,
    private readonly segmentsService: SegmentsService,
    private readonly translationsService: TranslationsService,
    private readonly workflowService: WorkflowService
  ) {}

  async exportDocument(
    actor: ExportActor,
    input: ExportDocumentInput
  ): Promise<ExportArtifact> {
    this.validateActor(actor);

    if (!input.projectId || !input.documentId) {
      throw new BadRequestException("projectId and documentId are required.");
    }

    const workflow = await this.workflowService.getWorkflowStatus(actor, {
      projectId: input.projectId,
      documentId: input.documentId
    });

    if (workflow.status !== "READY_FOR_EXPORT") {
      throw new BadRequestException("Cannot export unless status is READY_FOR_EXPORT.");
    }

    const project = await this.projectsService.getProject(actor, input.projectId);
    const document = await this.documentsService.getDocument(actor, input.documentId);
    const segments = await this.segmentsService.listSegments(actor, input.documentId);
    const translations = await this.translationsService.listTranslationsByDocument(
      actor,
      input.documentId
    );
    const now = new Date().toISOString();
    const artifactId = randomUUID();
    const exportAuditEvent: ExportAuditEvent = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      actorId: actor.userId,
      action: "EXPORT",
      entityType: "EXPORT_ARTIFACT",
      entityId: artifactId,
      beforeState: undefined,
      afterState: {
        id: artifactId,
        projectId: input.projectId,
        documentId: input.documentId,
        format: "JSON_MASTER",
        createdAt: now
      },
      createdAt: now
    };
    const artifact = this.buildJsonMasterArtifact(
      project,
      document,
      segments,
      translations,
      workflow,
      this.collectFoundationAuditEvents(actor, exportAuditEvent)
    );
    const validation = validateJsonMasterFormatV1(artifact);

    if (!validation.valid) {
      throw new BadRequestException(
        `JSON Master export is invalid: ${validation.issues
          .map((issue) => `${issue.path} ${issue.message}`)
          .join("; ")}`
      );
    }

    const exportArtifact = await this.repository.createArtifact({
      id: artifactId,
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      format: "JSON_MASTER",
      artifact,
      createdBy: actor.userId,
      createdAt: now
    });

    await this.repository.appendAuditEvent(exportAuditEvent);
    await this.workflowService.markExported(actor, input);
    await this.documentsService.markDocumentStatus(actor, input.documentId, "EXPORTED");

    return exportArtifact;
  }

  private buildJsonMasterArtifact(
    project: Project,
    document: Document,
    segments: Segment[],
    translations: SegmentTranslation[],
    workflow: WorkflowState,
    auditEvents: JsonMasterAuditEvent[]
  ): JsonMasterFormatV1 {
    return {
      formatVersion: "1.0",
      project: {
        id: project.id,
        name: project.name,
        sourceLanguage: project.sourceLanguage,
        targetLanguages: project.targetLanguages,
        domain: project.domain,
        status: this.mapProjectStatus(project.status),
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      },
      documents: [
        {
          id: document.id,
          projectId: document.projectId,
          title: document.title,
          sourceLanguage: document.sourceLanguage,
          documentType: this.mapDocumentType(document.documentType),
          segments: segments.map((segment) => ({
            id: segment.id,
            order: segment.order,
            source: {
              text: segment.sourceText
            },
            translations: translations
              .filter((translation) => translation.segmentId === segment.id)
              .map((translation) => ({
                id: translation.id,
                language: translation.targetLanguage,
                text: translation.targetText,
                status: this.mapTranslationStatus(translation.status),
                translatorId: translation.createdBy,
                createdAt: translation.createdAt,
                updatedAt: translation.updatedAt
              })),
            status: this.mapSegmentStatus(segment.status)
          }))
        }
      ],
      terminology: {
        terms: []
      },
      translationMemory: {
        entries: []
      },
      qa: {
        checks: []
      },
      workflow: {
        state: this.mapWorkflowState(workflow.status),
        events: [
          {
            id: workflow.id,
            type: "workflow_state",
            actorId: workflow.updatedBy ?? workflow.createdBy,
            createdAt: workflow.updatedAt,
            payload: {
              scope: workflow.scope,
              status: workflow.status,
              documentId: workflow.documentId
            }
          }
        ]
      },
      audit: {
        events: auditEvents
      },
      versionHistory: {
        versions: []
      }
    };
  }

  getAuditEvents(actor: ExportActor): ExportAuditEvent[] {
    this.validateActor(actor);
    return this.repository.getAuditEvents(actor.organizationId);
  }

  async getArtifact(actor: ExportActor, artifactId: string): Promise<ExportArtifact> {
    this.validateActor(actor);
    const artifact = await this.repository.findArtifactById(artifactId, actor.organizationId);

    if (!artifact) {
      throw new NotFoundException("export artifact not found.");
    }

    return artifact;
  }

  private validateActor(actor: ExportActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private collectFoundationAuditEvents(
    actor: ExportActor,
    exportAuditEvent: ExportAuditEvent
  ): JsonMasterAuditEvent[] {
    const records: FoundationAuditRecord[] = [
      ...this.authService.getAuditEvents({
        userId: actor.userId,
        organizationId: actor.organizationId,
        roles: []
      }),
      ...this.projectsService.getAuditEvents(actor),
      ...this.documentsService.getAuditEvents(actor),
      ...this.segmentsService.getAuditEvents(actor),
      ...this.translationsService.getAuditEvents(actor),
      ...this.repository.getAuditEvents(actor.organizationId),
      exportAuditEvent
    ];

    return records
      .map((event) => this.mapAuditEvent(event))
      .sort((left, right) => left.timestamp.localeCompare(right.timestamp));
  }

  private mapAuditEvent(event: FoundationAuditRecord): JsonMasterAuditEvent {
    return {
      id: event.id,
      actorId: event.actorId,
      action: event.action,
      entityType: event.entityType,
      entityId: event.entityId,
      before: this.toAuditRecord(event.beforeState),
      after: this.toAuditRecord(event.afterState),
      timestamp: event.createdAt
    };
  }

  private toAuditRecord(value: object | null | undefined): object | null | undefined {
    return value;
  }

  private mapProjectStatus(status: Project["status"]): JsonMasterStatus {
    return status === "ARCHIVED" ? "archived" : "active";
  }

  private mapDocumentType(documentType: string): JsonMasterFormatV1["documents"][number]["documentType"] {
    if (
      ["book", "article", "technical_document", "subtitle_script", "media_transcript", "other"].includes(
        documentType
      )
    ) {
      return documentType as JsonMasterFormatV1["documents"][number]["documentType"];
    }

    return "other";
  }

  private mapSegmentStatus(status: Segment["status"]): SegmentStatus {
    const statusMap: Record<Segment["status"], SegmentStatus> = {
      NEW: "new",
      IN_TRANSLATION: "in_translation",
      TRANSLATED: "translated",
      IN_REVIEW: "in_review",
      APPROVED: "approved"
    };

    return statusMap[status];
  }

  private mapTranslationStatus(status: SegmentTranslation["status"]): TranslationStatus {
    const statusMap: Record<SegmentTranslation["status"], TranslationStatus> = {
      DRAFT: "draft",
      SUBMITTED: "human_edited",
      VALIDATED: "reviewed",
      APPROVED: "approved"
    };

    return statusMap[status];
  }

  private mapWorkflowState(status: WorkflowState["status"]): JsonMasterWorkflow["state"] {
    if (status === "DRAFT") {
      return "draft";
    }

    if (status === "IN_TRANSLATION" || status === "IN_QA" || status === "IN_SEMANTIC_REVIEW") {
      return "translation";
    }

    if (status === "IN_REVIEW" || status === "BLOCKED") {
      return "review";
    }

    if (status === "APPROVED" || status === "READY_FOR_EXPORT") {
      return "approved";
    }

    return "published";
  }
}
