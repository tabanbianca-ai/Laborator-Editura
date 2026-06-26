import { EditorialPipelineIndexPage } from "../../components/pages/editorial-pipeline-page";
import { getEditorialPipelineIndexData } from "../../lib/editorial-pipeline-client";
import { getWorkspacePreferences } from "../../lib/workspace-client";

export default async function PipelineRoute() {
  const [data, preferencesResult] = await Promise.all([
    getEditorialPipelineIndexData(),
    getWorkspacePreferences()
  ]);

  return (
    <EditorialPipelineIndexPage
      data={data}
      platformLanguage={preferencesResult.data?.platformLanguage ?? preferencesResult.data?.language}
    />
  );
}
