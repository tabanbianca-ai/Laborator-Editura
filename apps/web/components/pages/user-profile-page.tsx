import Link from "next/link";

import { logoutAction, updateProfileAction, verifyEmailAction } from "../../lib/auth-actions";
import type { AuthProfileResult } from "../../lib/auth-client";
import { createUiTranslator, translateRoleName } from "../../lib/ui-i18n";
import type { ApiResult } from "../../lib/api-client";
import { Badge, Button, Card, EmptyState, ErrorState, Input, PageHeader, Table } from "../ui";

interface UserProfilePageProps {
  platformLanguage?: string | null;
  profileResult: ApiResult<AuthProfileResult>;
  status?: string;
}

export function UserProfilePage({
  platformLanguage,
  profileResult,
  status
}: UserProfilePageProps) {
  const ui = createUiTranslator(platformLanguage);

  if (profileResult.error || !profileResult.data) {
    return (
      <main className="page-stack">
        <PageHeader eyebrow={ui.t("auth.account")} title={ui.t("auth.profileTitle")} />
        <ErrorState
          message={ui.t("auth.errorProfile")}
          title={ui.t("error.somethingNeedsAttention")}
        />
      </main>
    );
  }

  const { activityLog, organization, permissions, roles, user } = profileResult.data;

  return (
    <main className="page-stack">
      <PageHeader
        actions={
          <>
            <Link className="ui-button ui-button-secondary ui-button-md" href="/change-password">
              {ui.t("auth.changePasswordTitle")}
            </Link>
            <Link className="ui-button ui-button-secondary ui-button-md" href="/sessions">
              {ui.t("auth.manageSessions")}
            </Link>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost">{ui.t("action.logout")}</Button>
            </form>
          </>
        }
        eyebrow={ui.t("auth.account")}
        title={ui.t("auth.profileTitle")}
      />

      {status === "updated" ? (
        <Card>
          <Badge tone="success">{ui.t("badge.saved")}</Badge>
        </Card>
      ) : null}

      <div className="dashboard-grid">
        <Card title={ui.t("auth.profileTitle")}>
          <form action={updateProfileAction} className="manuscript-form">
            <p className="muted-text">{ui.t("auth.profileDescription")}</p>
            <Input defaultValue={user.displayName} label={ui.t("auth.displayName")} name="displayName" required />
            <Input defaultValue={user.email} disabled label={ui.t("auth.email")} name="email" type="email" />
            <div className="form-actions">
              <Button type="submit">{ui.t("action.saveProfile")}</Button>
            </div>
          </form>
        </Card>

        <Card title={ui.t("auth.organization")}>
          <dl className="metadata-grid">
            <div>
              <dt>{ui.t("auth.organizationName")}</dt>
              <dd>{organization.name}</dd>
            </div>
            <div>
              <dt>{ui.t("auth.status")}</dt>
              <dd><Badge tone={user.status === "ACTIVE" ? "success" : "warning"}>{user.status}</Badge></dd>
            </div>
            <div>
              <dt>{ui.t("auth.createdAt")}</dt>
              <dd>{formatDate(user.createdAt, ui.t("dossier.notRecorded"))}</dd>
            </div>
            <div>
              <dt>{ui.t("auth.lastLoginAt")}</dt>
              <dd>{formatDate(user.lastLoginAt, ui.t("dossier.notRecorded"))}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card title={ui.t("auth.roles")}>
        <div className="status-grid">
          {roles.map((role) => (
            <Badge key={role} tone="info">{translateRoleName(role, platformLanguage)}</Badge>
          ))}
        </div>
      </Card>

      <Card title={ui.t("auth.permissions")}>
        <div className="status-grid">
          {permissions.map((permission) => (
            <Badge key={permission} tone="neutral">{permission}</Badge>
          ))}
        </div>
      </Card>

      <Card title={ui.t("auth.emailVerification")}>
        <form action={verifyEmailAction} className="manuscript-form">
          <p className="muted-text">{ui.t("auth.verifyEmailDescription")}</p>
          <Input defaultValue={user.email} label={ui.t("auth.email")} name="email" required type="email" />
          <Input label={ui.t("auth.verificationToken")} name="token" />
          <div className="form-actions">
            <Button type="submit">{ui.t("action.verifyEmail")}</Button>
          </div>
        </form>
      </Card>

      <Card title={ui.t("auth.activityLog")}>
        {activityLog.length === 0 ? (
          <EmptyState title={ui.t("auth.noActivity")} />
        ) : (
          <Table ariaLabel={ui.t("auth.activityLog")}>
            <thead>
              <tr>
                <th>{ui.t("auth.createdAt")}</th>
                <th>{ui.t("auth.status")}</th>
              </tr>
            </thead>
            <tbody>
              {activityLog.map((event) => (
                <tr key={event.id}>
                  <td>{formatDate(event.createdAt, ui.t("dossier.notRecorded"))}</td>
                  <td>{event.action}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </main>
  );
}

function formatDate(value: string | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
