import { formatLanguageLocale } from "@laborator/shared";
import { apiGet, type ApiResult } from "./api-client";
import {
  listDocuments,
  listProjects,
  type DocumentRecord,
  type ProjectRecord
} from "./projects-documents-api";
import { getRightsWarningsForDocument, type RightsWarning } from "./rights-workspace-client";
import type { ReviewWorkflowState, ReviewWorkflowStatus } from "./review-workspace-client";
import type {
  WorkspaceSegmentRecord,
  WorkspaceTranslationRecord
} from "./translation-workspace-client";

export type PipelineStepStatus =
  | "COMPLETED"
  | "IN_PROGRESS"
  | "NEEDS_ATTENTION"
  | "LOCKED"
  | "READY";

export interface EditorialPipelineIndexProject {
  currentStepLabel: string;
  documentCount: number;
  href: string;
  id: string;
  languageSummary: string;
  name: string;
  status: ProjectRecord["status"];
  warningCount: number;
}

export interface EditorialPipelineIndexData {
  documentsError: string | null;
  projects: EditorialPipelineIndexProject[];
  projectsError: string | null;
}

export interface EditorialPipelineStep {
  completionPercent: number;
  continueHref?: string;
  id: string;
  locked: boolean;
  openHref?: string;
  sourceModules: string[];
  status: PipelineStepStatus;
  summary: string;
  title: string;
  warnings: string[];
}

export interface AudiobookPipelineState {
  audiobookStatus: "PREVIEW_AVAILABLE" | "LOCKED" | "READY_FOR_GENERATION";
  exportFormats: ["MP3", "M4B"];
  generateHref?: string;
  language: string;
  narrator: string;
  officialLockedReason?: string;
  previewAvailable: true;
  previewHref?: string;
  progressPercent: number;
  voice: string;
}

export interface VideoPipelineState {
  exportFormat: "MP4";
  exportStatus: "NOT_READY" | "READY_FOR_EXPORT";
  generateHref?: string;
  officialLockedReason?: string;
  previewAvailable: boolean;
  previewHref?: string;
  progressPercent: number;
  subtitleLanguageLocale: string;
  thumbnailMetadata: string;
  videoStatus: "PREVIEW_AVAILABLE" | "LOCKED" | "READY_FOR_GENERATION";
  voiceOverSource: "AI Voice" | "Human Narration" | "Existing Audiobook";
}

export interface EditorialPipelineData {
  aiRecommendation: string;
  audiobook: AudiobookPipelineState;
  documents: DocumentRecord[];
  documentsError: string | null;
  nextStep: EditorialPipelineStep | null;
  project: ProjectRecord | null;
  projectsError: string | null;
  rightsError: string | null;
  rightsWarnings: RightsWarning[];
  selectedDocument: DocumentRecord | null;
  segments: WorkspaceSegmentRecord[];
  segmentsError: string | null;
  steps: EditorialPipelineStep[];
  translations: WorkspaceTranslationRecord[];
  translationsError: string | null;
  video: VideoPipelineState;
  workflow: ReviewWorkflowState | null;
  workflowError: string | null;
}

export async function getEditorialPipelineIndexData(): Promise<EditorialPipelineIndexData> {
  const [projectsResult, documentsResult] = await Promise.all([listProjects(), listDocuments()]);
  const documents = documentsResult.data ?? [];

  return {
    documentsError: documentsResult.error,
    projects: (projectsResult.data ?? []).map((project) => {
      const projectDocuments = documents.filter((document) => document.projectId === project.id);
      const firstDocument = projectDocuments[0];
      const currentStepLabel = resolveIndexCurrentStep(firstDocument);
      const warningCount = projectDocuments.filter((document) => hasLanguageMismatch(project, document)).length;

      return {
        currentStepLabel,
        documentCount: projectDocuments.length,
        href: `/pipeline/${encodeURIComponent(project.id)}${firstDocument ? `?documentId=${encodeURIComponent(firstDocument.id)}` : ""}`,
        id: project.id,
        languageSummary: formatProjectLanguages(project),
        name: project.name,
        status: project.status,
        warningCount
      };
    }),
    projectsError: projectsResult.error
  };
}

