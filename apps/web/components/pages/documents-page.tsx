import {
  listDocuments,
  listProjects,
  type DocumentRecord,
  type ProjectRecord
} from "../../lib/projects-documents-api";
import { Badge, Button, DataTable, EmptyState, ErrorState, Input, PageHeader } from "../ui";

function getDocumentStatusTone(status: DocumentRecord["status"]) {
  if (status === "APPROVED" || status === "EXPORTED") {
    return "success";
  }

  if (status === "IN_REVIEW") {
    return "warning";
  }

  return "info";
}

function getProjectName(projects: ProjectRecord[], projectId: string): string {
  return projects.find((project) => project.id === projectId)?.name ?? projectId;
}

export async function DocumentsPage() {
  const [documentsResult, projectsResult] = await Promise.all([
    listDocuments(),
    listProjects()
  ]);
  const documents = documentsResult.data;
  const projects = projectsResult.data ?? [];
  const documentCount = documents?.length ?? 0;
  const error = documentsResult.error;

  return (
    <div className="page-stack">
      <PageHeader
        actions={
          <Button disabled variant="secondary">
            Import document
          </Button>
        }
        eyebrow="Documents"
        title="Document registry"
      />

      <section className="toolbar">
        <Input
          aria-label="Search documents"
          name="document-search"
          placeholder="Search documents"
          type="search"
        />
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Documents</p>
            <h2>Document registry</h2>
          </div>
          <Badge tone="info">{documentCount} documents</Badge>
        </div>

        {error ? <ErrorState message={`Documents could not be loaded. ${error}`} /> : null}
        {!error && documentCount === 0 ? <EmptyState title="No documents" /> : null}
        {!error && documents && documentCount > 0 ? (
          <DataTable
            ariaLabel="Documents"
            columns={[
              { header: "Document", render: (document) => document.title },
              { header: "Project", render: (document) => getProjectName(projects, document.projectId) },
              {
                header: "Language",
                render: (document) =>
                  `${document.sourceLanguage.toUpperCase()} -> ${document.targetLanguage.toUpperCase()}`
              },
              { header: "Type", render: (document) => document.documentType },
              {
                header: "Status",
                render: (document) => (
                  <Badge tone={getDocumentStatusTone(document.status)}>
                    {document.status}
                  </Badge>
                )
              }
            ]}
            getRowKey={(document) => document.id}
            rows={documents}
          />
        ) : null}
      </section>
    </div>
  );
}
