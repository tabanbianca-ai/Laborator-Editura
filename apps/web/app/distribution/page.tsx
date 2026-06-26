import { DistributionCenterPage } from "../../components/pages/distribution-center-page";
import { getDistributionCenterData } from "../../lib/distribution-center-client";

interface DistributionRouteProps {
  searchParams?: Promise<{
    commerceEditionId?: string | string[];
    documentId?: string | string[];
    exportArtifactId?: string | string[];
    layoutPlanId?: string | string[];
    publicCatalogItemId?: string | string[];
  }>;
}

function getQueryValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DistributionRoute({ searchParams }: DistributionRouteProps) {
  const params = await searchParams;
  const data = await getDistributionCenterData({
    commerceEditionId: getQueryValue(params?.commerceEditionId),
    documentId: getQueryValue(params?.documentId),
    exportArtifactId: getQueryValue(params?.exportArtifactId),
    layoutPlanId: getQueryValue(params?.layoutPlanId),
    publicCatalogItemId: getQueryValue(params?.publicCatalogItemId)
  });

  return <DistributionCenterPage data={data} />;
}
