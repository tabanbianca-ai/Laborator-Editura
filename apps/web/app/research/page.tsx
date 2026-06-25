import { ResearchWorkspacePage } from "../../components/pages/research-workspace-page";
import { getResearchWorkspaceData } from "../../lib/research-workspace-client";

interface ResearchRouteProps {
  searchParams?: Promise<{
    error?: string | string[];
    query?: string | string[];
    sourceId?: string | string[];
    sourceType?: string | string[];
    tags?: string | string[];
  }>;
}

function getQueryValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ResearchRoute({ searchParams }: ResearchRouteProps) {
  const params = await searchParams;
  const query = getQueryValue(params?.query);
  const sourceType = getQueryValue(params?.sourceType);
  const tags = getQueryValue(params?.tags);
  const workspace = await getResearchWorkspaceData({
    query,
    sourceId: getQueryValue(params?.sourceId),
    sourceType,
    tags
  });

  return (
    <ResearchWorkspacePage
      error={getQueryValue(params?.error)}
      query={query}
      sourceType={sourceType}
      tags={tags}
      workspace={workspace}
    />
  );
}
