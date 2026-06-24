import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseAuthorStudioRepository } from "./author-studio.repository";
import {
  type AuthorDraft,
  type AuthorManuscript,
  type AuthorManuscriptSection,
  type AuthorNote,
  type AuthorStudioActor,
  type AuthorStudioAuditAction,
  type AuthorSubmissionEvent,
  type CreateAuthorManuscriptInput,
  type CreateAuthorNoteInput,
  type CreateAuthorSectionInput,
  type SaveAuthorDraftInput,
  type SubmitAuthorManuscriptInput
} from "./author-studio.types";

@Injectable()
export class AuthorStudioService {
  constructor(private readonly repository: DatabaseAuthorStudioRepository) {}

  async createManuscript(
    actor: AuthorStudioActor,
    input: CreateAuthorManuscriptInput
  ): Promise<AuthorManuscript> {
    this.validateActor(actor);

    if (!input.title || !input.language || !input.manuscriptType) {
      throw new BadRequestException("title, language, and manuscriptType are required.");
    }

    const now = new Date().toISOString();
    const manuscript: AuthorManuscript = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      authorId: actor.userId,
      sourceManuscriptId: input.sourceManuscriptId,
      projectId: input.projectId,
      documentId: input.documentId,
      title: input.title,
      subtitle: input.subtitle,
      language: input.language,
      genre: input.genre,
      manuscriptType: input.manuscriptType,
      status: "DRAFT",
      synopsis: input.synopsis,
      outline: input.outline,
      stylePreferences: input.stylePreferences ?? [],
      authorAttribution: {
        authorId: actor.userId,
        retained: true
      },
      translatorAttribution: input.translatorName
        ? {
            translatorId: actor.userId,
            translatorName: input.translatorName,
            originalAuthorAttributionPreserved: true,
            visibleInEditorialRecords: true
          }
        : undefined,
      aiSuggestionsAdvisoryOnly: true,
      publicExposure: false,
      humanEditorialApprovalRequired: true,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createManuscript(manuscript);
    await this.audit("AUTHOR_MANUSCRIPT_CREATED", actor, { manuscriptId: created.id }, undefined, created);

    return created;
  }

  async listManuscripts(actor: AuthorStudioActor): Promise<AuthorManuscript[]> {
    this.validateActor(actor);

    if (this.canReviewManuscripts(actor)) {
      return this.repository.listManuscriptsByOrganization(actor.organizationId);
    }

    return this.repository.listManuscriptsByAuthor(actor.organizationId, actor.userId);
  }

  async getManuscript(actor: AuthorStudioActor, manuscriptId: string): Promise<AuthorManuscript> {
    return this.requireManuscriptAccess(actor, manuscriptId);
  }

  async addSection(
    actor: AuthorStudioActor,
    manuscriptId: string,
    input: CreateAuthorSectionInput
  ): Promise<AuthorManuscriptSection> {
    const manuscript = await this.requireAuthorOrAdmin(actor, manuscriptId);

    if (!input.sectionType || !input.title) {
      throw new BadRequestException("sectionType and title are required.");
    }

    const sections = await this.repository.listSectionsForManuscript(manuscript.id, actor.organizationId);
    const now = new Date().toISOString();
    const section: AuthorManuscriptSection = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      manuscriptId: manuscript.id,
      sectionType: input.sectionType,
      title: input.title,
      orderIndex: input.orderIndex ?? sections.length + 1,
      parentSectionId: input.parentSectionId,
      synopsis: input.synopsis,
      outline: input.outline,
      notes: input.notes,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createSection(section);
    await this.audit(
      "AUTHOR_SECTION_CREATED",
      actor,
      { manuscriptId: manuscript.id, sectionId: created.id },
      undefined,
      created
    );

    return created;
  }

  async saveDraft(actor: AuthorStudioActor, sectionId: string, input: SaveAuthorDraftInput): Promise<AuthorDraft> {
    if (input.content === undefined) {
      throw new BadRequestException("draft content is required.");
    }

    const section = await this.requireSectionAccess(actor, sectionId);
    const manuscript = await this.requireAuthorOrAdmin(actor, section.manuscriptId);
    const existing = await this.repository.findLatestDraftForSection(section.id, actor.organizationId);
    const now = new Date().toISOString();
    const autosave = input.autosave ?? false;
    const draft: AuthorDraft = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      manuscriptId: manuscript.id,
      sectionId: section.id,
      content: input.content,
      version: (existing?.version ?? 0) + 1,
      autosave,
      autosaveMetadata: {
        savedAt: now,
        source: autosave ? "AUTOSAVE" : "MANUAL_SAVE"
      },
      wordCount: this.countWords(input.content),
      characterCount: input.content.length,
      aiSuggestionApplied: false,
      createdBy: actor.userId,
      createdAt: now
    };

    const created = await this.repository.createDraft(draft);
    await this.audit(
      "AUTHOR_DRAFT_SAVED",
      actor,
      { manuscriptId: manuscript.id, sectionId: section.id, draftId: created.id },
      existing ?? undefined,
      created
    );

