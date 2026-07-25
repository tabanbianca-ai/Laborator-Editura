import { AuthResetPasswordPage } from "../../components/pages/auth-reset-password-page";

interface ResetPasswordRouteProps {
  searchParams?: Promise<{
    error?: string;
    status?: string;
  }>;
}

export default async function ResetPasswordRoute({ searchParams }: ResetPasswordRouteProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <AuthResetPasswordPage
      error={resolvedSearchParams?.error}
      platformLanguage="ro"
      status={resolvedSearchParams?.status}
    />
  );
}
