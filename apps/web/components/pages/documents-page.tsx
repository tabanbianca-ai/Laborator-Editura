import {
  listDocuments,
  listProjects,
  type DocumentRecord,
  type ProjectRecord
} from "../../lib/projects-documents-api";
import { Badge, Button, DataTable, EmptyState, ErrorState, Input, PageHeader } from "../ui";
import { createEditorialUiTranslator } from "../../lib/ui-i18n";

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

export async function DocumentsPage({ importError, platformLanguage }: { importError?: string; platformLanguage?: string }) {
  const ui = createEditorialUiTranslator(platformLanguage);
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
        eyebrow={ui.t("documents")}
        title={ui.t("documentRegistry")}
      />

      {importError ? <ErrorState message={importError} /> : null}

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{ui.t("docxImport")}</p>
            <h2>{ui.t("importDocument")}</h2>
          </div>
          <Badge tone="info">{ui.t("importMaximum")}</Badge>
        </div>
        <form action={importDocxAction} className="manuscript-form">
          <div className="manuscript-form-grid">
            <label className="ui-input-field">
              <span>{ui.t("docxFile")}</span>
              <input accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="ui-input" name="file" required type="file" />
            </label>
            <label className="ui-input-field">
              <span>{ui.t("project")}</span>
              <select className="ui-input ui-select" name="projectId" required>
                <option value="">{ui.t("notSelected")}</option>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </select>
            </label>
            <Input defaultValue="fr" label={ui.t("originalLanguage")} name="originalLanguage" required />
            <Input defaultValue="fr-FR" label={ui.t("originalLocale")} name="originalLocale" />
            <Input defaultValue="ro" label={ui.t("targetLanguage")} name="targetLanguage" required />
            <Input defaultValue="ro-RO" label={ui.t("targetLocale")} name="targetLocale" />
          </div>
          <Input label={ui.t("documentTitle")} name="title" placeholder={ui.t("placeholderDocumentTitle")} />
          <div className="form-actions">
            <Button type="submit">{ui.t("importAndSegment")}</Button>
          </div>
        </form>
      </section>

      <section className="toolbar">
        <Input
          aria-label={ui.t("searchDocuments")}
          name="document-search"
          placeholder={ui.t("searchDocuments")}
          type="search"
        />
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{ui.t("documents")}</p>
            <h2>{ui.t("documentRegistry")}</h2>
          </div>
          <Badge tone="info">{documentCount} {ui.t("documents").toLocaleLowerCase(ui.locale)}</Badge>
        </div>

        {error ? <ErrorState message={`${ui.t("documentsLoadError")} ${error}`} /> : null}
        {!error && documentCount === 0 ? <EmptyState title={ui.t("emptyDocuments")} /> : null}
        {!error && documents && documentCount > 0 ? (
          <DataTable
            ariaLabel={ui.t("documents")}
            columns={[
              {
                header: ui.t("document"),
                render: (document) => (
                  <Link href={`/documents/${encodeURIComponent(document.id)}`}>{document.title}</Link>
                )
              },
              { header: ui.t("project"), render: (document) => getProjectName(projects, document.projectId) },
              {
                header: ui.t("language"),
                render: (document) =>
                  `${document.sourceLanguage.toUpperCase()} -> ${document.targetLanguage.toUpperCase()}`
              },
              { header: ui.t("type"), render: (document) => document.documentType },
              {
                header: ui.t("status"),
                render: (document) => (
                  <Badge tone={getDocumentStatusTone(document.status)}>
                    {ui.status(document.status)}
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