export async function getEditorialPipelineData(input: {
  documentId?: string;
  projectId: string;
}): Promise<EditorialPipelineData> {
  const [projectsResult, documentsResult] = await Promise.all([
    listProjects(),
    listDocuments(input.projectId)
  ]);
  const project = (projectsResult.data ?? []).find((item) => item.id === input.projectId) ?? null;
  const documents = documentsResult.data ?? [];
  const selectedDocument = input.documentId
    ? documents.find((document) => document.id === input.documentId) ?? null
    : documents[0] ?? null;

  if (!project || !selectedDocument) {
    const steps = buildPipelineSteps({
      project,
      rightsWarnings: [],
      selectedDocument,
      segments: [],
      translations: [],
      workflow: null
    });

    return {
      aiRecommendation: buildAiRecommendation(steps),
      audiobook: buildAudiobookState({
        approvedForOfficialAudio: false,
        project,
        rightsWarnings: [],
        selectedDocument
      }),
      documents,
      documentsError: documentsResult.error,
      nextStep: findNextStep(steps),
      project,
      projectsError: projectsResult.error,
      rightsError: null,
      rightsWarnings: [],
      selectedDocument,
      segments: [],
      segmentsError: null,
      steps,
      translations: [],
      translationsError: null,
      video: buildVideoState({
        approvedForOfficialVideo: false,
        officialAudiobookAvailable: false,
        project,
        rightsWarnings: [],
        selectedDocument
      }),
      workflow: null,
      workflowError: null
    };
  }

  const [segmentsResult, translationsResult, workflowResult, rightsResult] = await Promise.all([
    listPipelineSegments(selectedDocument.id),
    listPipelineTranslations(selectedDocument.id),
    getPipelineWorkflowStatus({
      documentId: selectedDocument.id,
      projectId: selectedDocument.projectId
    }),
    getRightsWarningsForDocument({
      documentId: selectedDocument.id,
      projectId: selectedDocument.projectId
    })
  ]);
  const steps = buildPipelineSteps({
    project,
    rightsWarnings: rightsResult.data ?? [],
    selectedDocument,
    segments: segmentsResult.data ?? [],
    translations: translationsResult.data ?? [],
    workflow: workflowResult.data
  });

  return {
    aiRecommendation: buildAiRecommendation(steps),
    audiobook: buildAudiobookState({
      approvedForOfficialAudio: isOfficialAudiobookAvailable({
        rightsWarnings: rightsResult.data ?? [],
        selectedDocument,
        workflow: workflowResult.data
      }),
      project,
      rightsWarnings: rightsResult.data ?? [],
      selectedDocument
    }),
    documents,
    documentsError: documentsResult.error,
    nextStep: findNextStep(steps),
    project,
    projectsError: projectsResult.error,
    rightsError: rightsResult.error,
    rightsWarnings: rightsResult.data ?? [],
    selectedDocument,
    segments: segmentsResult.data ?? [],
    segmentsError: segmentsResult.error,
    steps,
    translations: translationsResult.data ?? [],
    translationsError: translationsResult.error,
    video: buildVideoState({
      approvedForOfficialVideo: isOfficialVideoAvailable({
        rightsWarnings: rightsResult.data ?? [],
        selectedDocument,
        workflow: workflowResult.data
      }),
      officialAudiobookAvailable: isOfficialAudiobookAvailable({
        rightsWarnings: rightsResult.data ?? [],
        selectedDocument,
        workflow: workflowResult.data
      }),
      project,
      rightsWarnings: rightsResult.data ?? [],
      selectedDocument
    }),
    workflow: workflowResult.data,
    workflowError: workflowResult.error
  };
}

