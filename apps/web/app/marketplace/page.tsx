import { CoreModuleScreen } from "../../components/pages/core-module-screen";
import { getCoreModuleShell } from "../../lib/core-module-client";

export default async function MarketplaceRoute() {
  const result = await getCoreModuleShell("marketplace");

  return <CoreModuleScreen eyebrow="Marketplace" result={result} />;
}
