import { ReviewWorkspacePage } from "../../components/pages/review-workspace-page";
import { getReviewWorkspaceData } from "../../lib/review-workspace-client";

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
  const workspace = await getReviewWorkspaceData({
    documentId: getQueryValue(params?.documentId),
    segmentId: getQueryValue(params?.segmentId)
  });

  return (
    <ReviewWorkspacePage
      error={getQueryValue(params?.error)}
      workspace={workspace}
    />
  );
}