function buildPipelineSteps(input: {
  project: ProjectRecord | null;
  rightsWarnings: RightsWarning[];
  selectedDocument: DocumentRecord | null;
  segments: WorkspaceSegmentRecord[];
  translations: WorkspaceTranslationRecord[];
  workflow: ReviewWorkflowState | null;
}): EditorialPipelineStep[] {
  const { project, rightsWarnings, selectedDocument, segments, translations, workflow } = input;
  const importWarnings = selectedDocument ? [] : ["Missing manuscript or document."];
  const languageWarnings = selectedDocument && project
    ? buildLanguageWarnings(project, selectedDocument)
    : [];
  const rightsMessages = rightsWarnings.map((warning) => warning.message);
  const analysisWarnings = [...rightsMessages, ...languageWarnings];
  const hasDocument = Boolean(selectedDocument);
  const hasSegments = segments.length > 0;
  const hasTranslations = translations.length > 0;
  const workflowStatus = workflow?.status;
  const reviewStarted = isWorkflowAtLeast(workflowStatus, "IN_REVIEW");
  const approved = isWorkflowAtLeast(workflowStatus, "APPROVED") || selectedDocument?.status === "APPROVED" || selectedDocument?.status === "EXPORTED";
  const exported = workflowStatus === "EXPORTED" || selectedDocument?.status === "EXPORTED";
  const readyForExport = workflowStatus === "READY_FOR_EXPORT";
  const translationComplete = hasTranslations || segments.some((segment) => segment.status === "TRANSLATED" || segment.status === "APPROVED");
  const exportWarnings = approved && !exported ? ["Export missing."] : [];
  const distributionHref = selectedDocument ? `/distribution?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined;
  const magazineHref = selectedDocument ? `/magazine/${encodeURIComponent(selectedDocument.projectId)}` : "/magazine";
  const magazineCandidate = isMagazineDocumentType(selectedDocument?.documentType);
  const publishingRightsMissing = rightsWarnings.some((warning) =>
    warning.code === "PUBLICATION_AUTHORIZATION_MISSING" ||
    warning.code === "PUBLICATION_NOT_AUTHORIZED"
  );
  const preflightWarnings = buildPreflightWarnings({
    approved,
    exported,
    publishingRightsMissing,
    readyForExport,
    selectedDocument
  });
  const officialAudiobookAvailable = isOfficialAudiobookAvailable({
    rightsWarnings,
    selectedDocument,
    workflow
  });
  const officialVideoAvailable = isOfficialVideoAvailable({
    rightsWarnings,
    selectedDocument,
    workflow
  });

  return [
    {
      completionPercent: hasDocument ? 100 : 0,
      continueHref: "/author-studio",
      id: "import",
      locked: false,
      openHref: "/author-studio",
      sourceModules: ["Author Studio"],
      status: hasDocument ? "COMPLETED" : "IN_PROGRESS",
      summary: hasDocument
        ? `Manuscript linked as ${selectedDocument?.title}.`
        : "Create or import the manuscript before production can continue.",
      title: "Import Manuscript",
      warnings: importWarnings
    },
    {
      completionPercent: hasDocument && analysisWarnings.length === 0 ? 100 : hasDocument ? 55 : 0,
      continueHref: selectedDocument
        ? `/rights?projectId=${encodeURIComponent(selectedDocument.projectId)}&documentId=${encodeURIComponent(selectedDocument.id)}`
        : undefined,
      id: "analysis",
      locked: !hasDocument,
      openHref: selectedDocument
        ? `/rights?projectId=${encodeURIComponent(selectedDocument.projectId)}&documentId=${encodeURIComponent(selectedDocument.id)}`
        : undefined,
      sourceModules: ["Research", "AI", "Language Policy", "Rights metadata"],
      status: !hasDocument ? "LOCKED" : analysisWarnings.length > 0 ? "NEEDS_ATTENTION" : "COMPLETED",
      summary: "Language metadata, rights signals, and research context are checked before editing.",
      title: "Automatic Analysis",
      warnings: analysisWarnings
    },
    {
      completionPercent: hasSegments ? 100 : hasDocument ? 45 : 0,
      continueHref: selectedDocument ? `/author-studio` : undefined,
      id: "editing",
      locked: !hasDocument,
      openHref: "/author-studio",
      sourceModules: ["Author Studio", "Preview Audio"],
      status: !hasDocument ? "LOCKED" : hasSegments ? "COMPLETED" : "IN_PROGRESS",
      summary: hasSegments
        ? `${segments.length} segments available for editorial editing. Preview Audio can be regenerated after edits.`
        : "Open Author Studio to continue manuscript editing. Preview Audio remains draft-only.",
      title: "Editing",
      warnings: hasSegments ? [] : ["Missing segments."]
    },
    {
      completionPercent: translationComplete ? 100 : hasSegments ? 45 : 0,
      continueHref: selectedDocument ? `/translation?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined,
      id: "translation",
      locked: !hasSegments,
      openHref: selectedDocument ? `/translation?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined,
      sourceModules: ["Translation Workspace", "Language Policy", "Preview Audio"],
      status: !hasSegments ? "LOCKED" : translationComplete ? "COMPLETED" : "IN_PROGRESS",
      summary: translationComplete
        ? "Translation content is available for review."
        : "Translate the prepared segments. Preview Audio can read selected text, section, chapter, or manuscript draft.",
      title: "Translation",
      warnings: hasSegments ? [] : ["Editing must prepare segments before translation."]
    },
    {
      completionPercent: reviewStarted ? 100 : hasTranslations ? 40 : 0,
      continueHref: selectedDocument ? `/review?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined,
      id: "editorial-review",
      locked: !translationComplete,
      openHref: selectedDocument ? `/review?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined,
      sourceModules: ["Review Workspace"],
      status: !translationComplete ? "LOCKED" : reviewStarted ? "COMPLETED" : "READY",
      summary: "Editors compare source and target text, issues, terminology, and semantic reports.",
      title: "Editorial Review",
      warnings: translationComplete ? [] : ["Translation is not ready for review."]
    },
    {
      completionPercent: approved ? 100 : reviewStarted ? 60 : 0,
      continueHref: selectedDocument ? `/workflow-center?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined,
      id: "editorial-validation",
      locked: !reviewStarted,
      openHref: selectedDocument ? `/workflow-center?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined,
      sourceModules: ["Workflow"],
      status: !reviewStarted ? "LOCKED" : approved ? "COMPLETED" : "READY",
      summary: "Human workflow approval confirms the editorial text can move toward layout.",
      title: "Editorial Validation",
      warnings: approved ? [] : ["Missing approvals."]
    },
    {
      completionPercent: readyForExport || exported ? 100 : approved ? 35 : 0,
      continueHref: selectedDocument ? `/publishing?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined,
      id: "layout",
      locked: !approved,
      openHref: selectedDocument ? `/publishing?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined,
      sourceModules: ["Publishing Layout"],
      status: !approved ? "LOCKED" : readyForExport || exported ? "COMPLETED" : "READY",
      summary: "Layout preparation uses the publishing workspace; no duplicate editor is created here.",
      title: "Layout",
      warnings: approved ? [] : ["Editorial validation required."]
    },
    {
      completionPercent: exported ? 100 : readyForExport ? 70 : approved ? 35 : 0,
      continueHref: selectedDocument ? `/publishing?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined,
      id: "export",
      locked: !approved,
      openHref: selectedDocument ? `/publishing?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined,
      sourceModules: ["Export Center"],
      status: !approved ? "LOCKED" : exported ? "COMPLETED" : readyForExport ? "READY" : "IN_PROGRESS",
      summary: "Generate JSON Master and publication-ready formats through the existing export flow.",
      title: "Export",
      warnings: exportWarnings
    },
    {
      completionPercent: exported && preflightWarnings.length === 0 ? 100 : readyForExport ? 65 : approved ? 35 : 0,
      continueHref: distributionHref,
      id: "technical-validation",
      locked: !approved,
      openHref: distributionHref,
      sourceModules: ["Preflight", "Export", "Rights", "Publishing", "Distribution Center"],
      status: !approved ? "LOCKED" : preflightWarnings.length > 0 ? "NEEDS_ATTENTION" : "READY",
      summary: "Preflight validates ISBN, metadata, rights/provenance, cover, fonts, image resolution, table of contents, hyperlinks, PDF print, EPUB, MOBI, JSON Master, audiobook, video, and magazine flipbook readiness.",
      title: "Technical Validation",
      warnings: preflightWarnings
    },
    {
      completionPercent: exported ? 75 : 0,
      continueHref: selectedDocument ? `/workflow-center?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined,
      id: "final-approval",
      locked: !exported,
      openHref: selectedDocument ? `/workflow-center?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined,
      sourceModules: ["Workflow"],
      status: !exported ? "LOCKED" : "READY",
      summary: "Authorized humans perform final approval. AI cannot approve workflow or publication.",
      title: "Final Approval",
      warnings: exported ? [] : ["Export required before final approval."]
    },
    {
      completionPercent: exported ? 50 : 0,
      continueHref: distributionHref,
      id: "publication",
      locked: !exported,
      openHref: distributionHref,
      sourceModules: ["Distribution Center", "Publishing Workspace", "Public Portal"],
      status: !exported ? "LOCKED" : "READY",
      summary: "Publication opens the Distribution Center for print PDF, digital PDF, EPUB, MOBI, audiobook, video, magazine flipbook, and public portal readiness.",
      title: "Publication",
      warnings: exported
        ? preflightWarnings.length > 0
          ? ["Resolve preflight blockers before publication."]
          : []
        : ["Final approval and export are required before publication."]
    },
    {
      completionPercent: officialAudiobookAvailable ? 25 : 0,
      continueHref: selectedDocument ? `/publishing?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined,
      id: "audiobook",
      locked: !officialAudiobookAvailable,
      openHref: selectedDocument ? `/publishing?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined,
      sourceModules: ["Audio Narration", "Publishing Workspace", "Human Final Authority"],
      status: !officialAudiobookAvailable ? "LOCKED" : "READY",
      summary: "Optional official audiobook production uses the final approved text, chapter structure, narrator metadata, cover, and export metadata.",
      title: "Audiobook (optional)",
      warnings: officialAudiobookAvailable
        ? []
        : [
            publishingRightsMissing
              ? "Publishing rights are required before official audiobook generation."
              : "Final approval is required before official audiobook generation."
          ]
    },
    {
      completionPercent: officialVideoAvailable ? 25 : 0,
      continueHref: selectedDocument ? `/publishing?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined,
      id: "video",
      locked: !officialVideoAvailable,
      openHref: selectedDocument ? `/publishing?documentId=${encodeURIComponent(selectedDocument.id)}` : undefined,
      sourceModules: ["Video Production", "Subtitles", "Voice-over", "Publishing Workspace"],
      status: !officialVideoAvailable ? "LOCKED" : "READY",
      summary: "Optional official video production uses final approved manuscript text, optional official audiobook narration, subtitles, thumbnail metadata, and MP4 export metadata.",
      title: "Video (optional)",
      warnings: officialVideoAvailable
        ? []
        : [
            publishingRightsMissing
              ? "Publishing rights are required before official video generation."
              : "Final approval is required before official video generation."
          ]
    },
    {
      completionPercent: magazineCandidate && exported ? 50 : magazineCandidate && approved ? 25 : 0,
      continueHref: magazineHref,
      id: "magazine-digital-outputs",
      locked: !magazineCandidate,
      openHref: magazineHref,
      sourceModules: ["Magazine", "Publishing", "Export", "Rights", "Public Portal"],
      status: !magazineCandidate ? "LOCKED" : exported ? "READY" : approved ? "IN_PROGRESS" : "LOCKED",
      summary: "Optional magazine digital outputs connect PDF/exported layout, flipbook readiness, article audio/video previews, rights warnings, and public portal visibility.",
      title: "Magazine Digital Outputs (optional)",
      warnings: !magazineCandidate
        ? []
        : publishingRightsMissing
          ? ["Publishing rights are required before magazine digital outputs."]
          : exported
            ? []
            : ["Approved or exported magazine content is required before digital issue output."]
    }
  ];
}

