import { CoreModuleScreen } from "../../components/pages/core-module-screen";
import { getCoreModuleShell } from "../../lib/core-module-client";

export default async function LibraryRoute() {
  const result = await getCoreModuleShell("library");

  return <CoreModuleScreen eyebrow="Library" result={result} />;
}
