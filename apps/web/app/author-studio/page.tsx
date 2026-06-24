import { CoreModuleScreen } from "../../components/pages/core-module-screen";
import { getCoreModuleShell } from "../../lib/core-module-client";

export default async function AuthorStudioRoute() {
  const result = await getCoreModuleShell("author-studio");

  return <CoreModuleScreen eyebrow="Author Studio" result={result} />;
}
