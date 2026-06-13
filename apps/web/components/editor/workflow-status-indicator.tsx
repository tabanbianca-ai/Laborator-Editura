import { Badge } from "../ui";

interface WorkflowStatusIndicatorProps {
  status: string;
}

export function WorkflowStatusIndicator({ status }: WorkflowStatusIndicatorProps) {
  const tone = status === "Approved" ? "success" : status === "In QA" ? "warning" : "info";

  return <Badge tone={tone}>{status}</Badge>;
}
