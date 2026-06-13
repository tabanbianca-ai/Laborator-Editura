import { listProjects, type ProjectRecord } from "../../lib/projects-documents-api";
import { Badge, Button, EmptyState, ErrorState, Input, Table } from "../ui";

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
      <section className="toolbar">
        <Input
          aria-label="Search projects"
          name="project-search"
          placeholder="Search projects"
          type="search"
        />
        <Button disabled variant="secondary">
          New project
        </Button>
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
          <Table ariaLabel="Projects">
            <thead>
              <tr>
                <th>Name</th>
                <th>Language</th>
                <th>Domain</th>
                <th>Created by</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{formatLanguagePair(project)}</td>
                  <td>{project.domain ?? "Unassigned"}</td>
                  <td>{project.createdBy}</td>
                  <td>
                    <Badge tone={getProjectStatusTone(project.status)}>
                      {project.status}
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
