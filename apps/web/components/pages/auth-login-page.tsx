import Link from "next/link";

import { loginAction } from "../../lib/auth-actions";
import { createUiTranslator } from "../../lib/ui-i18n";
import { Button, Card, ErrorState, Input, PageHeader } from "../ui";

interface AuthLoginPageProps {
  error?: string;
  platformLanguage?: string | null;
  returnTo?: string;
}

export function AuthLoginPage({
  error,
  platformLanguage,
  returnTo = "/dashboard"
}: AuthLoginPageProps) {
  const ui = createUiTranslator(platformLanguage);

  return (
    <main className="page-stack">
      <PageHeader
        eyebrow={ui.t("auth.account")}
        title={ui.t("auth.loginTitle")}
      />

      {error ? (
        <ErrorState
          message={ui.t("auth.errorLogin")}
          title={ui.t("error.somethingNeedsAttention")}
        />
      ) : null}

      <Card title={ui.t("auth.welcomeBack")}>
        <form action={loginAction} className="manuscript-form">
          <input name="returnTo" type="hidden" value={returnTo} />
          <p className="muted-text">{ui.t("auth.loginDescription")}</p>
          <Input autoComplete="email" label={ui.t("auth.email")} name="email" required type="email" />
          <Input autoComplete="current-password" label={ui.t("auth.password")} name="password" type="password" />
          <Input autoComplete="one-time-code" label={ui.t("auth.accessCode")} name="loginSecret" type="password" />
          <Input autoComplete="name" label={ui.t("auth.displayName")} name="displayName" />
          <Input autoComplete="organization" label={ui.t("auth.organizationName")} name="organizationName" />
          <div className="form-actions">
            <Button type="submit">{ui.t("action.login")}</Button>
            <Link className="ui-button ui-button-ghost ui-button-md" href="/reset-password">
              {ui.t("auth.resetPasswordTitle")}
            </Link>
          </div>
        </form>
      </Card>
    </main>
  );
}
