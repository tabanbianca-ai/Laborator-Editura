import { CoreModuleScreen } from "../../components/pages/core-module-screen";
import { getCoreModuleShell } from "../../lib/core-module-client";

export default async function ResearchRoute() {
  const result = await getCoreModuleShell("research");

  return <CoreModuleScreen eyebrow="Research Hub" result={result} />;
}
