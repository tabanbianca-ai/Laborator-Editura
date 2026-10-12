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

export async function DocumentsPage({ importError }: { importError?: string }) {
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
        eyebrow="Documents"
        title="Document registry"
      />

      {importError ? <ErrorState message={importError} /> : null}

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">DOCX import</p>
            <h2>Import document</h2>
          </div>
          <Badge tone="info">8 MiB maximum</Badge>
        </div>
        <form action={importDocxAction} className="manuscript-form">
          <div className="manuscript-form-grid">
            <label className="ui-input-field">
              <span>DOCX file</span>
              <input accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="ui-input" name="file" required type="file" />
            </label>
            <label className="ui-input-field">
              <span>Project</span>
              <select className="ui-input ui-select" name="projectId" required>
                <option value="">Select project</option>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </select>
            </label>
            <Input defaultValue="fr" label="Original language" name="originalLanguage" required />
            <Input defaultValue="fr-FR" label="Original locale" name="originalLocale" />
            <Input defaultValue="ro" label="Target language" name="targetLanguage" required />
            <Input defaultValue="ro-RO" label="Target locale" name="targetLocale" />
          </div>
          <Input label="Document title" name="title" placeholder="Defaults to the DOCX filename" />
          <div className="form-actions">
            <Button type="submit">Import and segment</Button>
          </div>
        </form>
      </section>

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
              {
                header: "Document",
                render: (document) => (
                  <Link href={`/documents/${encodeURIComponent(document.id)}`}>{document.title}</Link>
                )
              },
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
import Link from "next/link";
import { importDocxAction } from "../../lib/documents-actions";
