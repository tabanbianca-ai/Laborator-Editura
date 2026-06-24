import { DashboardPage } from "../../components/pages/dashboard-page";
import { getWorkspaceDashboard } from "../../lib/workspace-client";

export default async function DashboardRoute() {
  const dashboardResult = await getWorkspaceDashboard();

  return <DashboardPage dashboardResult={dashboardResult} />;
}
