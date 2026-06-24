import { CoreModuleScreen } from "../../components/pages/core-module-screen";
import { getCoreModuleShell } from "../../lib/core-module-client";

export default async function TranslationRoute() {
  const result = await getCoreModuleShell("translation");

  return <CoreModuleScreen eyebrow="Translation" result={result} />;
}
