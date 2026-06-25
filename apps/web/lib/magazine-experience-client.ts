import { formatLanguageLocale } from "@laborator/shared";

import {
  listDocuments,
  listProjects,
  type DocumentRecord,
  type ProjectRecord
} from "./projects-documents-api";
import {
  getRightsWarningsForDocument,
  type RightsWarning
} from "./rights-workspace-client";

export type MagazineReadinessStatus = "NOT_READY" | "READY" | "PUBLISHED";
export type MagazinePublicationStatus = "DRAFT" | "IN_PRODUCTION" | "READY" | "PUBLISHED" | "NEEDS_RIGHTS";
export type MagazinePublicPortalVisibility = "HIDDEN" | "READY" | "VISIBLE";

export interface MagazineIssueSummary {
  articleCount: number;
  href: string;
  id: string;
  languageLabel: string;
  pdfExportStatus: MagazineReadinessStatus;
  publicPortalVisibility: MagazinePublicPortalVisibility;
  publicationStatus: MagazinePublicationStatus;
  rightsWarningCount: number;
  title: string;
  updatedAt: string;
  flipbookStatus: MagazineReadinessStatus;
}

export interface MagazineArticleExperience {
  audio: {
    draftNeverPublished: true;
    languageLocale: string;
    narrator: string;
    officialLockedReason?: string;
    officialStatus: MagazineReadinessStatus;
    previewAvailable: boolean;
    voice: string;
  };
  documentId: string;
  documentType: string;
  languageLabel: string;
  publicationStatus: MagazinePublicationStatus;
  rightsWarnings: RightsWarning[];
  title: string;
  updatedAt: string;
  video: {
    draftNeverPublished: true;
    exportFormat: "MP4";
    officialLockedReason?: string;
    officialStatus: MagazineReadinessStatus;
    previewAvailable: boolean;
    subtitleLanguageLocale: string;
    thumbnailMetadata: string;
    voiceOverSource: "AI Voice" | "Human Narration" | "Existing Audiobook";
  };
}

export interface MagazineIssueExperience extends MagazineIssueSummary {
  articles: MagazineArticleExperience[];
  project: ProjectRecord;
  rightsWarnings: RightsWarning[];
}

export interface MagazineExperienceIndexData {
  documentsError: string | null;
  issues: MagazineIssueSummary[];
  projectsError: string | null;
}

export interface MagazineIssueExperienceData {
  documentsError: string | null;
  issue: MagazineIssueExperience | null;
  projectsError: string | null;
}

export async function getMagazineExperienceIndexData(): Promise<MagazineExperienceIndexData> {
  const [projectsResult, documentsResult] = await Promise.all([listProjects(), listDocuments()]);
  const projects = projectsResult.data ?? [];
  const documents = documentsResult.data ?? [];

  return {
    documentsError: documentsResult.error,
    issues: buildIssueSummaries(projects, documents),
    projectsError: projectsResult.error
  };
}

export async function getMagazineIssueExperienceData(input: {
  issueId: string;
}): Promise<MagazineIssueExperienceData> {
  const [projectsResult, documentsResult] = await Promise.all([listProjects(), listDocuments()]);
  const projects = projectsResult.data ?? [];
  const documents = documentsResult.data ?? [];
  const project = projects.find((item) => item.id === input.issueId) ?? null;

  if (!project) {
    return {
      documentsError: documentsResult.error,
      issue: null,
      projectsError: projectsResult.error
    };
  }

  const articleDocuments = resolveIssueDocuments(project, documents);
  const rightsResults = await Promise.all(
    articleDocuments.map((document) =>
      getRightsWarningsForDocument({
        documentId: document.id,
        projectId: document.projectId
      })
    )
  );
  const rightsWarnings = rightsResults.flatMap((result) => result.data ?? []);
  const articles = articleDocuments.map((document, index) =>
    buildArticleExperience(document, rightsResults[index]?.data ?? [])
  );
  const issueSummary = buildIssueSummary(project, articleDocuments, rightsWarnings);

  return {
    documentsError: documentsResult.error,
    issue: {
      ...issueSummary,
      articles,
      project,
      rightsWarnings
    },
    projectsError: projectsResult.error
  };
}

function buildIssueSummaries(
  projects: ProjectRecord[],
  documents: DocumentRecord[]
): MagazineIssueSummary[] {
  return projects
    .map((project) => {
      const issueDocuments = resolveIssueDocuments(project, documents);

      return issueDocuments.length > 0
        ? buildIssueSummary(project, issueDocuments, [])
        : null;
    })
    .filter((issue): issue is MagazineIssueSummary => Boolean(issue))
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
}

