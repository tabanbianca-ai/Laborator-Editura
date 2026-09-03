import { formatLanguageLocale } from "@laborator/shared";

import { apiGet } from "./api-client";
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
export type MagazinePublicationStatus =
  | "DRAFT"
  | "IN_PRODUCTION"
  | "READY"
  | "PUBLISHED"
  | "NEEDS_RIGHTS";
export type MagazinePublicPortalVisibility = "HIDDEN" | "READY" | "VISIBLE";

type MagazineWorkflowIssueStatus =
  | "DRAFT"
  | "STRUCTURE_PLANNED"
  | "ARTICLES_IN_PRODUCTION"
  | "READY_FOR_LAYOUT"
  | "LAYOUT_ASSEMBLED"
  | "GLOBAL_CONTROL_PASSED"
  | "PREFLIGHT_PASSED"
  | "FINAL_APPROVED"
  | "PUBLISHED"
  | "WITHDRAWN"
  | "REPUBLICATION_IN_PROGRESS"
  | "REPUBLISHED";

interface MagazineWorkflowQualityGateIssue {
  code: string;
  message: string;
  severity: "PASS" | "WARNING" | "BLOCKED";
  reviewSeverity?: "MINOR" | "MAJOR" | "CRITICAL";
  sourceComponent: string;
}

interface MagazineWorkflowIssueOverview {
  issue: {
    id: string;
    title: string;
    language: string;
    status: MagazineWorkflowIssueStatus;
    updatedAt: string;
    currentOfficialVersionId?: string;
    currentOfficialVersionFlag?: {
      reviewItemId: string;
      severity: "CRITICAL";
      reason: string;
    };
    preflight?: {
      status: "PASS" | "WARNING" | "BLOCKED";
    };
    layoutPublicationPlanId?: string;
  };
  articles: Array<{
    id: string;
    documentId?: string;
    title: string;
    language: string;
    status: string;
    readyForIssue: boolean;
    readyForIssueBlockers: string[];
    updatedAt: string;
    provenance?: {
      sourceOfRecordId?: string;
      sourceVersionId?: string;
      derivedFromId?: string;
      derivedFromVersionId?: string;
      derivationType?: string;
      sourceLanguage?: string;
      targetLanguage?: string;
      translatorName?: string;
    };
    components: Array<{
      id: string;
      componentType: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" | "TRANSCRIPT" | "SUBTITLE";
      status: "DRAFT" | "VALIDATED" | "NEEDS_REVIEW" | "OUTDATED" | "FAILED";
    }>;
  }>;
  reviewItems: Array<{
    id: string;
    articleId?: string;
    componentId?: string;
    severity: "MINOR" | "MAJOR" | "CRITICAL";
    status: "OPEN" | "RESOLVED" | "OVERRIDDEN";
    blocksPublication: boolean;
    title: string;
    description: string;
  }>;
  currentOfficialVersion?: {
    id: string;
    status: "DRAFT" | "OFFICIAL" | "WITHDRAWN" | "SUPERSEDED";
    previousVersionId?: string;
    supersededByVersionId?: string;
  };
  qualityGate: {
    blockers: MagazineWorkflowQualityGateIssue[];
    completionPercentage: number;
    warnings: MagazineWorkflowQualityGateIssue[];
  };
}