function buildAiRecommendation(steps: EditorialPipelineStep[]): string {
  const next = findNextStep(steps);

  if (!next) {
    return "Production workflow is complete. AI can summarize release notes, but publication remains a human decision.";
  }

  if (next.warnings.length > 0) {
    return `Next action: resolve ${next.title.toLowerCase()} warnings before moving forward.`;
  }

  return `Next action: continue with ${next.title}. AI may summarize progress, suggest media timing, or detect blockers, but cannot approve or publish.`;
}

function buildAudiobookState(input: {
  approvedForOfficialAudio: boolean;
  project: ProjectRecord | null;
  rightsWarnings: RightsWarning[];
  selectedDocument: DocumentRecord | null;
}): AudiobookPipelineState {
  const { approvedForOfficialAudio, project, rightsWarnings, selectedDocument } = input;
  const language = selectedDocument
    ? formatLanguageLocale(
        selectedDocument.targetLanguage ?? selectedDocument.authoringLanguage ?? selectedDocument.sourceLanguage,
        selectedDocument.targetLocale ?? selectedDocument.authoringLocale ?? selectedDocument.originalLocale
      )
    : project
      ? formatLanguageLocale(project.targetLanguages[0] ?? project.sourceLanguage, project.targetLocales?.[0] ?? project.originalLocale)
      : "Not selected";
  const publicationRightsWarning = rightsWarnings.find((warning) =>
    warning.code === "PUBLICATION_AUTHORIZATION_MISSING" ||
    warning.code === "PUBLICATION_NOT_AUTHORIZED"
  );

  return {
    audiobookStatus: approvedForOfficialAudio ? "READY_FOR_GENERATION" : "LOCKED",
    exportFormats: ["MP3", "M4B"],
    generateHref: approvedForOfficialAudio && selectedDocument
      ? `/publishing?documentId=${encodeURIComponent(selectedDocument.id)}`
      : undefined,
    language,
    narrator: "Narrator metadata pending",
    officialLockedReason:
      publicationRightsWarning?.message ??
      "Official audiobook requires final approved text and publishing rights.",
    previewAvailable: true,
    previewHref: selectedDocument
      ? `/translation?documentId=${encodeURIComponent(selectedDocument.id)}`
      : "/author-studio",
    progressPercent: approvedForOfficialAudio ? 25 : 0,
    voice: "Draft studio voice"
  };
}

