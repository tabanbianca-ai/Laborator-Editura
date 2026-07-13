import type { ComponentProps } from "react";
import Link from "next/link";
import { formatLanguageLocale } from "@laborator/shared";
import {
  addLibraryBookmarkAction,
  addLibraryHighlightAction,
  addLibraryNoteAction,
  favoriteLibraryItemAction,
  unfavoriteLibraryItemAction,
  updateLibraryProgressAction
} from "../../lib/library-workspace-actions";
import type {
  LibraryItemRecord,
  LibraryItemType,
  LibraryPublicationLifecycleStatus,
  LibraryPublicationRecord,
  LibraryPublicationVisibility,
  LibraryWorkspaceData
} from "../../lib/library-workspace-client";
import { Badge, Button, Card, EmptyState, ErrorState, Input, PageHeader, Table } from "../ui";

type BadgeTone = ComponentProps<typeof Badge>["tone"];

interface LibraryWorkspacePageProps {
  error?: string;
  status?: string;
  workspace: LibraryWorkspaceData;
}

export function LibraryWorkspacePage({
  error,
  status,
  workspace
}: LibraryWorkspacePageProps) {
  const selectedItem = workspace.selectedItem;

  return (
    <main className="page-stack">
      <PageHeader eyebrow="Library" title="Library & reader workspace" />

      {error ? <ErrorState message={error} /> : null}
      {workspace.itemsError ? <ErrorState message={workspace.itemsError} /> : null}
      {workspace.publicationsError ? <ErrorState message={workspace.publicationsError} /> : null}
      {status ? (
        <Card>
          <Badge tone="success">{status.replace(/_/g, " ")} saved privately</Badge>
        </Card>
      ) : null}

      <LibraryDashboard items={workspace.items} />

      <IntelligentEditorialLibrary
        publications={workspace.publications}
        selectedPublication={workspace.selectedPublication}
        viewMode={workspace.viewPreference.viewMode}
      />

      {workspace.items.length === 0 ? (
        <EmptyState title="No saved library items" />
      ) : (
        <>
          <section className="library-workspace-grid" aria-label="Library workspace">
            <SavedItemsList
              items={workspace.items}
              selectedItemId={selectedItem?.id}
            />
            <LibraryItemDetail item={selectedItem} />
            <ReaderAccessPanel item={selectedItem} />
          </section>

          {selectedItem ? (
            <>
              <section className="library-workspace-grid library-workspace-grid-wide" aria-label="Reader experience">
                <ReadingPanel item={selectedItem} />
                <ReadingProgressPanel item={selectedItem} />
              </section>

              <section className="library-workspace-grid" aria-label="Private reader annotations">
                <BookmarksPanel item={selectedItem} />
                <HighlightsPanel item={selectedItem} />
                <NotesPanel item={selectedItem} />
              </section>
            </>
          ) : (
            <EmptyState title="No library item selected" />
          )}
        </>
      )}
    </main>
  );
}

function LibraryDashboard({ items }: { items: LibraryItemRecord[] }) {
  const favoriteCount = items.filter((item) => item.favorite).length;
  const recentlyAccessed = items.filter((item) => item.lastAccessedAt).length;
  const localizedMedia = items.filter((item) => item.itemType === "LOCALIZED_MEDIA").length;

  return (
    <section className="metric-grid" aria-label="Library overview">
      <Card>
        <div className="metric-card">
          <span>Saved items</span>
          <strong>{items.length}</strong>
          <Badge tone="info">Private library</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Favorites</span>
          <strong>{favoriteCount}</strong>
          <Badge tone="success">Reader choice</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Recent access</span>
          <strong>{recentlyAccessed}</strong>
          <Badge tone="neutral">User only</Badge>
        </div>
      </Card>
      <Card>
        <div className="metric-card">
          <span>Localized media</span>
          <strong>{localizedMedia}</strong>
          <Badge tone="info">Available</Badge>
        </div>
      </Card>
    </section>
  );
}