function resolveIssueDocuments(
  project: ProjectRecord,
  documents: DocumentRecord[]
): DocumentRecord[] {
  const projectDocuments = documents.filter((document) => document.projectId === project.id);
  const magazineDocuments = projectDocuments.filter(isMagazineDocument);

  return (magazineDocuments.length > 0 ? magazineDocuments : projectDocuments)
    .sort((left, right) => left.title.localeCompare(right.title));
}

function buildIssueSummary(
  project: ProjectRecord,
  documents: DocumentRecord[],
  rightsWarnings: RightsWarning[]
): MagazineIssueSummary {
  const hasRightsWarnings = rightsWarnings.some((warning) => warning.severity === "danger");
  const allExported = documents.length > 0 && documents.every((document) => document.status === "EXPORTED");
  const allApproved = documents.length > 0 && documents.every((document) =>
    document.status === "APPROVED" || document.status === "EXPORTED"
  );
  const pdfExportStatus = allExported ? "PUBLISHED" : allApproved ? "READY" : "NOT_READY";
  const publicPortalVisibility = allExported ? "VISIBLE" : allApproved ? "READY" : "HIDDEN";

  return {
    articleCount: documents.length,
    flipbookStatus: pdfExportStatus === "PUBLISHED"
      ? "PUBLISHED"
      : pdfExportStatus === "READY"
        ? "READY"
        : "NOT_READY",
    href: `/magazine/${encodeURIComponent(project.id)}`,
    id: project.id,
    languageLabel: formatLanguageLocale(project.originalLanguage ?? project.sourceLanguage, project.originalLocale),
    pdfExportStatus,
    publicPortalVisibility,
    publicationStatus: hasRightsWarnings
      ? "NEEDS_RIGHTS"
      : allExported
        ? "PUBLISHED"
        : allApproved
          ? "READY"
          : documents.some((document) => document.status !== "DRAFT")
            ? "IN_PRODUCTION"
            : "DRAFT",
    rightsWarningCount: rightsWarnings.length,
    title: project.name,
    updatedAt: project.updatedAt
  };
}

function buildArticleExperience(
  document: DocumentRecord,
  rightsWarnings: RightsWarning[]
): MagazineArticleExperience {
  const languageLabel = formatLanguageLocale(
    document.targetLanguage ?? document.authoringLanguage ?? document.sourceLanguage,
    document.targetLocale ?? document.authoringLocale ?? document.originalLocale
  );
  const approved = document.status === "APPROVED" || document.status === "EXPORTED";
  const rightsBlocked = rightsWarnings.some((warning) =>
    warning.code === "PUBLICATION_AUTHORIZATION_MISSING" ||
    warning.code === "PUBLICATION_NOT_AUTHORIZED"
  );
  const officialReady = approved && !rightsBlocked;
  const officialLockedReason = officialReady
    ? undefined
    : rightsBlocked
      ? "Publishing rights are required before official article media."
      : "Official article media requires approval before generation.";

  return {
    audio: {
      draftNeverPublished: true,
      languageLocale: languageLabel,
      narrator: "Narrator metadata pending",
      officialLockedReason,
      officialStatus: officialReady ? "READY" : "NOT_READY",
      previewAvailable: true,
      voice: "Draft editorial voice"
    },
    documentId: document.id,
    documentType: document.documentType,
    languageLabel,
    publicationStatus: document.status === "EXPORTED"
      ? "PUBLISHED"
      : document.status === "APPROVED"
        ? "READY"
        : document.status === "DRAFT"
          ? "DRAFT"
          : "IN_PRODUCTION",
    rightsWarnings,
    title: document.title,
    updatedAt: document.updatedAt,
    video: {
      draftNeverPublished: true,
      exportFormat: "MP4",
      officialLockedReason,
      officialStatus: officialReady ? "READY" : "NOT_READY",
      previewAvailable: true,
      subtitleLanguageLocale: languageLabel,
      thumbnailMetadata: "Thumbnail metadata pending",
      voiceOverSource: "AI Voice"
    }
  };
}

function isMagazineDocument(document: DocumentRecord): boolean {
  const documentType = document.documentType.toUpperCase();

  return documentType === "MAGAZINE" ||
    documentType === "MAGAZINE_ARTICLE" ||
    documentType === "ARTICLE" ||
    documentType.includes("MAGAZINE");
}
