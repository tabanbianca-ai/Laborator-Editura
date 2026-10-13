import { ReviewWorkspacePage } from "../../components/pages/review-workspace-page";
import { getReviewWorkspaceData } from "../../lib/review-workspace-client";
import { getWorkspacePreferences } from "../../lib/workspace-client";

interface ReviewRouteProps {
  searchParams?: Promise<{
    documentId?: string | string[];
    error?: string | string[];
    segmentId?: string | string[];
  }>;
}

function getQueryValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ReviewRoute({ searchParams }: ReviewRouteProps) {
  const params = await searchParams;
  const [workspace, preferences] = await Promise.all([
    getReviewWorkspaceData({
      documentId: getQueryValue(params?.documentId),
      segmentId: getQueryValue(params?.segmentId)
    }),
    getWorkspacePreferences()
  ]);

  return (
    <ReviewWorkspacePage
      error={getQueryValue(params?.error)}
      platformLanguage={preferences.data?.platformLanguage}
      workspace={workspace}
    />
  );
}
