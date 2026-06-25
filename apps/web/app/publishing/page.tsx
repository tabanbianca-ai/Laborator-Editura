import { PublishingWorkspacePage } from "../../components/pages/publishing-workspace-page";
import { getPublishingWorkspaceData } from "../../lib/publishing-workspace-client";

interface PublishingRouteProps {
  searchParams?: Promise<{
    commerceEditionId?: string | string[];
    documentId?: string | string[];
    error?: string | string[];
    exportArtifactId?: string | string[];
    layoutPlanId?: string | string[];
    publicCatalogItemId?: string | string[];
  }>;
}

function getQueryValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PublishingRoute({ searchParams }: PublishingRouteProps) {
  const params = await searchParams;
  const workspace = await getPublishingWorkspaceData({
    commerceEditionId: getQueryValue(params?.commerceEditionId),
    documentId: getQueryValue(params?.documentId),
    exportArtifactId: getQueryValue(params?.exportArtifactId),
    layoutPlanId: getQueryValue(params?.layoutPlanId),
    publicCatalogItemId: getQueryValue(params?.publicCatalogItemId)
  });

  return (
    <PublishingWorkspacePage
      error={getQueryValue(params?.error)}
      workspace={workspace}
    />
  );
}
