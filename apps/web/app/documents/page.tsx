import { DocumentsPage } from "../../components/pages/documents-page";

export default async function DocumentsRoute({
  searchParams
}: {
  searchParams: Promise<{ importError?: string }>;
}) {
  const params = await searchParams;
  return <DocumentsPage importError={params.importError} />;
}
