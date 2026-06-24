import { AuthorStudioManuscriptsPage } from "../../components/pages/author-studio-manuscripts-page";
import { listAuthorManuscripts } from "../../lib/author-studio-client";

export default async function AuthorStudioRoute() {
  const result = await listAuthorManuscripts();

  return <AuthorStudioManuscriptsPage result={result} />;
}
