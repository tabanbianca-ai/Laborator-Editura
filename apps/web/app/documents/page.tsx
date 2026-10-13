import { DocumentsPage } from "../../components/pages/documents-page";
import { getWorkspacePreferences } from "../../lib/workspace-client";

export default async function DocumentsRoute({
  searchParams
}: {
  searchParams: Promise<{ importError?: string }>;
}) {
  const params = await searchParams;
  const preferences = await getWorkspacePreferences();
  return <DocumentsPage importError={params.importError} platformLanguage={preferences.data?.platformLanguage} />;
}
