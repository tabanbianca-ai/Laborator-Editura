import { DashboardPage } from "../components/pages/dashboard-page";
import { getWorkspaceDashboard } from "../lib/workspace-client";

export default async function HomePage() {
  const dashboardResult = await getWorkspaceDashboard();

  return <DashboardPage dashboardResult={dashboardResult} />;
}
