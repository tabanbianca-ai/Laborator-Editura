import { AuthResetPasswordPage } from "../../components/pages/auth-reset-password-page";
import { getRequestUiLocale } from "../../lib/request-ui-locale";

interface ResetPasswordRouteProps {
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
}

export default async function ResetPasswordRoute({
  searchParams
}: ResetPasswordRouteProps) {
  const resolvedSearchParams = await searchParams;
  const platformLanguage = await getRequestUiLocale();

  return (
    <AuthResetPasswordPage
      error={resolvedSearchParams?.error}
      platformLanguage={platformLanguage}
      status={resolvedSearchParams?.status}
    />
  );
}
