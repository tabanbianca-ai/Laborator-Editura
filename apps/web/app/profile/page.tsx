import { UserProfilePage } from "../../components/pages/user-profile-page";
import { getUserProfile } from "../../lib/auth-client";
import { getWorkspacePreferences } from "../../lib/workspace-client";

interface ProfileRouteProps {
  searchParams?: Promise<{
    status?: string;
  }>;
}

export default async function ProfileRoute({ searchParams }: ProfileRouteProps) {
  const [resolvedSearchParams, preferencesResult, profileResult] = await Promise.all([
    searchParams,
    getWorkspacePreferences(),
    getUserProfile()
  ]);

  return (
    <UserProfilePage
      platformLanguage={preferencesResult.data?.platformLanguage ?? preferencesResult.data?.language}
      profileResult={profileResult}
      status={resolvedSearchParams?.status}
    />
  );
}
