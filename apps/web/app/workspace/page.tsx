import { EditorialWorkspaceFinalPage } from "../../components/pages/editorial-workspace-final-page";
import { getEditorialWorkspaceData } from "../../lib/editorial-workspace-client";
import { getWorkspaceDashboard } from "../../lib/workspace-client";

export default async function WorkspacePage() {
  const [workspace, dashboardResult] = await Promise.all([
    getEditorialWorkspaceData(),
    getWorkspaceDashboard()
  ]);

  return (
    <EditorialWorkspaceFinalPage
      dashboardResult={dashboardResult}
      workspace={workspace}
    />
  );
}
