export type AuthorManuscriptType =
  | "BOOK"
  | "ARTICLE"
  | "MAGAZINE_ARTICLE"
  | "CHILDREN_BOOK"
  | "SCRIPT";

export type AuthorManuscriptStatus =
  | "DRAFT"
  | "IN_REVISION"
  | "SUBMITTED"
  | "IN_EDITORIAL_REVIEW"
  | "ARCHIVED";

export type AuthorSectionType =
  | "CHAPTER"
  | "SECTION"
  | "SCENE"
  | "SYNOPSIS"
  | "OUTLINE";

export type AuthorNoteType =
  | "PRIVATE_AUTHOR_NOTE"
  | "RESEARCH_NOTE"
  | "CHARACTER_NOTE"
  | "GLOSSARY_NOTE"
  | "STYLE_PREFERENCE"
  | "AUTHOR_EDITOR_COMMENT"
  | "REVISION_REQUEST";

export type AuthorSubmissionStatus =
  | "SUBMITTED_TO_EDITORIAL"
  | "DOCUMENT_LINKED"
  | "DOCUMENT_CREATION_REQUESTED";

export type AuthorStudioAuditAction =
  | "AUTHOR_MANUSCRIPT_CREATED"
  | "AUTHOR_SECTION_CREATED"
  | "AUTHOR_DRAFT_SAVED"
  | "AUTHOR_NOTE_CREATED"
  | "AUTHOR_MANUSCRIPT_SUBMITTED"
  | "AUTHOR_MANUSCRIPT_ARCHIVED";

export interface AuthorStudioActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface AuthorManuscript {
  id: string;
  organizationId: string;
  authorId: string;
  projectId?: string;
  documentId?: string;
  title: string;
  subtitle?: string;
  language: string;
  genre?: string;
  manuscriptType: AuthorManuscriptType;
  status: AuthorManuscriptStatus;
  synopsis?: string;
  outline?: string;
  stylePreferences?: string[];
  authorAttribution: {
    authorId: string;
    retained: true;
  };
  aiSuggestionsAdvisoryOnly: true;
  publicExposure: false;
  humanEditorialApprovalRequired: true;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  archivedAt?: string;
}

export interface AuthorManuscriptSection {
  id: string;
  organizationId: string;
  manuscriptId: string;
  sectionType: AuthorSectionType;
  title: string;
  orderIndex: number;
  parentSectionId?: string;
  synopsis?: string;
  outline?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorDraft {
  id: string;
  organizationId: string;
  manuscriptId: string;
  sectionId: string;
  content: string;
  version: number;
  autosave: boolean;
  autosaveMetadata?: {
    savedAt: string;
    source: "MANUAL_SAVE" | "AUTOSAVE";
  };
  wordCount: number;
  characterCount: number;
  aiSuggestionApplied: false;
  createdBy: string;
  createdAt: string;
}

export interface AuthorNote {
  id: string;
  organizationId: string;
  manuscriptId: string;
  authorId: string;
  noteType: AuthorNoteType;
  title?: string;
  content: string;
  privateToAuthor: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorSubmissionEvent {
  id: string;
  organizationId: string;
  manuscriptId: string;
  authorId: string;
  projectId?: string;
  documentId?: string;
  status: AuthorSubmissionStatus;
  workflowStatus: "PENDING_EDITORIAL_WORKFLOW";
  createOrLinkDocument: "LINK_EXISTING_DOCUMENT" | "CREATE_DOCUMENT_REQUESTED";
  humanEditorialApprovalRequired: true;
  aiInitiated: false;
  submittedAt: string;
}

export interface AuthorStudioAuditEvent {
  id: string;
  organizationId: string;
  manuscriptId?: string;
  sectionId?: string;
  draftId?: string;
  noteId?: string;
  submissionEventId?: string;
  action: AuthorStudioAuditAction;
  actorId: string;
  beforeState?: AuthorManuscript | AuthorDraft | AuthorNote;
  afterState?: AuthorManuscript | AuthorManuscriptSection | AuthorDraft | AuthorNote | AuthorSubmissionEvent;
  createdAt: string;
}

export interface CreateAuthorManuscriptInput {
  title: string;
  subtitle?: string;
  language: string;
  genre?: string;
  manuscriptType: AuthorManuscriptType;
  projectId?: string;
  documentId?: string;
  synopsis?: string;
  outline?: string;
  stylePreferences?: string[];
}

export interface CreateAuthorSectionInput {
  sectionType: AuthorSectionType;
  title: string;
  orderIndex?: number;
  parentSectionId?: string;
  synopsis?: string;
  outline?: string;
  notes?: string;
}

export interface SaveAuthorDraftInput {
  content: string;
  autosave?: boolean;
}

export interface CreateAuthorNoteInput {
  noteType: AuthorNoteType;
  title?: string;
  content: string;
  privateToAuthor?: boolean;
}

export interface SubmitAuthorManuscriptInput {
  projectId?: string;
  documentId?: string;
  aiInitiated?: boolean;
}

export interface AuthorStudioRepository {
  createManuscript(manuscript: AuthorManuscript): Promise<AuthorManuscript>;
  updateManuscript(manuscript: AuthorManuscript): Promise<AuthorManuscript>;
  findManuscriptById(id: string, organizationId: string): Promise<AuthorManuscript | null>;
  listManuscriptsByAuthor(organizationId: string, authorId: string): Promise<AuthorManuscript[]>;
  listManuscriptsByOrganization(organizationId: string): Promise<AuthorManuscript[]>;
  createSection(section: AuthorManuscriptSection): Promise<AuthorManuscriptSection>;
  findSectionById(id: string, organizationId: string): Promise<AuthorManuscriptSection | null>;
  listSectionsForManuscript(manuscriptId: string, organizationId: string): Promise<AuthorManuscriptSection[]>;
  createDraft(draft: AuthorDraft): Promise<AuthorDraft>;
  findLatestDraftForSection(
    sectionId: string,
    organizationId: string
  ): Promise<AuthorDraft | null>;
  createNote(note: AuthorNote): Promise<AuthorNote>;
  createSubmissionEvent(event: AuthorSubmissionEvent): Promise<AuthorSubmissionEvent>;
  appendAuditEvent(event: AuthorStudioAuditEvent): Promise<void>;
}
