import Link from "next/link";
import type { ApiResult } from "../../lib/api-client";
import type { AuthorManuscript } from "../../lib/author-studio-client";
import { Badge, DataTable, EmptyState, ErrorState, PageHeader } from "../ui";

interface AuthorStudioManuscriptsPageProps {
  result: ApiResult<AuthorManuscript[]>;
}

export function AuthorStudioManuscriptsPage({ result }: AuthorStudioManuscriptsPageProps) {
  const manuscripts = result.data ?? [];

  return (
    <main className="page-stack">
      <PageHeader
        actions={
          <Link className="ui-button ui-button-primary ui-button-md" href="/author-studio/new">
            New manuscript
          </Link>
        }
        eyebrow="Author Studio"
        title="Manuscripts"
      />

      {result.error ? (
        <ErrorState message={`Manuscripts could not be loaded. ${result.error}`} />
      ) : null}

      {!result.error && manuscripts.length === 0 ? (
        <EmptyState
          action={
            <Link className="ui-button ui-button-secondary ui-button-md" href="/author-studio/new">
              Create manuscript
            </Link>
          }
          title="No manuscripts"
        />
      ) : null}

      {manuscripts.length > 0 ? (
        <DataTable
          ariaLabel="Author manuscripts"
          columns={[
            {
              header: "Title",
              render: (manuscript) => (
                <Link className="table-link" href={`/author-studio/${manuscript.id}`}>
                  {manuscript.title}
                </Link>
              )
            },
            {
              header: "Type",
              render: (manuscript) => manuscript.manuscriptType.replace(/_/g, " ")
            },
            {
              header: "Language",
              render: (manuscript) => manuscript.language
            },
            {
              header: "Status",
              render: (manuscript) => (
                <Badge tone={toneForStatus(manuscript.status)}>{manuscript.status.replace(/_/g, " ")}</Badge>
              )
            },
            {
              header: "Updated",
              render: (manuscript) => formatDate(manuscript.updatedAt)
            }
          ]}
          getRowKey={(manuscript) => manuscript.id}
          rows={manuscripts}
        />
      ) : null}
    </main>
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