function buildVideoState(input: {
  approvedForOfficialVideo: boolean;
  officialAudiobookAvailable: boolean;
  project: ProjectRecord | null;
  rightsWarnings: RightsWarning[];
  selectedDocument: DocumentRecord | null;
}): VideoPipelineState {
  const {
    approvedForOfficialVideo,
    officialAudiobookAvailable,
    project,
    rightsWarnings,
    selectedDocument
  } = input;
  const subtitleLanguageLocale = selectedDocument
    ? formatLanguageLocale(
        selectedDocument.targetLanguage ?? selectedDocument.authoringLanguage ?? selectedDocument.sourceLanguage,
        selectedDocument.targetLocale ?? selectedDocument.authoringLocale ?? selectedDocument.originalLocale
      )
    : project
      ? formatLanguageLocale(project.targetLanguages[0] ?? project.sourceLanguage, project.targetLocales?.[0] ?? project.originalLocale)
      : "Not selected";
  const publicationRightsWarning = rightsWarnings.find((warning) =>
    warning.code === "PUBLICATION_AUTHORIZATION_MISSING" ||
    warning.code === "PUBLICATION_NOT_AUTHORIZED"
  );
  const previewHref = selectedDocument
    ? `/translation?documentId=${encodeURIComponent(selectedDocument.id)}`
    : project
      ? "/author-studio"
      : undefined;

  return {
    exportFormat: "MP4",
    exportStatus: approvedForOfficialVideo ? "READY_FOR_EXPORT" : "NOT_READY",
    generateHref: approvedForOfficialVideo && selectedDocument
      ? `/publishing?documentId=${encodeURIComponent(selectedDocument.id)}`
      : undefined,
    officialLockedReason:
      publicationRightsWarning?.message ??
      "Official video requires final approved text and publishing rights.",
    previewAvailable: Boolean(previewHref),
    previewHref,
    progressPercent: approvedForOfficialVideo ? 25 : 0,
    subtitleLanguageLocale,
    thumbnailMetadata: "Thumbnail and cover metadata pending",
    videoStatus: approvedForOfficialVideo ? "READY_FOR_GENERATION" : selectedDocument ? "PREVIEW_AVAILABLE" : "LOCKED",
    voiceOverSource: officialAudiobookAvailable ? "Existing Audiobook" : "AI Voice"
  };
}

