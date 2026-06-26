import { EditorialPipelineProjectPage } from "../../../components/pages/editorial-pipeline-page";
import { getEditorialPipelineData } from "../../../lib/editorial-pipeline-client";
import { getWorkspacePreferences } from "../../../lib/workspace-client";

interface PipelineProjectRouteProps {
  params: Promise<{
    projectId: string;
  }>;
  searchParams?: Promise<{
    documentId?: string | string[];
  }>;
}

function getQueryValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PipelineProjectRoute({
  params,
  searchParams
}: PipelineProjectRouteProps) {
  const [{ projectId }, resolvedSearchParams, preferencesResult] = await Promise.all([
    params,
    searchParams,
    getWorkspacePreferences()
  ]);
  const data = await getEditorialPipelineData({
    documentId: getQueryValue(resolvedSearchParams?.documentId),
    projectId
  });

  return (
    <EditorialPipelineProjectPage
      data={data}
      platformLanguage={preferencesResult.data?.platformLanguage ?? preferencesResult.data?.language}
    />
  );
}
