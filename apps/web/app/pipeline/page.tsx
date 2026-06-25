import { EditorialPipelineIndexPage } from "../../components/pages/editorial-pipeline-page";
import { getEditorialPipelineIndexData } from "../../lib/editorial-pipeline-client";

export default async function PipelineRoute() {
  const data = await getEditorialPipelineIndexData();

  return <EditorialPipelineIndexPage data={data} />;
}
