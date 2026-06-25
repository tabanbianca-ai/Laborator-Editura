import { LibraryWorkspacePage } from "../../components/pages/library-workspace-page";
import { getLibraryWorkspaceData } from "../../lib/library-workspace-client";

interface LibraryRouteProps {
  searchParams?: Promise<{
    error?: string | string[];
    itemId?: string | string[];
    status?: string | string[];
  }>;
}

function getQueryValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LibraryRoute({ searchParams }: LibraryRouteProps) {
  const params = await searchParams;
  const workspace = await getLibraryWorkspaceData({
    itemId: getQueryValue(params?.itemId)
  });

  return (
    <LibraryWorkspacePage
      error={getQueryValue(params?.error)}
      status={getQueryValue(params?.status)}
      workspace={workspace}
    />
  );
}
