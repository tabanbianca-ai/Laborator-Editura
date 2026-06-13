import { Badge } from "../ui";

interface SaveStatusIndicatorProps {
  status: "Saved" | "Saving" | "Unsaved";
}

export function SaveStatusIndicator({ status }: SaveStatusIndicatorProps) {
  const tone = status === "Saved" ? "success" : status === "Saving" ? "info" : "warning";

  return <Badge tone={tone}>{status}</Badge>;
}
