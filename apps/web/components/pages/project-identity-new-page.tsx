import Link from "next/link";
import { ProjectIdentityForm } from "../projects/project-identity-form";
import { createProjectAction } from "../../lib/projects-actions";
import { createUiTranslator } from "../../lib/ui-i18n";
import { Card, ErrorState, PageHeader } from "../ui";

interface ProjectIdentityNewPageProps {
  error?: string;
  platformLanguage?: string | null;
}

export function ProjectIdentityNewPage({
  error,
  platformLanguage
}: ProjectIdentityNewPageProps) {
  const ui = createUiTranslator(platformLanguage);

  return (
    <main className="page-stack">
      <PageHeader
        actions={
          <Link className="ui-button ui-button-secondary ui-button-md" href="/projects">
            {ui.t("action.backToProjects")}
          </Link>
        }
        eyebrow={ui.t("label.projectIdentity")}
        title={ui.t("project.newProject")}
      />

      {error ? <ErrorState message={error} /> : null}

      <Card>
        <ProjectIdentityForm action={createProjectAction} platformLanguage={platformLanguage} />
      </Card>
    </main>
  );
}
