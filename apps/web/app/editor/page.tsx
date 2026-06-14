import { TranslationEditorPage } from "../../components/pages/translation-editor-page";

interface EditorRouteProps {
  searchParams?: Promise<{
    documentId?: string | string[];
  }>;
}

function getQueryValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EditorRoute({ searchParams }: EditorRouteProps) {
  const params = await searchParams;

  return <TranslationEditorPage documentId={getQueryValue(params?.documentId)} />;
}
