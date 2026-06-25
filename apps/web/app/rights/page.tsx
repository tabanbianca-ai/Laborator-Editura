import { RightsWorkspacePage } from "../../components/pages/rights-workspace-page";
import { getRightsWorkspaceData } from "../../lib/rights-workspace-client";

interface RightsRouteProps {
  searchParams?: Promise<{
    documentId?: string | string[];
    error?: string | string[];
    projectId?: string | string[];
    tab?: string | string[];
  }>;
}

type RightsTab = "collaboration" | "translation" | "publishing" | "provenance" | "audit";

const allowedTabs = new Set<RightsTab>([
  "collaboration",
  "translation",
  "publishing",
  "provenance",
  "audit"
]);

function getQueryValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeTab(value: string | undefined): RightsTab {
  return allowedTabs.has(value as RightsTab) ? (value as RightsTab) : "collaboration";
}

export default async function RightsRoute({ searchParams }: RightsRouteProps) {
  const params = await searchParams;
  const projectId = getQueryValue(params?.projectId);
  const documentId = getQueryValue(params?.documentId);
  const workspace = await getRightsWorkspaceData({
    documentId,
    projectId
  });

  return (
    <RightsWorkspacePage
      activeTab={normalizeTab(getQueryValue(params?.tab))}
      documentId={documentId}
      error={getQueryValue(params?.error)}
      projectId={projectId}
      workspace={workspace}
    />
  );
}
