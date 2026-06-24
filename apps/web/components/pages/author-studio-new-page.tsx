import Link from "next/link";
import { createManuscriptAction } from "../../lib/author-studio-actions";
import { Button, Card, ErrorState, Input, PageHeader, Select } from "../ui";

interface AuthorStudioNewPageProps {
  error?: string;
}

const manuscriptTypeOptions = [
  { label: "Book", value: "BOOK" },
  { label: "Article", value: "ARTICLE" },
  { label: "Magazine article", value: "MAGAZINE_ARTICLE" },
  { label: "Children book", value: "CHILDREN_BOOK" },
  { label: "Script", value: "SCRIPT" }
];

export function AuthorStudioNewPage({ error }: AuthorStudioNewPageProps) {
  return (
    <main className="page-stack">
      <PageHeader
        actions={
          <Link className="ui-button ui-button-secondary ui-button-md" href="/author-studio">
            Back to manuscripts
          </Link>
        }
        eyebrow="Author Studio"
        title="New manuscript"
      />

      {error ? <ErrorState message={error} /> : null}

      <Card>
        <form action={createManuscriptAction} className="manuscript-form">
          <Input label="Title" name="title" required />
          <Input label="Subtitle" name="subtitle" />
          <div className="manuscript-form-grid">
            <Input defaultValue="ro" label="Language" name="language" required />
            <Select label="Type" name="manuscriptType" options={manuscriptTypeOptions} />
            <Input label="Genre" name="genre" />
          </div>
          <Input label="Source manuscript ID" name="sourceManuscriptId" />
          <Input label="Translator name" name="translatorName" />
          <label className="ui-input-field">
            <span>Synopsis</span>
            <textarea className="ui-input manuscript-textarea" name="synopsis" rows={5} />
          </label>
          <label className="ui-input-field">
            <span>Outline</span>
            <textarea className="ui-input manuscript-textarea" name="outline" rows={5} />
          </label>
          <div className="form-actions">
            <Button type="submit">Create manuscript</Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
