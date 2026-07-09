import { ProjectDetailPage } from "../../../components/pages/project-detail-page";
import {
  getProject,
  getProjectDossiers,
  listDocuments
} from "../../../lib/projects-documents-api";
import { getWorkspacePreferences } from "../../../lib/workspace-client";

interface ProjectDetailRouteProps {
  params: Promise<{
    projectId: string;
  }>;
  searchParams?: Promise<{
    assignError?: string;
    dossierError?: string;
  }>;
}

export default async function ProjectDetailRoute({
  params,
  searchParams
}: ProjectDetailRouteProps) {
  const resolvedParams = await params;
  const projectId = resolvedParams.projectId;
  const [resolvedSearchParams, preferencesResult, projectResult, documentsResult, dossiersResult] =
    await Promise.all([
      searchParams,
      getWorkspacePreferences(),
      getProject(projectId),
      listDocuments(projectId),
      getProjectDossiers(projectId)
    ]);

  return (
    <ProjectDetailPage
      assignError={resolvedSearchParams?.assignError}
      dossierError={resolvedSearchParams?.dossierError}
      documents={documentsResult.data ?? []}
      documentsError={documentsResult.error}
      dossiers={dossiersResult.data}
      dossiersError={dossiersResult.error}
      platformLanguage={preferencesResult.data?.platformLanguage ?? preferencesResult.data?.language}
      project={projectResult.data}
      projectError={projectResult.error}
    />
  );
}