export interface MagazineIssueSummary {
  articleCount: number;
  currentOfficialVersionId?: string;
  href: string;
  id: string;
  languageLabel: string;
  pdfExportStatus: MagazineReadinessStatus;
  publicPortalVisibility: MagazinePublicPortalVisibility;
  publicationStatus: MagazinePublicationStatus;
  qualityGateCompletion?: number;
  qualityGateStatus?: "PASS" | "WARNING" | "BLOCKED";
  reviewSummary?: MagazineReviewSummary;
  rightsWarningCount: number;
  title: string;
  updatedAt: string;
  flipbookStatus: MagazineReadinessStatus;
  workflowStatus?: string;
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
  readyForIssue?: boolean;
  readyForIssueBlockers?: string[];
  reviewItems?: MagazineReviewSummary;
  sourceOfRecord?: string;
  sourceVersion?: string;
  derivationType?: string;
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

export interface MagazineReviewSummary {
  minor: number;
  major: number;
  critical: number;
  blocking: number;
  overridden: number;
}

export interface MagazineIssueExperience extends MagazineIssueSummary {
  articles: MagazineArticleExperience[];
  project: ProjectRecord;
  rightsWarnings: RightsWarning[];
}

export interface MagazineExperienceIndexData {
  documentsError: string | null;
  issues: MagazineIssueSummary[];
  magazineWorkflowError: string | null;
  projectsError: string | null;
}

export interface MagazineIssueExperienceData {
  documentsError: string | null;
  issue: MagazineIssueExperience | null;
  magazineWorkflowError: string | null;
  projectsError: string | null;
}

export async function getMagazineExperienceIndexData(): Promise<MagazineExperienceIndexData> {
  const [workflowResult, projectsResult, documentsResult] = await Promise.all([
    listMagazineWorkflowIssues(),
    listProjects(),
    listDocuments()
  ]);
  const projects = projectsResult.data ?? [];
  const documents = documentsResult.data ?? [];
  const workflowIssues = workflowResult.data ?? [];

  return {
    documentsError: documentsResult.error,
    issues:
      workflowIssues.length > 0
        ? workflowIssues.map(buildWorkflowIssueSummary)
        : buildIssueSummaries(projects, documents),
    magazineWorkflowError: workflowResult.error,
    projectsError: projectsResult.error
  };
}

export async function getMagazineIssueExperienceData(input: {
  issueId: string;
}): Promise<MagazineIssueExperienceData> {
  const [workflowResult, projectsResult, documentsResult] = await Promise.all([
    getMagazineWorkflowIssue(input.issueId),
    listProjects(),
    listDocuments()
  ]);
  const projects = projectsResult.data ?? [];
  const documents = documentsResult.data ?? [];

  if (workflowResult.data) {
    return {
      documentsError: documentsResult.error,
      issue: buildWorkflowIssueExperience(workflowResult.data),
      magazineWorkflowError: null,
      projectsError: projectsResult.error
    };
  }

  const project = projects.find((item) => item.id === input.issueId) ?? null;

  if (!project) {
    return {
      documentsError: documentsResult.error,
      issue: null,
      magazineWorkflowError: workflowResult.error,
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
    magazineWorkflowError: workflowResult.error,
    projectsError: projectsResult.error
  };
}

function listMagazineWorkflowIssues() {
  return apiGet<MagazineWorkflowIssueOverview[]>("/magazine-workflow/issues");
}

function getMagazineWorkflowIssue(issueId: string) {
  return apiGet<MagazineWorkflowIssueOverview>(
    `/magazine-workflow/issues/${encodeURIComponent(issueId)}`
  );
}

function buildWorkflowIssueSummary(
  overview: MagazineWorkflowIssueOverview
): MagazineIssueSummary {
  const rightsWarnings = rightsWarningsFromQualityGate(overview);
  const officialPublished =
    overview.issue.status === "PUBLISHED" || overview.issue.status === "REPUBLISHED";
  const ready = [
    "READY_FOR_LAYOUT",
    "LAYOUT_ASSEMBLED",
    "GLOBAL_CONTROL_PASSED",
    "PREFLIGHT_PASSED",
    "FINAL_APPROVED"
  ].includes(overview.issue.status);

  return {
    articleCount: overview.articles.length,
    currentOfficialVersionId: overview.issue.currentOfficialVersionId,
    flipbookStatus: officialPublished
      ? "PUBLISHED"
      : overview.issue.layoutPublicationPlanId
        ? "READY"
        : "NOT_READY",
    href: `/magazine/${encodeURIComponent(overview.issue.id)}`,
    id: overview.issue.id,
    languageLabel: formatLanguageLocale(overview.issue.language),
    pdfExportStatus: officialPublished
      ? "PUBLISHED"
      : overview.issue.preflight?.status === "PASS"
        ? "READY"
        : "NOT_READY",
    publicPortalVisibility: officialPublished ? "VISIBLE" : ready ? "READY" : "HIDDEN",
    publicationStatus:
      rightsWarnings.length > 0
        ? "NEEDS_RIGHTS"
        : officialPublished
          ? "PUBLISHED"
          : ready
            ? "READY"
            : overview.issue.status === "DRAFT" ||
                overview.issue.status === "STRUCTURE_PLANNED"
              ? "DRAFT"
              : "IN_PRODUCTION",
    qualityGateCompletion: overview.qualityGate.completionPercentage,
    qualityGateStatus:
      overview.qualityGate.blockers.length > 0
        ? "BLOCKED"
        : overview.qualityGate.warnings.length > 0
          ? "WARNING"
          : "PASS",
    reviewSummary: summarizeReviewItems(overview.reviewItems),
    rightsWarningCount: rightsWarnings.length,
    title: overview.issue.title,
    updatedAt: overview.issue.updatedAt,
    workflowStatus: overview.issue.status
  };
}

function buildWorkflowIssueExperience(
  overview: MagazineWorkflowIssueOverview
): MagazineIssueExperience {
  const summary = buildWorkflowIssueSummary(overview);
  const rightsWarnings = rightsWarningsFromQualityGate(overview);

  return {
    ...summary,
    articles: overview.articles.map((article) =>
      buildWorkflowArticleExperience(
        article,
        overview.reviewItems.filter((item) => item.articleId === article.id)
      )
    ),
    project: {
      createdAt: overview.issue.updatedAt,
      createdBy: "",
      id: overview.issue.id,
      name: overview.issue.title,
      sourceLanguage: overview.issue.language,
      originalLanguage: overview.issue.language,
      status: "ACTIVE",
      targetLanguages: [],
      updatedAt: overview.issue.updatedAt,
      publicationType: "MAGAZINE"
    },
    rightsWarnings
  };
}

function buildWorkflowArticleExperience(
  article: MagazineWorkflowIssueOverview["articles"][number],
  reviewItems: MagazineWorkflowIssueOverview["reviewItems"]
): MagazineArticleExperience {
  const languageLabel = formatLanguageLocale(article.language);
  const audioReady = article.components.some(
    (component) => component.componentType === "AUDIO" && component.status === "VALIDATED"
  );
  const videoReady = article.components.some(
    (component) => component.componentType === "VIDEO" && component.status === "VALIDATED"
  );
  const media = buildArticleMediaExperience({
    audioReady: audioReady && article.readyForIssue,
    languageLabel,
    lockedReason: article.readyForIssue
      ? undefined
      : "Official article media requires Ready for Issue.",
    videoReady: videoReady && article.readyForIssue
  });

  return {
    ...media,
    documentId: article.documentId ?? article.id,
    documentType: "MAGAZINE_ARTICLE",
    languageLabel,
    publicationStatus: article.readyForIssue
      ? "READY"
      : article.status === "DRAFT"
        ? "DRAFT"
        : "IN_PRODUCTION",
    readyForIssue: article.readyForIssue,
    readyForIssueBlockers: article.readyForIssueBlockers,
    reviewItems: summarizeReviewItems(reviewItems),
    rightsWarnings: [],
    sourceOfRecord: article.provenance?.sourceOfRecordId,
    sourceVersion: article.provenance?.sourceVersionId,
    derivationType: article.provenance?.derivationType,
    title: article.title,
    updatedAt: article.updatedAt
  };
}

function summarizeReviewItems(
  reviewItems: MagazineWorkflowIssueOverview["reviewItems"] = []
): MagazineReviewSummary {
  const activeItems = reviewItems.filter((item) => item.status !== "RESOLVED");

  return {
    minor: activeItems.filter((item) => item.severity === "MINOR").length,
    major: activeItems.filter((item) => item.severity === "MAJOR").length,
    critical: activeItems.filter((item) => item.severity === "CRITICAL").length,
    blocking: activeItems.filter((item) => item.blocksPublication).length,
    overridden: reviewItems.filter((item) => item.status === "OVERRIDDEN").length
  };
}

function rightsWarningsFromQualityGate(
  overview: MagazineWorkflowIssueOverview
): RightsWarning[] {
  return [...overview.qualityGate.blockers, ...overview.qualityGate.warnings]
    .filter((issue) => issue.sourceComponent === "RIGHTS")
    .map((issue) => ({
      code:
        issue.code === "PUBLISHING_AUTHORIZATION_MISSING" ||
        issue.code === "PUBLISHING_NOT_AUTHORIZED"
          ? (issue.code.replace("PUBLISHING", "PUBLICATION") as RightsWarning["code"])
          : (issue.code as RightsWarning["code"]),
      message: issue.message,
      severity: issue.severity === "BLOCKED" ? "danger" : "warning"
    }));
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
    .sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    );
}

function resolveIssueDocuments(
  project: ProjectRecord,
  documents: DocumentRecord[]
): DocumentRecord[] {
  const projectDocuments = documents.filter(
    (document) => document.projectId === project.id
  );
  const magazineDocuments = projectDocuments.filter(isMagazineDocument);

  return (magazineDocuments.length > 0 ? magazineDocuments : projectDocuments).sort(
    (left, right) => left.title.localeCompare(right.title)
  );
}

function buildIssueSummary(
  project: ProjectRecord,
  documents: DocumentRecord[],
  rightsWarnings: RightsWarning[]
): MagazineIssueSummary {
  const hasRightsWarnings = rightsWarnings.some(
    (warning) => warning.severity === "danger"
  );
  const allExported =
    documents.length > 0 && documents.every((document) => document.status === "EXPORTED");
  const allApproved =
    documents.length > 0 &&
    documents.every(
      (document) => document.status === "APPROVED" || document.status === "EXPORTED"
    );
  const pdfExportStatus = allExported ? "PUBLISHED" : allApproved ? "READY" : "NOT_READY";
  const publicPortalVisibility = allExported
    ? "VISIBLE"
    : allApproved
      ? "READY"
      : "HIDDEN";

  return {
    articleCount: documents.length,
    flipbookStatus:
      pdfExportStatus === "PUBLISHED"
        ? "PUBLISHED"
        : pdfExportStatus === "READY"
          ? "READY"
          : "NOT_READY",
    href: `/magazine/${encodeURIComponent(project.id)}`,
    id: project.id,
    languageLabel: formatLanguageLocale(
      project.originalLanguage ?? project.sourceLanguage,
      project.originalLocale
    ),
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
  const rightsBlocked = rightsWarnings.some(
    (warning) =>
      warning.code === "PUBLICATION_AUTHORIZATION_MISSING" ||
      warning.code === "PUBLICATION_NOT_AUTHORIZED"
  );
  const officialReady = approved && !rightsBlocked;
  const officialLockedReason = officialReady
    ? undefined
    : rightsBlocked
      ? "Publishing rights are required before official article media."
      : "Official article media requires approval before generation.";
  const media = buildArticleMediaExperience({
    audioReady: officialReady,
    languageLabel,
    lockedReason: officialLockedReason,
    videoReady: officialReady
  });

  return {
    ...media,
    documentId: document.id,
    documentType: document.documentType,
    languageLabel,
    publicationStatus:
      document.status === "EXPORTED"
        ? "PUBLISHED"
        : document.status === "APPROVED"
          ? "READY"
          : document.status === "DRAFT"
            ? "DRAFT"
            : "IN_PRODUCTION",
    rightsWarnings,
    title: document.title,
    updatedAt: document.updatedAt
  };
}

function buildArticleMediaExperience(input: {
  audioReady: boolean;
  languageLabel: string;
  lockedReason?: string;
  videoReady: boolean;
}): Pick<MagazineArticleExperience, "audio" | "video"> {
  return {
    audio: {
      draftNeverPublished: true,
      languageLocale: input.languageLabel,
      narrator: "Narrator metadata pending",
      officialLockedReason: input.lockedReason,
      officialStatus: input.audioReady ? "READY" : "NOT_READY",
      previewAvailable: true,
      voice: "Draft editorial voice"
    },
    video: {
      draftNeverPublished: true,
      exportFormat: "MP4",
      officialLockedReason: input.lockedReason,
      officialStatus: input.videoReady ? "READY" : "NOT_READY",
      previewAvailable: true,
      subtitleLanguageLocale: input.languageLabel,
      thumbnailMetadata: "Thumbnail metadata pending",
      voiceOverSource: "AI Voice"
    }
  };
}

function isMagazineDocument(document: DocumentRecord): boolean {
  const documentType = document.documentType.toUpperCase();

  return (
    documentType === "MAGAZINE" ||
    documentType === "MAGAZINE_ARTICLE" ||
    documentType === "ARTICLE" ||
    documentType.includes("MAGAZINE")
  );
}
