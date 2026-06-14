import { Badge } from "../ui";

interface SaveStatusIndicatorProps {
  status: "Failed" | "Saved" | "Saving" | "Unsaved";
}

export function SaveStatusIndicator({ status }: SaveStatusIndicatorProps) {
  const tone =
    status === "Saved"
      ? "success"
      : status === "Saving"
        ? "info"
        : status === "Failed"
          ? "danger"
          : "warning";

  return <Badge tone={tone}>{status}</Badge>;
}