function findNextStep(steps: EditorialPipelineStep[]): EditorialPipelineStep | null {
  return steps.find((step) => step.status !== "COMPLETED" && !step.locked) ?? null;
}

function isOfficialAudiobookAvailable(input: {
  rightsWarnings: RightsWarning[];
  selectedDocument: DocumentRecord | null;
  workflow: ReviewWorkflowState | null;
}): boolean {
  const { rightsWarnings, selectedDocument, workflow } = input;
  const publicationBlocked = rightsWarnings.some((warning) =>
    warning.code === "PUBLICATION_AUTHORIZATION_MISSING" ||
    warning.code === "PUBLICATION_NOT_AUTHORIZED"
  );
  const finalTextApproved =
    workflow?.status === "EXPORTED" ||
    selectedDocument?.status === "EXPORTED";

  return finalTextApproved && !publicationBlocked;
}

function isOfficialVideoAvailable(input: {
  rightsWarnings: RightsWarning[];
  selectedDocument: DocumentRecord | null;
  workflow: ReviewWorkflowState | null;
}): boolean {
  return isOfficialAudiobookAvailable(input);
}

function isMagazineDocumentType(documentType: string | undefined): boolean {
  if (!documentType) {
    return false;
  }

  const normalized = documentType.toUpperCase();

  return normalized === "MAGAZINE" ||
    normalized === "MAGAZINE_ARTICLE" ||
    normalized === "ARTICLE" ||
    normalized.includes("MAGAZINE");
}

