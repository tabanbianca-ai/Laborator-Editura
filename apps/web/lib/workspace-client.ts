import { apiGet, apiPost, type ApiResult } from "./api-client";
import type {
  WorkspaceDashboard,
  WorkspaceNavigationItem,
  WorkspacePreferences,
  WorkspaceWidget
} from "./workspace-types";

export function getWorkspaceNavigation(): Promise<ApiResult<WorkspaceNavigationItem[]>> {
  return apiGet<WorkspaceNavigationItem[]>("/workspace/navigation");
}

export function getWorkspaceDashboard(): Promise<ApiResult<WorkspaceDashboard>> {
  return apiGet<WorkspaceDashboard>("/workspace/dashboard");
}

export function getWorkspacePreferences(): Promise<ApiResult<WorkspacePreferences>> {
  return apiGet<WorkspacePreferences>("/workspace/preferences");
}

export function getWorkspaceWidgets(): Promise<ApiResult<WorkspaceWidget[]>> {
  return apiGet<WorkspaceWidget[]>("/workspace/widgets");
}

export function saveWorkspacePreferences(
  preferences: Partial<WorkspacePreferences>
): Promise<ApiResult<WorkspacePreferences>> {
  return apiPost<WorkspacePreferences, Partial<WorkspacePreferences>>(
    "/workspace/preferences",
    preferences
  );
}

export function createWorkspaceWidget(
  widget: Partial<WorkspaceWidget>
): Promise<ApiResult<WorkspaceWidget>> {
  return apiPost<WorkspaceWidget, Partial<WorkspaceWidget>>("/workspace/widgets", widget);
}
