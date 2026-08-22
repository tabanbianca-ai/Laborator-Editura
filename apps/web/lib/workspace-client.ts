import { apiGet, apiPost, type ApiResult } from "./api-client";
import { getUiLocaleCookie } from "./request-ui-locale";
import type {
  WorkspaceDashboard,
  WorkspaceLanguageManagement,
  WorkspaceNavigationItem,
  WorkspacePreferences,
  WorkspaceWidget
} from "./workspace-types";

export function getWorkspaceNavigation(): Promise<ApiResult<WorkspaceNavigationItem[]>> {
  return apiGet<WorkspaceNavigationItem[]>("/workspace/navigation");
}

export async function getWorkspaceDashboard(): Promise<ApiResult<WorkspaceDashboard>> {
  const result = await apiGet<WorkspaceDashboard>("/workspace/dashboard");
  const locale = await getUiLocaleCookie();

  if (!result.data || !locale) {
    return result;
  }

  return {
    ...result,
    data: {
      ...result.data,
      preferences: {
        ...result.data.preferences,
        platformLanguage: locale
      }
    }
  };
}

export async function getWorkspacePreferences(): Promise<
  ApiResult<WorkspacePreferences>
> {
  const result = await apiGet<WorkspacePreferences>("/workspace/preferences");
  const locale = await getUiLocaleCookie();

  if (!result.data || !locale) {
    return result;
  }

  return {
    ...result,
    data: {
      ...result.data,
      platformLanguage: locale
    }
  };
}

export function getWorkspaceLanguageManagement(): Promise<
  ApiResult<WorkspaceLanguageManagement>
> {
  return apiGet<WorkspaceLanguageManagement>("/workspace/language-management");
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
