import Link from "next/link";

import { requestPasswordResetAction } from "../../lib/auth-actions";
import { createUiTranslator } from "../../lib/ui-i18n";
import { Button, Card, ErrorState, Input, PageHeader } from "../ui";

interface AuthResetPasswordPageProps {
  error?: string;
  platformLanguage?: string | null;
  status?: string;
}

export function AuthResetPasswordPage({
  error,
  platformLanguage,
  status
}: AuthResetPasswordPageProps) {
  const ui = createUiTranslator(platformLanguage);

  return (
    <main className="page-stack">
      <PageHeader
        actions={
          <Link className="ui-button ui-button-secondary ui-button-md" href="/login">
            {ui.t("label.login")}
          </Link>
        }
        eyebrow={ui.t("auth.account")}
        title={ui.t("auth.resetPasswordTitle")}
      />

      {error ? (
        <ErrorState
          message={ui.t("auth.errorResetPassword")}
          title={ui.t("error.somethingNeedsAttention")}
        />
      ) : null}

      {status === "accepted" ? (
        <Card>
          <p>{ui.t("auth.passwordResetAccepted")}</p>
        </Card>
      ) : null}

      <Card title={ui.t("auth.resetPasswordTitle")}>
        <form action={requestPasswordResetAction} className="manuscript-form">
          <p className="muted-text">{ui.t("auth.resetPasswordDescription")}</p>
          <Input autoComplete="email" label={ui.t("auth.email")} name="email" required type="email" />
          <Input label={ui.t("auth.verificationToken")} name="token" />
          <Input
            autoComplete="new-password"
            label={ui.t("auth.newPassword")}
            minLength={12}
            name="newPassword"
            type="password"
          />
          <div className="form-actions">
            <Button type="submit">{ui.t("action.requestPasswordReset")}</Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