function IntelligentEditorialLibrary({
  publications,
  selectedPublication,
  viewMode
}: {
  publications: LibraryPublicationRecord[];
  selectedPublication: LibraryPublicationRecord | null;
  viewMode: "GRID" | "LIST";
}) {
  const stocReal = publications.filter((publication) => publication.lifecycleStatus === "STOC_REAL").length;
  const inLucru = publications.filter((publication) => publication.lifecycleStatus === "IN_LUCRU").length;
  const publicat = publications.filter((publication) => publication.lifecycleStatus === "PUBLICAT").length;

  return (
    <section className="content-panel" aria-label="Intelligent Editorial Library">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Intelligent Editorial Library</p>
          <h2>Centru editorial unic pentru ciclul complet al publicațiilor</h2>
        </div>
        <Badge tone="success">Unified Library</Badge>
      </div>

      <div className="library-search-toolbar" aria-label="Library smart search and view preferences">
        <Input label="Search title, author, ISBN, language, series or metadata" name="librarySearch" />
        <div className="library-badge-row">
          <Badge tone="info">Exact</Badge>
          <Badge tone="info">Normalized</Badge>
          <Badge tone="info">Fuzzy</Badge>
          <Badge tone="info">Multilingual metadata</Badge>
        </div>
        <div className="page-header-actions">
          <Button disabled variant={viewMode === "GRID" ? "primary" : "secondary"}>Grid view</Button>
          <Button disabled variant={viewMode === "LIST" ? "primary" : "secondary"}>List view</Button>
        </div>
      </div>

      <div className="admin-config-items" aria-label="Active Library filter chips">
        {[
          "Author",
          "Language",
          "Editorial domain",
          "Publication type",
          "Lifecycle status",
          "Publication year",
          "Original publication year",
          "Rights status",
          "Format",
          "Series",
          "Collection"
        ].map((filter) => (
          <span key={filter}>{filter}</span>
        ))}
      </div>

      <details className="content-panel">
        <summary>Advanced filters</summary>
        <div className="admin-config-items" aria-label="Collapsible advanced Library filters">
          <span>Rights and provenance</span>
          <span>Available formats</span>
          <span>Original edition</span>
          <span>Visibility</span>
          <span>Project relationship</span>
          <span>Manuscript relationship</span>
          <span>Duplicate candidates</span>
        </div>
      </details>

      <section className="metric-grid" aria-label="Library lifecycle overview">
        <Card>
          <div className="metric-card">
            <span>Stoc real</span>
            <strong>{stocReal}</strong>
            <Badge tone="neutral">Stored source</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>În lucru</span>
            <strong>{inLucru}</strong>
            <Badge tone="info">Editorial workflow</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>Publicat</span>
            <strong>{publicat}</strong>
            <Badge tone="success">Published</Badge>
          </div>
        </Card>
        <Card>
          <div className="metric-card">
            <span>View preference</span>
            <strong>{viewMode}</strong>
            <Badge tone="info">Persistent</Badge>
          </div>
        </Card>
      </section>

      {publications.length === 0 ? (
        <EmptyState title="No editorial publication records" />
      ) : (
        <section className="library-workspace-grid library-workspace-grid-wide" aria-label="Library grid and list views">
          <PublicationGrid publications={publications} />
          <PublicationList publications={publications} />
        </section>
      )}

      <section className="library-workspace-grid" aria-label="Publication record preview and lifecycle actions">
        <PublicationPreview publication={selectedPublication} />
        <LibraryLifecycleActions publication={selectedPublication} />
        <BulkActionsPanel />
      </section>
    </section>
  );
}

