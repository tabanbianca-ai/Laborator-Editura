import Link from "next/link";
import {
  createSectionAction,
  saveDraftAction
} from "../../lib/author-studio-actions";
import type {
  AuthorManuscript,
  AuthorManuscriptWorkspace,
  AuthorSectionDraft
} from "../../lib/author-studio-client";
import { Badge, Button, Card, EmptyState, ErrorState, Input, PageHeader, Select } from "../ui";

interface AuthorStudioDetailPageProps {
  draftError?: string;
  sectionError?: string;
  workspace: AuthorManuscriptWorkspace;
}

const sectionTypeOptions = [
  { label: "Chapter", value: "CHAPTER" },
  { label: "Section", value: "SECTION" },
  { label: "Scene", value: "SCENE" },
  { label: "Synopsis", value: "SYNOPSIS" },
  { label: "Outline", value: "OUTLINE" }
];

export function AuthorStudioDetailPage({
  draftError,
  sectionError,
  workspace
}: AuthorStudioDetailPageProps) {
  const manuscript = workspace.manuscript;

  if (workspace.manuscriptError || !manuscript) {
    return (
      <main className="page-stack">
        <PageHeader
          actions={
            <Link className="ui-button ui-button-secondary ui-button-md" href="/author-studio">
              Back to manuscripts
            </Link>
          }
          eyebrow="Author Studio"
          title="Manuscript"
        />
        <ErrorState message={workspace.manuscriptError ?? "Manuscript could not be loaded."} />
      </main>
    );
  }

  return (
    <main className="page-stack">
      <PageHeader
        actions={
          <Link className="ui-button ui-button-secondary ui-button-md" href="/author-studio">
            Back to manuscripts
          </Link>
        }
        eyebrow="Author Studio"
        title={manuscript.title}
      />

      {sectionError ? <ErrorState message={sectionError} /> : null}
      {draftError ? <ErrorState message={draftError} /> : null}
      {workspace.sectionsError ? <ErrorState message={workspace.sectionsError} /> : null}
      {workspace.draftError ? <ErrorState message={workspace.draftError} /> : null}

      <section className="manuscript-detail-grid" aria-label="Manuscript metadata">
        <Card title="Manuscript">
          <dl className="metadata-list">
            <div>
              <dt>Status</dt>
              <dd>
                <Badge tone={toneForStatus(manuscript.status)}>{manuscript.status.replace(/_/g, " ")}</Badge>
              </dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{manuscript.manuscriptType.replace(/_/g, " ")}</dd>
            </div>
            <div>
              <dt>Language</dt>
              <dd>{formatLanguage(manuscript.authoringLanguage ?? manuscript.language, manuscript.authoringLocale)}</dd>
            </div>
            <div>
              <dt>Original language</dt>
              <dd>{formatLanguage(manuscript.originalLanguage ?? manuscript.language, manuscript.originalLocale)}</dd>
            </div>
            <div>
              <dt>Authoring language</dt>
              <dd>{formatLanguage(manuscript.authoringLanguage ?? manuscript.language, manuscript.authoringLocale)}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{formatDate(manuscript.updatedAt)}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Attribution">
          <dl className="metadata-list">
            <div>
              <dt>Author ID</dt>
              <dd>{manuscript.authorAttribution.authorId}</dd>
            </div>
            <div>
              <dt>Translator</dt>
              <dd>{manuscript.translatorAttribution?.translatorName ?? "Not assigned"}</dd>
            </div>
            <div>
              <dt>Original author</dt>
              <dd>{manuscript.authorAttribution.retained ? "Preserved" : "Review"}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Private author notes">
          <textarea
            className="ui-input manuscript-textarea"
            disabled
            placeholder="Private notes placeholder"
            rows={4}
          />
        </Card>

        <Card title="Autosave metadata">
          <AutosaveSummary sections={workspace.sections} />
        </Card>
      </section>

      <section className="manuscript-workspace" aria-label="Manuscript writing workspace">
        <Card title="Create section">
          <form action={createSectionAction} className="manuscript-form">
            <input name="manuscriptId" type="hidden" value={manuscript.id} />
            <div className="manuscript-form-grid">
              <Input label="Title" name="title" required />
              <Select label="Type" name="sectionType" options={sectionTypeOptions} />
              <Input label="Order" min={1} name="orderIndex" type="number" />
            </div>
            <Input label="Synopsis" name="synopsis" />
            <Input label="Outline" name="outline" />
            <Input label="Notes" name="notes" />
            <div className="form-actions">
              <Button type="submit" variant="secondary">
                Add section
              </Button>
            </div>
          </form>
        </Card>

        <div className="section-editor-stack">
          {workspace.sections.length === 0 ? (
            <EmptyState title="No sections" />
          ) : (
            workspace.sections.map((entry) => (
              <SectionEditor entry={entry} key={entry.section.id} manuscript={manuscript} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function SectionEditor({
  entry,
  manuscript
}: {
  entry: AuthorSectionDraft;
  manuscript: AuthorManuscript;
}) {
  const { draft, section } = entry;

  return (
    <Card>
      <div className="section-editor-heading">
        <div>
          <p className="section-kicker">{section.sectionType.replace(/_/g, " ")}</p>
          <h2>{section.title}</h2>
        </div>
        <Badge tone={draft ? "success" : "warning"}>{draft ? `Version ${draft.version}` : "No draft"}</Badge>
      </div>

      <form action={saveDraftAction} className="manuscript-form">
        <input name="manuscriptId" type="hidden" value={manuscript.id} />
        <input name="sectionId" type="hidden" value={section.id} />
        <label className="ui-input-field">
          <span>Draft</span>
          <textarea
            className="ui-input manuscript-draft-textarea"
            defaultValue={draft?.content ?? ""}
            name="content"
            rows={12}
          />
        </label>
        <div className="manuscript-editor-footer">
          <label className="manuscript-checkbox">
            <input name="autosave" type="checkbox" />
            <span>Autosave metadata</span>
          </label>
          <div className="draft-metadata">
            <span>{draft ? `${draft.wordCount} words` : "0 words"}</span>
            <span>{draft ? `${draft.characterCount} characters` : "0 characters"}</span>
            <span>{draft?.autosaveMetadata?.source ?? "Manual save"}</span>
          </div>
          <Button type="submit">Save draft</Button>
        </div>
      </form>
    </Card>
  );
}

function AutosaveSummary({ sections }: { sections: AuthorSectionDraft[] }) {
  const latestAutosave = sections
    .map((entry) => entry.draft?.autosaveMetadata)
    .filter((metadata): metadata is NonNullable<typeof metadata> => Boolean(metadata))
    .sort((left, right) => right.savedAt.localeCompare(left.savedAt))[0];

  if (!latestAutosave) {
    return <EmptyState title="No autosave metadata" />;
  }

  return (
    <dl className="metadata-list">
      <div>
        <dt>Source</dt>
        <dd>{latestAutosave.source.replace(/_/g, " ")}</dd>
      </div>
      <div>
        <dt>Saved</dt>
        <dd>{formatDate(latestAutosave.savedAt)}</dd>
      </div>
    </dl>
  );
}

function toneForStatus(status: AuthorManuscript["status"]) {
  if (status === "SUBMITTED" || status === "IN_EDITORIAL_REVIEW") {
    return "info";
  }

  if (status === "ARCHIVED") {
    return "neutral";
  }

  return status === "DRAFT" ? "warning" : "success";
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatLanguage(language: string, locale?: string): string {
  return locale ? `${language.toUpperCase()} · ${locale}` : language.toUpperCase();
}
