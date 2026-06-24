import { TranslationWorkspacePage } from "../../components/pages/translation-workspace-page";
import { getTranslationWorkspaceData } from "../../lib/translation-workspace-client";

interface TranslationRouteProps {
  searchParams?: Promise<{
    documentId?: string | string[];
    error?: string | string[];
    segmentId?: string | string[];
  }>;
}

function getQueryValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TranslationRoute({ searchParams }: TranslationRouteProps) {
  const params = await searchParams;
  const workspace = await getTranslationWorkspaceData({
    documentId: getQueryValue(params?.documentId),
    segmentId: getQueryValue(params?.segmentId)
  });

  return (
    <TranslationWorkspacePage
      error={getQueryValue(params?.error)}
      workspace={workspace}
    />
  );
}
