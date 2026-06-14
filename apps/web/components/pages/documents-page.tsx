import {
  listDocuments,
  listProjects,
  type DocumentRecord,
  type ProjectRecord
} from "../../lib/projects-documents-api";
import { Badge, Button, EmptyState, ErrorState, Input, Table } from "../ui";

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
      <section className="toolbar">
        <Input
          aria-label="Search documents"
          name="document-search"
          placeholder="Search documents"
          type="search"
        />
        <Button disabled variant="secondary">
          Import document
        </Button>
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
          <Table ariaLabel="Documents">
            <thead>
              <tr>
                <th>Document</th>
                <th>Project</th>
                <th>Language</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => (
                <tr key={document.id}>
                  <td>{document.title}</td>
                  <td>{getProjectName(projects, document.projectId)}</td>
                  <td>
                    {document.sourceLanguage.toUpperCase()} -&gt;{" "}
                    {document.targetLanguage.toUpperCase()}
                  </td>
                  <td>{document.documentType}</td>
                  <td>
                    <Badge tone={getDocumentStatusTone(document.status)}>
                      {document.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}
      </section>
    </div>
  );
}
