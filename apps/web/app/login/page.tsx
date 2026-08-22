import { AuthLoginPage } from "../../components/pages/auth-login-page";
import { getRequestUiLocale } from "../../lib/request-ui-locale";

interface LoginRouteProps {
  searchParams?: Promise<{
    error?: string;
    returnTo?: string;
  }>;
}

export default async function LoginRoute({ searchParams }: LoginRouteProps) {
  const resolvedSearchParams = await searchParams;
  const platformLanguage = await getRequestUiLocale();

  return (
    <AuthLoginPage
      error={resolvedSearchParams?.error}
      platformLanguage={platformLanguage}
      returnTo={resolvedSearchParams?.returnTo}
    />
  );
}
