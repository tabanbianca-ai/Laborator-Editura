import { ProjectsPage } from "../../components/pages/projects-page";
import { getWorkspacePreferences } from "../../lib/workspace-client";

export default async function ProjectsRoute() {
  const preferencesResult = await getWorkspacePreferences();

  return (
    <ProjectsPage
      platformLanguage={preferencesResult.data?.platformLanguage ?? preferencesResult.data?.language}
    />
  );
}