function PublicationGrid({ publications }: { publications: LibraryPublicationRecord[] }) {
  return (
    <Card className="library-panel-card" title="Grid view">
      <div className="library-item-list">
        {publications.map((publication) => (
          <Link
            className="library-item-link"
            href={`/library?publicationId=${encodeURIComponent(publication.id)}`}
            key={publication.id}
          >
            <div className="library-item-heading">
              <strong>{publication.title}</strong>
              <Badge tone={toneForLifecycle(publication.lifecycleStatus)}>{labelForLifecycle(publication.lifecycleStatus)}</Badge>
            </div>
            <span>{publication.author} · {formatOptionalLanguage(publication.language, publication.locale)}</span>
            <div className="library-badge-row">
              <Badge tone="neutral">{publication.publicationType}</Badge>
              <Badge tone={toneForVisibility(publication.visibility)}>{publication.visibility}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function PublicationList({ publications }: { publications: LibraryPublicationRecord[] }) {
  return (
    <Card className="library-panel-card" title="List view">
      <Table ariaLabel="Sortable editorial library list">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Type</th>
            <th>Language</th>
            <th>Status</th>
            <th>Year</th>
            <th>Rights</th>
            <th>Formats</th>
            <th>Last update</th>
            <th>Project</th>
          </tr>
        </thead>
        <tbody>
          {publications.map((publication) => (
            <tr key={publication.id}>
              <td>{publication.title}</td>
              <td>{publication.author}</td>
              <td>{publication.publicationType}</td>
              <td>{formatOptionalLanguage(publication.language, publication.locale)}</td>
              <td><Badge tone={toneForLifecycle(publication.lifecycleStatus)}>{labelForLifecycle(publication.lifecycleStatus)}</Badge></td>
              <td>{publication.publicationYear ?? publication.firstPublicationYear ?? "Not recorded"}</td>
              <td>{publication.rightsStatus ?? "Pending"}</td>
              <td>{publication.availableFormats.join(", ") || "None"}</td>
              <td>{formatDate(publication.updatedAt)}</td>
              <td>{publication.projectId ?? "Not linked"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}

function PublicationPreview({ publication }: { publication: LibraryPublicationRecord | null }) {
  if (!publication) {
    return (
      <Card className="library-panel-card" title="Quick preview">
        <EmptyState title="No publication selected" />
      </Card>
    );
  }

  return (
    <Card className="library-panel-card" title="Quick preview">
      <div className="reference-stack">
        <ReferenceItem label="Cover" text={publication.metadata?.coverRef ? "Available" : "Cover pending"} />
        <ReferenceItem label="Title" text={publication.title} />
        <ReferenceItem label="Author" text={publication.author} />
        <ReferenceItem label="Table of contents" text="Preview without restricted content" />
        <ReferenceItem label="Formats" text={publication.availableFormats.join(", ") || "No formats"} />
        <ReferenceItem label="Associated project" text={publication.projectId ?? "Not linked"} />
        <ReferenceItem label="Manuscript" text={publication.manuscriptId ?? "Not linked"} />
        <ReferenceItem label="Rights and provenance" text={publication.rightsStatus ?? "Needs validation"} />
      </div>
    </Card>
  );
}

function LibraryLifecycleActions({ publication }: { publication: LibraryPublicationRecord | null }) {
  return (
    <Card className="library-panel-card" title="Contextual quick actions">
      {!publication ? (
        <EmptyState title="Select a publication for actions" />
      ) : (
        <div className="admin-config-items" aria-label="Library contextual quick actions">
          {[
            "Open publication",
            "Open manuscript",
            "Open project",
            "Continue editorial work",
            "Start new edition",
            "Add translation",
            "View rights",
            "View versions",
            "Preview",
            "Export",
            "Move status",
            "Publish when permitted",
            "Add to collection",
            "Edit metadata"
          ].map((action) => (
            <span key={action}>{action}</span>
          ))}
        </div>
      )}
      <p className="library-privacy-note">
        Common actions stay within 2-3 clicks. Historical versions are never destroyed.
      </p>
    </Card>
  );
}

function BulkActionsPanel() {
  return (
    <Card className="library-panel-card" title="Bulk actions">
      <div className="admin-config-items" aria-label="Library bulk actions">
        {[
          "Change status",
          "Assign collection",
          "Assign series",
          "Add tags",
          "Export metadata",
          "Update selected metadata",
          "Assign project",
          "Mark public/private",
          "Validate rights status",
          "Generate report"
        ].map((action) => (
          <span key={action}>{action}</span>
        ))}
      </div>
      <div className="blocking-warning" role="status">
        Bulk actions respect permissions, subscription entitlements, Need-to-Know scope and rights restrictions.
      </div>
    </Card>
  );
}

function SavedItemsList({
  items,
  selectedItemId
}: {
  items: LibraryItemRecord[];
  selectedItemId?: string;
}) {
  return (
    <Card className="library-panel-card" title="Saved items list">
      <div className="library-item-list">
        {items.map((item) => (
          <Link
            className={
              item.id === selectedItemId
                ? "library-item-link library-item-link-active"
                : "library-item-link"
            }
            href={`/library?itemId=${encodeURIComponent(item.id)}`}
            key={item.id}
          >
            <strong>{item.title}</strong>
            <span>{formatOptionalLanguage(item.language, item.locale)} · {formatDate(item.savedAt)}</span>
            <div className="library-badge-row">
              <Badge tone={toneForItemType(item.itemType)}>{item.itemType}</Badge>
              {item.favorite ? <Badge tone="success">Favorite</Badge> : null}
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function LibraryItemDetail({ item }: { item: LibraryItemRecord | null }) {
  if (!item) {
    return (
      <Card className="library-panel-card" title="Library item detail panel">
        <EmptyState title="No library item selected" />
      </Card>
    );
  }

  return (
    <Card className="library-panel-card" title="Library item detail panel">
      <div className="reference-stack">
        <div className="library-item-heading">
          <div>
            <strong>{item.title}</strong>
            <span>{item.sourceReference ?? "Source reference pending"}</span>
          </div>
          <Badge tone={toneForItemType(item.itemType)}>{item.itemType}</Badge>
        </div>
        <dl className="research-metadata-grid">
          <div>
            <dt>Language</dt>
            <dd>{formatOptionalLanguage(item.language, item.locale)}</dd>
          </div>
          <div>
            <dt>Original</dt>
            <dd>{formatOptionalLanguage(item.originalLanguage, item.originalLocale)}</dd>
          </div>
          <div>
            <dt>Current manuscript</dt>
            <dd>{formatOptionalLanguage(item.authoringLanguage, item.authoringLocale)}</dd>
          </div>
          <div>
            <dt>Translation target</dt>
            <dd>{formatOptionalLanguage(item.targetLanguage, item.targetLocale)}</dd>
          </div>
          <div>
            <dt>Saved</dt>
            <dd>{formatDate(item.savedAt)}</dd>
          </div>
          <div>
            <dt>Recent access</dt>
            <dd>{item.lastAccessedAt ? formatDate(item.lastAccessedAt) : "No recent access"}</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>{item.sourceReference ?? "Not recorded"}</dd>
          </div>
        </dl>
        <FavoriteAction item={item} />
        <p className="library-privacy-note">
          Reading history and annotations are private to the authenticated user.
        </p>
      </div>
    </Card>
  );
}

function FavoriteAction({ item }: { item: LibraryItemRecord }) {
  return (
    <form
      action={item.favorite ? unfavoriteLibraryItemAction : favoriteLibraryItemAction}
      className="library-action-form"
    >
      <input name="itemId" type="hidden" value={item.id} />
      <Button type="submit" variant={item.favorite ? "secondary" : "primary"}>
        {item.favorite ? "Unfavorite" : "Favorite"}
      </Button>
    </form>
  );
}

function ReaderAccessPanel({ item }: { item: LibraryItemRecord | null }) {
  const readerAccess = item?.metadata?.readerAccess;

  return (
    <Card className="library-panel-card" title="Reader access metadata">
      {!item ? (
        <EmptyState title="No reader access metadata" />
      ) : (
        <div className="reference-stack">
          <ReferenceItem
            label="Online reading"
            text={readerAccess?.onlineReadingAvailable ? "Available" : "Not configured"}
          />
          <ReferenceItem
            label="Formats"
            text={readerAccess?.downloadableFormats?.join(", ") || "No downloadable formats"}
          />
          <ReferenceItem
            label="Reader source"
            text={readerAccess?.sourceLabel ?? item.sourceReference ?? "Linked library item"}
          />
        </div>
      )}
    </Card>
  );
}

function ReadingPanel({ item }: { item: LibraryItemRecord }) {
  const currentChapter = item.metadata?.currentChapter ?? "Chapter not selected";
  const currentSection = item.metadata?.currentSection ?? "Section not selected";

  return (
    <Card title="Simple reading panel placeholder">
      <div className="library-reading-panel">
        <Badge tone={toneForItemType(item.itemType)}>{item.itemType}</Badge>
        <h2>{item.title}</h2>
        <p>
          Reader preview placeholder for the selected library item. The full reader will open
          authenticated user content without exposing private reading history publicly.
        </p>
        <div className="library-current-position">
          <ReferenceItem label="Current chapter" text={currentChapter} />
          <ReferenceItem label="Current section" text={currentSection} />
        </div>
      </div>
    </Card>
  );
}

function ReadingProgressPanel({ item }: { item: LibraryItemRecord }) {
  const progress = item.metadata?.progressPercent;

  return (
    <Card title="Reading progress display">
      <div className="reference-stack">
        <ReferenceItem
          label="Progress"
          text={typeof progress === "number" ? `${progress}%` : "Progress not recorded"}
        />
        <form action={updateLibraryProgressAction} className="library-reader-form">
          <input name="itemId" type="hidden" value={item.id} />
          <div className="library-form-row">
            <Input label="Progress percent" max={100} min={0} name="progressPercent" type="number" />
            <Input label="Current chapter" name="currentChapter" />
          </div>
          <div className="library-form-row">
            <Input label="Current section" name="currentSection" />
            <Input label="Position" name="position" />
          </div>
          <div className="form-actions">
            <Button type="submit">Update progress</Button>
          </div>
        </form>
      </div>
    </Card>
  );
}

function BookmarksPanel({ item }: { item: LibraryItemRecord }) {
  return (
    <Card title="Bookmarks panel">
      <div className="reference-stack">
        <EmptyState title="No bookmarks loaded" />
        <form action={addLibraryBookmarkAction} className="library-reader-form">
          <input name="itemId" type="hidden" value={item.id} />
          <Input label="Bookmark label" name="label" />
          <div className="library-form-row">
            <Input label="Chapter" name="chapter" />
            <Input label="Section" name="section" />
          </div>
          <Input label="Position" name="position" />
          <div className="form-actions">
            <Button type="submit">Add bookmark</Button>
          </div>
        </form>
      </div>
    </Card>
  );
}

function HighlightsPanel({ item }: { item: LibraryItemRecord }) {
  return (
    <Card title="Highlights panel">
      <div className="reference-stack">
        <EmptyState title="No highlights loaded" />
        <form action={addLibraryHighlightAction} className="library-reader-form">
          <input name="itemId" type="hidden" value={item.id} />
          <label className="ui-input-field">
            <span>Highlight text</span>
            <textarea className="ui-input library-textarea" name="text" required rows={4} />
          </label>
          <div className="library-form-row">
            <Input label="Chapter" name="chapter" />
            <Input label="Section" name="section" />
          </div>
          <div className="library-form-row">
            <Input label="Position" name="position" />
            <Input label="Color" name="color" placeholder="yellow" />
          </div>
          <Input label="Private note" name="note" />
          <div className="form-actions">
            <Button type="submit">Add highlight</Button>
          </div>
        </form>
      </div>
    </Card>
  );
}

function NotesPanel({ item }: { item: LibraryItemRecord }) {
  return (
    <Card title="Notes panel">
      <div className="reference-stack">
        <EmptyState title="No reader notes loaded" />
        <form action={addLibraryNoteAction} className="library-reader-form">
          <input name="itemId" type="hidden" value={item.id} />
          <label className="ui-input-field">
            <span>Note content</span>
            <textarea className="ui-input library-textarea" name="content" required rows={5} />
          </label>
          <div className="library-form-row">
            <Input label="Chapter" name="chapter" />
            <Input label="Section" name="section" />
          </div>
          <Input label="Position" name="position" />
          <div className="form-actions">
            <Button type="submit">Add note</Button>
          </div>
        </form>
      </div>
    </Card>
  );
}

function ReferenceItem({ label, text }: { label: string; text: string }) {
  return (
    <div className="reference-item">
      <strong>{label}</strong>
      <span>{text}</span>
    </div>
  );
}

function toneForItemType(itemType: LibraryItemType): BadgeTone {
  if (itemType === "BOOK" || itemType === "ARTICLE") {
    return "info";
  }

  if (itemType === "AUDIOBOOK" || itemType === "VIDEO" || itemType === "LOCALIZED_MEDIA") {
    return "success";
  }

  return "neutral";
}

function toneForLifecycle(status: LibraryPublicationLifecycleStatus): BadgeTone {
  if (status === "PUBLICAT") {
    return "success";
  }

  if (status === "IN_LUCRU") {
    return "info";
  }

  return "neutral";
}

function toneForVisibility(visibility: LibraryPublicationVisibility): BadgeTone {
  if (visibility === "PUBLIC") {
    return "success";
  }

  if (visibility === "INTERNAL_WORKING_PUBLICATION") {
    return "info";
  }

  return "neutral";
}

function labelForLifecycle(status: LibraryPublicationLifecycleStatus): string {
  if (status === "STOC_REAL") {
    return "Stoc real";
  }

  if (status === "IN_LUCRU") {
    return "În lucru";
  }

  return "Publicat";
}

function formatDate(value: string): string {
  return value.slice(0, 10);
}

function formatOptionalLanguage(language?: string, locale?: string): string {
  return language ? formatLanguageLocale(language, locale) : "Not recorded";
}
