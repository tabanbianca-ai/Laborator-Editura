import { listProjects, type ProjectRecord } from "../../lib/projects-documents-api";
import { Badge, Button, DataTable, EmptyState, ErrorState, Input, PageHeader } from "../ui";

function formatLanguagePair(project: ProjectRecord): string {
  return `${project.sourceLanguage.toUpperCase()} -> ${project.targetLanguages
    .map((language) => language.toUpperCase())
    .join(", ")}`;
}

function getProjectStatusTone(status: ProjectRecord["status"]) {
  return status === "ACTIVE" ? "success" : "neutral";
}

export async function ProjectsPage() {
  const { data: projects, error } = await listProjects();
  const projectCount = projects?.length ?? 0;

  return (
    <div className="page-stack">
      <PageHeader
        actions={
          <Button disabled variant="secondary">
            New project
          </Button>
        }
        eyebrow="Projects"
        title="Project registry"
      />

      <section className="toolbar">
        <Input
          aria-label="Search projects"
          name="project-search"
          placeholder="Search projects"
          type="search"
        />
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Projects</p>
            <h2>Project registry</h2>
          </div>
          <Badge tone="info">{projectCount} projects</Badge>
        </div>

        {error ? <ErrorState message={`Projects could not be loaded. ${error}`} /> : null}
        {!error && projectCount === 0 ? <EmptyState title="No projects" /> : null}
        {!error && projects && projectCount > 0 ? (
          <DataTable
            ariaLabel="Projects"
            columns={[
              { header: "Name", render: (project) => project.name },
              { header: "Language", render: formatLanguagePair },
              { header: "Domain", render: (project) => project.domain ?? "Unassigned" },
              { header: "Created by", render: (project) => project.createdBy },
              {
                header: "Status",
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
