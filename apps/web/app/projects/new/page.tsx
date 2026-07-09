import { ProjectIdentityNewPage } from "../../../components/pages/project-identity-new-page";
import { getWorkspacePreferences } from "../../../lib/workspace-client";

interface NewProjectRouteProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function NewProjectRoute({
  searchParams
}: NewProjectRouteProps) {
  const [resolvedSearchParams, preferencesResult] = await Promise.all([
    searchParams,
    getWorkspacePreferences()
  ]);

  return (
    <ProjectIdentityNewPage
      error={resolvedSearchParams?.error}
      platformLanguage={preferencesResult.data?.platformLanguage ?? preferencesResult.data?.language}
    />
  );
}