    return created;
  }

  async addNote(actor: AuthorStudioActor, manuscriptId: string, input: CreateAuthorNoteInput): Promise<AuthorNote> {
    const manuscript = await this.requireManuscriptAccess(actor, manuscriptId);

    if (!input.noteType || !input.content) {
      throw new BadRequestException("noteType and content are required.");
    }

    if (!this.canAuthorNote(actor, manuscript)) {
      throw new ForbiddenException("Only the author or authorized editorial roles may add manuscript notes.");
    }

    const now = new Date().toISOString();
    const note: AuthorNote = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      manuscriptId: manuscript.id,
      authorId: manuscript.authorId,
      noteType: input.noteType,
      title: input.title,
      content: input.content,
      privateToAuthor: input.privateToAuthor ?? input.noteType === "PRIVATE_AUTHOR_NOTE",
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createNote(note);
    await this.audit(
      "AUTHOR_NOTE_CREATED",
      actor,
      { manuscriptId: manuscript.id, noteId: created.id },
      undefined,
      created
    );

    return created;
  }

  async submitManuscript(
    actor: AuthorStudioActor,
    manuscriptId: string,
    input: SubmitAuthorManuscriptInput
  ): Promise<{ manuscript: AuthorManuscript; submissionEvent: AuthorSubmissionEvent }> {
    if (input.aiInitiated) {
      throw new BadRequestException("AI cannot submit manuscripts automatically.");
    }

    const existing = await this.requireAuthorOrAdmin(actor, manuscriptId);
    const now = new Date().toISOString();
    const documentId = input.documentId ?? existing.documentId;
    const projectId = input.projectId ?? existing.projectId;
    const updated: AuthorManuscript = {
      ...existing,
      projectId,
      documentId,
      status: "SUBMITTED",
      submittedAt: now,
      updatedAt: now
    };

    const saved = await this.repository.updateManuscript(updated);
    const submissionEvent: AuthorSubmissionEvent = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      manuscriptId: saved.id,
      authorId: saved.authorId,
      projectId,
      documentId,
      status: documentId ? "DOCUMENT_LINKED" : "DOCUMENT_CREATION_REQUESTED",
      workflowStatus: "PENDING_EDITORIAL_WORKFLOW",
      createOrLinkDocument: documentId ? "LINK_EXISTING_DOCUMENT" : "CREATE_DOCUMENT_REQUESTED",
      humanEditorialApprovalRequired: true,
      aiInitiated: false,
      submittedAt: now
    };

    const event = await this.repository.createSubmissionEvent(submissionEvent);
    await this.audit(
      "AUTHOR_MANUSCRIPT_SUBMITTED",
      actor,
      { manuscriptId: saved.id, submissionEventId: event.id },
      existing,
      saved
    );

    return { manuscript: saved, submissionEvent: event };
  }

  async archiveManuscript(actor: AuthorStudioActor, manuscriptId: string): Promise<AuthorManuscript> {
    const existing = await this.requireAuthorOrAdmin(actor, manuscriptId);
    const now = new Date().toISOString();
    const archived: AuthorManuscript = {
      ...existing,
      status: "ARCHIVED",
      archivedAt: now,
      updatedAt: now
    };

    const saved = await this.repository.updateManuscript(archived);
    await this.audit("AUTHOR_MANUSCRIPT_ARCHIVED", actor, { manuscriptId: saved.id }, existing, saved);

    return saved;
  }

  private async requireManuscriptAccess(actor: AuthorStudioActor, manuscriptId: string): Promise<AuthorManuscript> {
    this.validateActor(actor);
    const manuscript = await this.repository.findManuscriptById(manuscriptId, actor.organizationId);

    if (!manuscript || !this.canAccessManuscript(actor, manuscript)) {
      throw new NotFoundException("Author manuscript not found.");
    }

    return manuscript;
  }

  private async requireAuthorOrAdmin(actor: AuthorStudioActor, manuscriptId: string): Promise<AuthorManuscript> {
    const manuscript = await this.requireManuscriptAccess(actor, manuscriptId);

    if (manuscript.authorId !== actor.userId && !this.hasRole(actor, "ADMIN")) {
      throw new ForbiddenException("Only the author or an administrator may modify manuscript drafts.");
    }

    return manuscript;
  }

  private async requireSectionAccess(actor: AuthorStudioActor, sectionId: string): Promise<AuthorManuscriptSection> {
    this.validateActor(actor);
    const section = await this.repository.findSectionById(sectionId, actor.organizationId);

    if (!section) {
      throw new NotFoundException("Author manuscript section not found.");
    }

    await this.requireManuscriptAccess(actor, section.manuscriptId);
    return section;
  }

  private canAccessManuscript(actor: AuthorStudioActor, manuscript: AuthorManuscript): boolean {
    return manuscript.authorId === actor.userId || this.canReviewManuscripts(actor);
  }

  private canAuthorNote(actor: AuthorStudioActor, manuscript: AuthorManuscript): boolean {
    return manuscript.authorId === actor.userId || this.canReviewManuscripts(actor);
  }

  private canReviewManuscripts(actor: AuthorStudioActor): boolean {
    return this.hasRole(actor, "ADMIN") || this.hasRole(actor, "REVIEWER");
  }

  private hasRole(actor: AuthorStudioActor, role: string): boolean {
    return (actor.roles ?? []).some((actorRole) => actorRole.toUpperCase() === role);
  }

  private countWords(content: string): number {
    const words = content.trim().split(/\s+/).filter(Boolean);

    return words.length;
  }

  private validateActor(actor: AuthorStudioActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("Authenticated author studio context is required.");
    }
  }

  private async audit(
    action: AuthorStudioAuditAction,
    actor: AuthorStudioActor,
    target: {
      manuscriptId?: string;
      sectionId?: string;
      draftId?: string;
      noteId?: string;
      submissionEventId?: string;
    },
    beforeState: AuthorManuscript | AuthorDraft | AuthorNote | undefined,
    afterState: AuthorManuscript | AuthorManuscriptSection | AuthorDraft | AuthorNote | AuthorSubmissionEvent
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      ...target,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }
}
