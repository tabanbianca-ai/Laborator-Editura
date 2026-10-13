import { DocumentDetailPage } from "../../../components/pages/document-detail-page";
import { getWorkspacePreferences } from "../../../lib/workspace-client";

export default async function DocumentDetailRoute({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ segmentError?: string }>;
}) {
  const [{ id }, query, preferences] = await Promise.all([params, searchParams, getWorkspacePreferences()]);
  return <DocumentDetailPage documentId={id} platformLanguage={preferences.data?.platformLanguage} segmentError={query.segmentError} />;
}
