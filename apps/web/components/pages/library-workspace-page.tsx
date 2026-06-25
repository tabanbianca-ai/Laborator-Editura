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
  LibraryWorkspaceData
} from "../../lib/library-workspace-client";
import { Badge, Button, Card, EmptyState, ErrorState, Input, PageHeader } from "../ui";

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
      {status ? (
        <Card>
          <Badge tone="success">{status.replace(/_/g, " ")} saved privately</Badge>
        </Card>
      ) : null}

      <LibraryDashboard items={workspace.items} />

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

function formatDate(value: string): string {
  return value.slice(0, 10);
}

function formatOptionalLanguage(language?: string, locale?: string): string {
  return language ? formatLanguageLocale(language, locale) : "Not recorded";
}
