import { DocumentDetailPage } from "../../../components/pages/document-detail-page";

export default async function DocumentDetailRoute({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ segmentError?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  return <DocumentDetailPage documentId={id} segmentError={query.segmentError} />;
}
