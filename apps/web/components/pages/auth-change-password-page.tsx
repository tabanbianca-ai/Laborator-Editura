import Link from "next/link";

import { changePasswordAction } from "../../lib/auth-actions";
import { createUiTranslator } from "../../lib/ui-i18n";
import { Button, Card, ErrorState, Input, PageHeader } from "../ui";

interface AuthChangePasswordPageProps {
  error?: string;
  platformLanguage?: string | null;
  status?: string;
}

export function AuthChangePasswordPage({
  error,
  platformLanguage,
  status
}: AuthChangePasswordPageProps) {
  const ui = createUiTranslator(platformLanguage);

  return (
    <main className="page-stack">
      <PageHeader
        actions={
          <Link className="ui-button ui-button-secondary ui-button-md" href="/profile">
            {ui.t("auth.profileTitle")}
          </Link>
        }
        eyebrow={ui.t("auth.account")}
        title={ui.t("auth.changePasswordTitle")}
      />

      {error ? (
        <ErrorState
          message={ui.t("auth.errorChangePassword")}
          title={ui.t("error.somethingNeedsAttention")}
        />
      ) : null}

      {status === "changed" ? (
        <Card>
          <p>{ui.t("auth.passwordChanged")}</p>
        </Card>
      ) : null}

      <Card title={ui.t("auth.changePasswordTitle")}>
        <form action={changePasswordAction} className="manuscript-form">
          <p className="muted-text">{ui.t("auth.changePasswordDescription")}</p>
          <Input
            autoComplete="current-password"
            label={ui.t("auth.currentPassword")}
            name="currentPassword"
            type="password"
          />
          <Input
            autoComplete="new-password"
            label={ui.t("auth.newPassword")}
            minLength={12}
            name="newPassword"
            required
            type="password"
          />
          <div className="form-actions">
            <Button type="submit">{ui.t("action.changePassword")}</Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
