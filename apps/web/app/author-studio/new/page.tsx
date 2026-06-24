import { AuthorStudioNewPage } from "../../../components/pages/author-studio-new-page";

interface AuthorStudioNewRouteProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function AuthorStudioNewRoute({
  searchParams
}: AuthorStudioNewRouteProps) {
  const resolvedSearchParams = await searchParams;

  return <AuthorStudioNewPage error={resolvedSearchParams?.error} />;
}
