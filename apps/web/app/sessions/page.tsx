import { SessionManagementPage } from "../../components/pages/session-management-page";
import { listSessions } from "../../lib/auth-client";
import { getWorkspacePreferences } from "../../lib/workspace-client";

export default async function SessionsRoute() {
  const [preferencesResult, sessionsResult] = await Promise.all([
    getWorkspacePreferences(),
    listSessions()
  ]);

  return (
    <SessionManagementPage
      platformLanguage={preferencesResult.data?.platformLanguage ?? preferencesResult.data?.language}
      sessionsResult={sessionsResult}
    />
  );
}
