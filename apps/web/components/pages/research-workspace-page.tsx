import type { ComponentProps } from "react";
import Link from "next/link";
import { formatLanguageLocale } from "@laborator/shared";
import { createResearchSourceAction } from "../../lib/research-workspace-actions";
import type {
  ResearchCollectionRecord,
  ResearchEntityRecord,
  ResearchNoteRecord,
  ResearchRelationshipRecord,
  ResearchSearchResult,
  ResearchSourceRecord,
  ResearchSourceType,
  ResearchVisibility,
  ResearchWorkspaceData
} from "../../lib/research-workspace-client";
import { Badge, Button, Card, EmptyState, ErrorState, Input, PageHeader, Select, Table } from "../ui";

type BadgeTone = ComponentProps<typeof Badge>["tone"];

interface ResearchWorkspacePageProps {
  error?: string;
  query?: string;
  sourceType?: string;
  tags?: string;
  workspace: ResearchWorkspaceData;
}

const sourceTypeOptions: Array<{ label: string; value: ResearchSourceType }> = [
  { label: "Book", value: "BOOK" },
  { label: "PDF", value: "PDF" },
  { label: "Article", value: "ARTICLE" },
  { label: "Manuscript", value: "MANUSCRIPT" },
  { label: "Magazine", value: "MAGAZINE" },
  { label: "Website reference", value: "WEBSITE_REFERENCE" },
  { label: "Historical document", value: "HISTORICAL_DOCUMENT" },
  { label: "Multimedia reference", value: "MULTIMEDIA_REFERENCE" }
];

const visibilityOptions: Array<{ label: string; value: ResearchVisibility }> = [
  { label: "Private", value: "PRIVATE" },
  { label: "Team", value: "TEAM" },
  { label: "Organization", value: "ORGANIZATION" },
  { label: "Public reference", value: "PUBLIC_REFERENCE" }
];

export function ResearchWorkspacePage({
  error,
  query,
  sourceType,
  tags,
  workspace
}: ResearchWorkspacePageProps) {
  const search = workspace.search ?? emptySearchResult();

  return (
    <main className="page-stack">
      <PageHeader eyebrow="Research Hub" title="Research & knowledge workspace" />

      {error ? <ErrorState message={error} /> : null}
      {workspace.sourcesError ? <ErrorState message={workspace.sourcesError} /> : null}
      {workspace.selectedSourceError ? <ErrorState message={workspace.selectedSourceError} /> : null}
      {workspace.searchError ? <ErrorState message={workspace.searchError} /> : null}

      <ResearchDashboard search={search} sources={workspace.sources} />
      <ResearchSearchForm query={query} sourceType={sourceType} tags={tags} />

      <section className="research-workspace-grid" aria-label="Research source management">
        <ResearchSourceList
          selectedSourceId={workspace.selectedSource?.id}
          sources={workspace.sources}
        />
        <ResearchSourceDetail source={workspace.selectedSource} />
        <CreateResearchSourceForm />
      </section>

      <section className="research-workspace-grid research-workspace-grid-wide" aria-label="Knowledge panels">
        <NotesPanel notes={search.notes} selectedSourceId={workspace.selectedSource?.id} />
        <EntitiesPanel entities={search.entities} />
      </section>

      <section className="research-workspace-grid research-workspace-grid-wide" aria-label="Relationships and collections">
        <RelationshipsPanel relationships={search.relationships} />
        <CollectionsPanel collections={search.collections} />
      </section>
    </main>
  );
}

function ResearchDashboard({
  search,
  sources
}: {
  search: ResearchSearchResult;
  sources: ResearchSourceRecord[];
}) {
  return (
    <section className="metric-grid" aria-label="Research knowledge overview">
      <Card>
        <div className="metric-card">
          <span>Sources</span>
          <strong>{sources.length}</strong>
          <Badge tone="info">Research</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Notes</span>
          <strong>{search.notes.length}</strong>
          <Badge tone="neutral">Knowledge</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Entities</span>
          <strong>{search.entities.length}</strong>
          <Badge tone="info">Graph</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Collections</span>
          <strong>{search.collections.length}</strong>
          <Badge tone="success">Organized</Badge>
        </div>
      </Card>
    </section>
  );
}

function ResearchSearchForm({
  query,
  sourceType,
  tags
}: {
  query?: string;
  sourceType?: string;
  tags?: string;
}) {
  return (
    <section className="content-panel">
      <form action="/research" className="research-search-form" method="get">
        <Input defaultValue={query ?? ""} label="Search" name="query" placeholder="Author, source, entity, citation" />
        <Input defaultValue={tags ?? ""} label="Tags" name="tags" placeholder="spiritism, philosophy" />
        <Select
          defaultValue={sourceType ?? ""}
          label="Source type"
          name="sourceType"
          options={[
            { label: "Any source type", value: "" },
            ...sourceTypeOptions
          ]}
        />
        <Button type="submit">Search research</Button>
      </form>
    </section>
  );
}

