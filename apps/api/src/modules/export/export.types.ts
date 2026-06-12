import { type JsonMasterFormatV1 } from "@laborator/shared";
import { type WorkflowActor } from "../workflow/workflow.types";

export type ExportActor = WorkflowActor;

export type ExportAuditAction = "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "EXPORT";

export interface ExportDocumentInput {
  projectId: string;
  documentId: string;
}

export interface ExportArtifact {
  id: string;
  organizationId: string;
  projectId: string;
  documentId: string;
  format: "JSON_MASTER";
  artifact: JsonMasterFormatV1;
  createdBy: string;
  createdAt: string;
}

export interface ExportAuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  action: ExportAuditAction;
  entityType: "EXPORT_ARTIFACT";
  entityId: string;
  beforeState?: object | null;
  afterState?: object | null;
  createdAt: string;
}
