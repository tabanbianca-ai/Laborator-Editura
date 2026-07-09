import Link from "next/link";
import {
  listProjects,
  type ProjectOrigin,
  type ProjectRecord,
  type ProjectRightsStatus
} from "../../lib/projects-documents-api";
import { createUiTranslator, type UiTranslationKey, type UiTranslator } from "../../lib/ui-i18n";
import { Badge, DataTable, EmptyState, ErrorState, Input, PageHeader } from "../ui";

function formatLanguagePair(project: ProjectRecord): string {
  return `${project.sourceLanguage.toUpperCase()} -> ${project.targetLanguages
    .map((language) => language.toUpperCase())
    .join(", ")}`;
}

function getProjectStatusTone(status: ProjectRecord["status"]) {
  return status === "ACTIVE" ? "success" : "neutral";
}

interface ProjectsPageProps {
  platformLanguage?: string | null;
}

export async function ProjectsPage({ platformLanguage }: ProjectsPageProps) {
  const ui = createUiTranslator(platformLanguage);
  const { data: projects, error } = await listProjects();
  const projectCount = projects?.length ?? 0;

  return (
    <div className="page-stack">
      <PageHeader
        actions={
          <Link className="ui-button ui-button-secondary ui-button-md" href="/projects/new">
            {ui.t("project.newProject")}
          </Link>
        }
        eyebrow={ui.t("label.myProjects")}
        title={ui.t("project.registry")}
      />

      <section className="toolbar">
        <Input
          aria-label={ui.t("project.search")}
          name="project-search"
          placeholder={ui.t("project.search")}
          type="search"
        />
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{ui.t("pipeline.projects")}</p>
            <h2>{ui.t("project.registry")}</h2>
          </div>
          <Badge tone="info">{projectCount} {ui.t("pipeline.projects").toLowerCase()}</Badge>
        </div>

        {error ? <ErrorState message={`${ui.t("error.projectsUnavailable")}. ${error}`} /> : null}
        {!error && projectCount === 0 ? <EmptyState title={ui.t("pipeline.noProjects")} /> : null}
        {!error && projects && projectCount > 0 ? (
          <DataTable
            ariaLabel={ui.t("pipeline.projects")}
            columns={[
              {
                header: ui.t("project.name"),
                render: (project) => (
                  <Link href={`/projects/${encodeURIComponent(project.id)}`}>
                    {project.name}
                  </Link>
                )
              },
              { header: ui.t("project.origin"), render: (project) => formatProjectOrigin(project.projectIdentity?.projectOrigin, ui) },
              { header: ui.t("project.rightsStatus"), render: (project) => formatRightsStatus(project.projectIdentity?.rightsStatus, ui) },
              { header: ui.t("project.language"), render: formatLanguagePair },
              { header: ui.t("project.domain"), render: (project) => project.domain ?? ui.t("project.unassigned") },
              { header: ui.t("project.createdBy"), render: (project) => project.createdBy },
              {
                header: ui.t("project.status"),
                render: (project) => (
                  <Badge tone={getProjectStatusTone(project.status)}>
                    {project.status}
                  </Badge>
                )
              }
            ]}
            getRowKey={(project) => project.id}
            rows={projects}
          />
        ) : null}
      </section>
    </div>
  );
}

function formatProjectOrigin(origin: ProjectOrigin | undefined, ui: UiTranslator): string {
  if (!origin) {
    return ui.t("project.identityRequired");
  }

  const labels: Record<ProjectOrigin, UiTranslationKey> = {
    AUDIO_VIDEO_PROJECT: "project.audioVideoProject",
    CHILDRENS_BOOK: "project.childrenBook",
    EDITORIAL_COLLABORATION: "project.editorialCollaboration",
    EXTERNAL_AUTHOR: "project.externalAuthor",
    MAGAZINE_ARTICLE: "project.magazineArticle",
    ORIGINAL_CREATION: "project.originalCreation",
    PUBLIC_DOMAIN_CLASSICAL_WORK: "project.publicDomainClassicalWork",
    TRANSLATION: "project.translation"
  };

  return ui.t(labels[origin]);
}

function formatRightsStatus(status: ProjectRightsStatus | undefined, ui: UiTranslator): string {
  if (!status) {
    return ui.t("project.identityRequired");
  }

  const labels: Record<ProjectRightsStatus, UiTranslationKey> = {
    CLASSICAL_WORK: "project.classicalWork",
    OPEN_LICENSE: "project.openLicense",
    ORIGINAL_CREATION: "project.originalCreation",
    PUBLIC_DOMAIN: "project.publicDomain",
    RESTRICTED_PUBLICATION: "project.restrictedPublication",
    RIGHTS_OBTAINED: "project.rightsObtained",
    RIGHTS_PENDING: "project.rightsPending"
  };

  return ui.t(labels[status]);
}
