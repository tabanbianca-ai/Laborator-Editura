import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type AuthorDraft,
  type AuthorManuscript,
  type AuthorManuscriptSection,
  type AuthorNote,
  type AuthorStudioAuditEvent,
  type AuthorStudioRepository,
  type AuthorSubmissionEvent
} from "./author-studio.types";

@Injectable()
export class DatabaseAuthorStudioRepository implements AuthorStudioRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createManuscript(manuscript: AuthorManuscript): Promise<AuthorManuscript> {
    return this.database.insert("author_manuscripts", manuscript);
  }

  async updateManuscript(manuscript: AuthorManuscript): Promise<AuthorManuscript> {
    return this.database.upsert("author_manuscripts", manuscript);
  }

  async findManuscriptById(id: string, organizationId: string): Promise<AuthorManuscript | null> {
    return this.database.findByIdForTenant<AuthorManuscript>("author_manuscripts", id, organizationId);
  }

  async listManuscriptsByAuthor(organizationId: string, authorId: string): Promise<AuthorManuscript[]> {
    return this.database.selectForTenant<AuthorManuscript>(
      "author_manuscripts",
      organizationId,
      (manuscript) => manuscript.authorId === authorId
    );
  }

  async listManuscriptsByOrganization(organizationId: string): Promise<AuthorManuscript[]> {
    return this.database.selectForTenant<AuthorManuscript>("author_manuscripts", organizationId);
  }

  async createSection(section: AuthorManuscriptSection): Promise<AuthorManuscriptSection> {
    return this.database.insert("author_manuscript_sections", section);
  }

  async findSectionById(id: string, organizationId: string): Promise<AuthorManuscriptSection | null> {
    return this.database.findByIdForTenant<AuthorManuscriptSection>(
      "author_manuscript_sections",
      id,
      organizationId
    );
  }

  async listSectionsForManuscript(
    manuscriptId: string,
    organizationId: string
  ): Promise<AuthorManuscriptSection[]> {
    return this.database.selectForTenant<AuthorManuscriptSection>(
      "author_manuscript_sections",
      organizationId,
      (section) => section.manuscriptId === manuscriptId
    );
  }

  async createDraft(draft: AuthorDraft): Promise<AuthorDraft> {
    return this.database.insert("author_drafts", draft);
  }

  async findLatestDraftForSection(sectionId: string, organizationId: string): Promise<AuthorDraft | null> {
    const drafts = this.database.selectForTenant<AuthorDraft>(
      "author_drafts",
      organizationId,
      (draft) => draft.sectionId === sectionId
    );

    return drafts.sort((left, right) => right.version - left.version)[0] ?? null;
  }

  async createNote(note: AuthorNote): Promise<AuthorNote> {
    return this.database.insert("author_notes", note);
  }

  async createSubmissionEvent(event: AuthorSubmissionEvent): Promise<AuthorSubmissionEvent> {
    return this.database.insert("author_submission_events", event);
  }

  async appendAuditEvent(event: AuthorStudioAuditEvent): Promise<void> {
    this.database.insert("author_studio_audit_events", event);
  }
}
