import { AuthChangePasswordPage } from "../../components/pages/auth-change-password-page";
import { getWorkspacePreferences } from "../../lib/workspace-client";

interface ChangePasswordRouteProps {
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
}

export default async function ChangePasswordRoute({ searchParams }: ChangePasswordRouteProps) {
  const [resolvedSearchParams, preferencesResult] = await Promise.all([
    searchParams,
    getWorkspacePreferences()
  ]);

  return (
    <AuthChangePasswordPage
      error={resolvedSearchParams?.error}
      platformLanguage={preferencesResult.data?.platformLanguage ?? preferencesResult.data?.language}
      status={resolvedSearchParams?.status}
    />
  );
}
