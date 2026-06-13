import { apiGet, type ApiResult } from "./api-client";

export interface ProjectRecord {
  createdAt: string;
  createdBy: string;
  description?: string;
  domain?: string;
  id: string;
  name: string;
  sourceLanguage: string;
  status: "ACTIVE" | "ARCHIVED";
  targetLanguages: string[];
  updatedAt: string;
}

export interface DocumentRecord {
  createdAt: string;
  createdBy: string;
  documentType: string;
  id: string;
  projectId: string;
  sourceLanguage: string;
  status: "DRAFT" | "IN_TRANSLATION" | "IN_REVIEW" | "APPROVED" | "EXPORTED";
  targetLanguage: string;
  title: string;
  updatedAt: string;
}

export function listProjects(): Promise<ApiResult<ProjectRecord[]>> {
  return apiGet<ProjectRecord[]>("/projects");
}

export function listDocuments(projectId?: string): Promise<ApiResult<DocumentRecord[]>> {
  const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";

  return apiGet<DocumentRecord[]>(`/documents${query}`);
}
