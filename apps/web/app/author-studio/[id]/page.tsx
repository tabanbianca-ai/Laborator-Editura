import { AuthorStudioDetailPage } from "../../../components/pages/author-studio-detail-page";
import { getAuthorManuscriptWorkspace } from "../../../lib/author-studio-client";

interface AuthorStudioDetailRouteProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    draftError?: string;
    sectionError?: string;
  }>;
}

export default async function AuthorStudioDetailRoute({
  params,
  searchParams
}: AuthorStudioDetailRouteProps) {
  const [{ id }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const workspace = await getAuthorManuscriptWorkspace(id);

  return (
    <AuthorStudioDetailPage
      draftError={resolvedSearchParams?.draftError}
      sectionError={resolvedSearchParams?.sectionError}
      workspace={workspace}
    />
  );
}