function ResearchSourceList({
  selectedSourceId,
  sources
}: {
  selectedSourceId?: string;
  sources: ResearchSourceRecord[];
}) {
  return (
    <Card className="research-panel-card" title="Research source list">
      {sources.length === 0 ? (
        <EmptyState title="No research sources" />
      ) : (
        <div className="research-source-list">
          {sources.map((source) => (
            <Link
              className={
                source.id === selectedSourceId
                  ? "research-source-link research-source-link-active"
                  : "research-source-link"
              }
              href={`/research?sourceId=${encodeURIComponent(source.id)}`}
              key={source.id}
            >
              <strong>{source.title}</strong>
              <span>{source.author ?? "Unknown author"}</span>
              <Badge tone={toneForVisibility(source.visibility)}>{source.visibility}</Badge>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

function ResearchSourceDetail({ source }: { source: ResearchSourceRecord | null }) {
  if (!source) {
    return (
      <Card className="research-panel-card" title="Source detail panel">
        <EmptyState title="No source selected" />
      </Card>
    );
  }

  return (
    <Card className="research-panel-card" title="Source detail panel">
      <div className="reference-stack">
        <div className="research-source-title">
          <div>
            <strong>{source.title}</strong>
            <span>{source.author ?? "Unknown author"}</span>
          </div>
          <Badge tone={toneForVisibility(source.visibility)}>{source.visibility}</Badge>
        </div>
        <MetadataGrid source={source} />
        <TagsDisplay tags={source.tags} />
        <AiPolicyDisplay source={source} />
      </div>
    </Card>
  );
}

function MetadataGrid({ source }: { source: ResearchSourceRecord }) {
  const rows = [
    ["Title", source.title],
    ["Author", source.author ?? "Not recorded"],
    ["Language", formatLanguage(source.language, source.locale)],
    [
      "Original",
      source.originalLanguage ? formatLanguage(source.originalLanguage, source.originalLocale) : "Not recorded"
    ],
    [
      "Current manuscript",
      source.authoringLanguage ? formatLanguage(source.authoringLanguage, source.authoringLocale) : "Not recorded"
    ],
    [
      "Translation target",
      source.targetLanguage ? formatLanguage(source.targetLanguage, source.targetLocale) : "Not recorded"
    ],
    ["First publication year", source.firstPublicationYear?.toString() ?? "Not recorded"],
    ["Source type", source.sourceType.replace(/_/g, " ")],
    ["Citation", source.citation ?? "Citation pending"]
  ];

  return (
    <dl className="research-metadata-grid">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function TagsDisplay({ tags }: { tags: string[] }) {
  return (
    <div className="research-tag-list" aria-label="Tags display">
      {tags.length === 0 ? (
        <Badge tone="neutral">No tags</Badge>
      ) : (
        tags.map((tag) => (
          <Badge key={tag} tone="neutral">
            {tag}
          </Badge>
        ))
      )}
    </div>
  );
}

function AiPolicyDisplay({ source }: { source: ResearchSourceRecord }) {
  return (
    <div className="research-ai-policy">
      <p className="section-kicker">AI policy display</p>
      <div className="research-policy-grid">
        <PolicySignal label="summarizeSources" value={source.aiPolicy.summarizeSources} />
        <PolicySignal label="extractConcepts" value={source.aiPolicy.extractConcepts} />
        <PolicySignal label="suggestRelations" value={source.aiPolicy.suggestRelations} />
        <PolicySignal label="mayModifyOriginalSources" value={source.aiPolicy.mayModifyOriginalSources} />
      </div>
      <p className="review-human-authority">
        Human Final Authority: AI may suggest research support but cannot alter citations or original sources.
      </p>
    </div>
  );
}

function PolicySignal({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="signal-row">
      <span>{label}</span>
      <Badge tone={value ? "success" : "danger"}>{String(value)}</Badge>
    </div>
  );
}

function CreateResearchSourceForm() {
  return (
    <Card className="research-panel-card" title="Create research source">
      <form action={createResearchSourceAction} className="research-source-form">
        <Input label="Title" name="title" required />
        <Input label="Author" name="author" />
        <div className="research-form-row">
          <Input label="Language" name="language" placeholder="ro" required />
          <Input label="Locale" name="locale" placeholder="ro-RO" />
        </div>
        <div className="research-form-row">
          <Input label="Original language" name="originalLanguage" placeholder="fr" />
          <Input label="Original locale" name="originalLocale" placeholder="fr-FR" />
        </div>
        <div className="research-form-row">
          <Input label="Current manuscript language" name="authoringLanguage" placeholder="ro" />
          <Input label="Current manuscript locale" name="authoringLocale" placeholder="ro-RO" />
        </div>
        <div className="research-form-row">
          <Input label="Translation target" name="targetLanguage" placeholder="en" />
          <Input label="Target locale" name="targetLocale" placeholder="en-GB" />
        </div>
        <div className="research-form-row">
          <Input label="First publication year" name="firstPublicationYear" type="number" />
          <Select label="Visibility" name="visibility" options={visibilityOptions} />
        </div>
        <Select label="Source type" name="sourceType" options={sourceTypeOptions} required />
        <Input label="Tags" name="tags" placeholder="spiritism, history" />
        <label className="ui-input-field">
          <span>Citation</span>
          <textarea className="ui-input research-textarea" name="citation" rows={3} />
        </label>
        <label className="ui-input-field">
          <span>Notes</span>
          <textarea className="ui-input research-textarea" name="notes" rows={4} />
        </label>
        <div className="form-actions">
          <Button type="submit">Create source</Button>
        </div>
      </form>
    </Card>
  );
}

function NotesPanel({
  notes,
  selectedSourceId
}: {
  notes: ResearchNoteRecord[];
  selectedSourceId?: string;
}) {
  const visibleNotes = selectedSourceId
    ? notes.filter((note) => !note.sourceId || note.sourceId === selectedSourceId)
    : notes;

  return (
    <Card title="Notes panel">
      {visibleNotes.length === 0 ? (
        <EmptyState title="No research notes" />
      ) : (
        <div className="reference-stack">
          {visibleNotes.map((note) => (
            <ReferenceItem
              key={note.id}
              label={note.title ?? note.noteType.replace(/_/g, " ")}
              text={note.content}
              tone={toneForVisibility(note.visibility)}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

function EntitiesPanel({ entities }: { entities: ResearchEntityRecord[] }) {
  return (
    <Card title="Entities panel">
      {entities.length === 0 ? (
        <EmptyState title="No knowledge entities" />
      ) : (
        <Table ariaLabel="Research entities">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Language</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {entities.map((entity) => (
              <tr key={entity.id}>
                <td>{entity.name}</td>
                <td>{entity.entityType.replace(/_/g, " ")}</td>
                <td>{entity.language ?? "N/A"}</td>
                <td>{entity.tags.join(", ") || "No tags"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
}

function RelationshipsPanel({ relationships }: { relationships: ResearchRelationshipRecord[] }) {
  return (
    <Card title="Relationships panel">
      {relationships.length === 0 ? (
        <EmptyState title="No research relationships" />
      ) : (
        <div className="reference-stack">
          {relationships.map((relationship) => (
            <ReferenceItem
              key={relationship.id}
              label={relationship.relationshipType.replace(/_/g, " ")}
              text={`${relationship.fromEntityId} -> ${relationship.toEntityId}${relationship.description ? `: ${relationship.description}` : ""}`}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

function CollectionsPanel({ collections }: { collections: ResearchCollectionRecord[] }) {
  return (
    <Card title="Collections panel">
      {collections.length === 0 ? (
        <EmptyState title="No research collections" />
      ) : (
        <div className="reference-stack">
          {collections.map((collection) => (
            <ReferenceItem
              key={collection.id}
              label={collection.name}
              text={`${collection.visibility} · ${collection.thematicTags.join(", ") || "No thematic tags"}`}
              tone={toneForVisibility(collection.visibility)}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

function ReferenceItem({
  label,
  text,
  tone = "info"
}: {
  label: string;
  text: string;
  tone?: BadgeTone;
}) {
  return (
    <div className="reference-item">
      <strong>{label}</strong>
      <span>{text}</span>
      <Badge tone={tone}>Research</Badge>
    </div>
  );
}

function toneForVisibility(visibility: ResearchVisibility): BadgeTone {
  if (visibility === "PUBLIC_REFERENCE") {
    return "success";
  }

  if (visibility === "ORGANIZATION") {
    return "info";
  }

  if (visibility === "TEAM") {
    return "warning";
  }

  return "neutral";
}

function formatLanguage(language: string, locale?: string): string {
  return formatLanguageLocale(language, locale);
}

function emptySearchResult(): ResearchSearchResult {
  return {
    collections: [],
    entities: [],
    notes: [],
    relationships: [],
    sources: []
  };
}
