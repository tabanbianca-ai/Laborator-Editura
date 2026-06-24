import { CoreModuleScreen } from "../../components/pages/core-module-screen";
import { getCoreModuleShell } from "../../lib/core-module-client";

export default async function AdminRoute() {
  const result = await getCoreModuleShell("admin");

  return <CoreModuleScreen eyebrow="Administration" result={result} />;
}
