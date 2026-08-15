export const VPS_READ_ONLY_ACTIONS = [
  "health",
  "ports",
  "nginx-status",
  "disk",
  "git-head"
] as const;

export type VpsReadOnlyAction = typeof VPS_READ_ONLY_ACTIONS[number];