function buildPreflightWarnings(input: {
  approved: boolean;
  exported: boolean;
  publishingRightsMissing: boolean;
  readyForExport: boolean;
  selectedDocument: DocumentRecord | null;
}): string[] {
  const warnings: string[] = [];
  const { approved, exported, publishingRightsMissing, readyForExport, selectedDocument } = input;

  if (!selectedDocument) {
    warnings.push("Document metadata is required for preflight.");
  }

  if (!approved) {
    warnings.push("Human approval is required before technical validation.");
  }

  if (!readyForExport && !exported) {
    warnings.push("READY_FOR_EXPORT or exported status is required before distribution readiness.");
  }

  if (publishingRightsMissing) {
    warnings.push("Rights/provenance blockers must be resolved before publication.");
  }

  if (!exported) {
    warnings.push("JSON Master and production exports must be checked before publication.");
  }

  return warnings;
}

function buildLanguageWarnings(project: ProjectRecord, document: DocumentRecord): string[] {
  const warnings: string[] = [];
  const originalLanguage = document.originalLanguage ?? project.originalLanguage ?? project.sourceLanguage;
  const authoringLanguage = document.authoringLanguage ?? document.sourceLanguage;

  if (!originalLanguage) {
    warnings.push("Missing original language metadata.");
  }

  if (!authoringLanguage) {
    warnings.push("Missing current manuscript language metadata.");
  }

  if (!document.targetLanguage) {
    warnings.push("Missing translation target language.");
  }

  if (hasLanguageMismatch(project, document)) {
    warnings.push("Language mismatch between project and selected document.");
  }

  return warnings;
}

function hasLanguageMismatch(project: ProjectRecord, document: DocumentRecord): boolean {
  if (project.id !== document.projectId) {
    return true;
  }

  return Boolean(
    project.originalLanguage &&
    document.originalLanguage &&
    project.originalLanguage !== document.originalLanguage
  );
}

function formatProjectLanguages(project: ProjectRecord): string {
  const original = formatLanguageLocale(project.originalLanguage ?? project.sourceLanguage, project.originalLocale);
  const targets = project.targetLanguages
    .map((language, index) => formatLanguageLocale(language, project.targetLocales?.[index]))
    .join(", ");

  return `${original} -> ${targets}`;
}

function resolveIndexCurrentStep(document: DocumentRecord | undefined): string {
  if (!document) {
    return "Import Manuscript";
  }

  if (document.status === "EXPORTED") {
    return "Publication";
  }

  if (document.status === "APPROVED") {
    return "Layout";
  }

  if (document.status === "IN_REVIEW") {
    return "Editorial Review";
  }

  if (document.status === "IN_TRANSLATION") {
    return "Translation";
  }

  return "Automatic Analysis";
}

function isWorkflowAtLeast(
  status: ReviewWorkflowStatus | undefined,
  threshold: ReviewWorkflowStatus
): boolean {
  if (!status) {
    return false;
  }

  return workflowOrder(status) >= workflowOrder(threshold);
}

function workflowOrder(status: ReviewWorkflowStatus): number {
  const order: Record<ReviewWorkflowStatus, number> = {
    DRAFT: 0,
    IN_TRANSLATION: 1,
    IN_QA: 2,
    IN_SEMANTIC_REVIEW: 3,
    IN_REVIEW: 4,
    APPROVED: 5,
    READY_FOR_EXPORT: 6,
    EXPORTED: 7,
    BLOCKED: -1
  };

  return order[status];
}

function listPipelineSegments(documentId: string): Promise<ApiResult<WorkspaceSegmentRecord[]>> {
  return apiGet<WorkspaceSegmentRecord[]>(`/segments?documentId=${encodeURIComponent(documentId)}`);
}

function listPipelineTranslations(documentId: string): Promise<ApiResult<WorkspaceTranslationRecord[]>> {
  return apiGet<WorkspaceTranslationRecord[]>(
    `/translations?documentId=${encodeURIComponent(documentId)}`
  );
}

function getPipelineWorkflowStatus(input: {
  documentId: string;
  projectId?: string;
}): Promise<ApiResult<ReviewWorkflowState>> {
  const query = new URLSearchParams({
    documentId: input.documentId
  });

  if (input.projectId) {
    query.set("projectId", input.projectId);
  }

  return apiGet<ReviewWorkflowState>(`/workflow/status?${query.toString()}`);
}
