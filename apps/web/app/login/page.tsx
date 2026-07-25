import { AuthLoginPage } from "../../components/pages/auth-login-page";

interface LoginRouteProps {
  searchParams?: Promise<{
    error?: string;
    returnTo?: string;
  }>;
}

export default async function LoginRoute({ searchParams }: LoginRouteProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <AuthLoginPage
      error={resolvedSearchParams?.error}
      platformLanguage="ro"
      returnTo={resolvedSearchParams?.returnTo}
    />
  );
}
