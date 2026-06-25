import { EditorialPipelineProjectPage } from "../../../components/pages/editorial-pipeline-page";
import { getEditorialPipelineData } from "../../../lib/editorial-pipeline-client";

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
  const [{ projectId }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const data = await getEditorialPipelineData({
    documentId: getQueryValue(resolvedSearchParams?.documentId),
    projectId
  });

  return <EditorialPipelineProjectPage data={data} />;
}
