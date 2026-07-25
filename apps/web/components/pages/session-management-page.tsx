import Link from "next/link";

import { refreshSessionAction, revokeSessionAction } from "../../lib/auth-actions";
import type { AuthSessionsResult } from "../../lib/auth-client";
import type { ApiResult } from "../../lib/api-client";
import { createUiTranslator, translateRoleName } from "../../lib/ui-i18n";
import { Badge, Button, Card, EmptyState, ErrorState, PageHeader, Table } from "../ui";

interface SessionManagementPageProps {
  platformLanguage?: string | null;
  sessionsResult: ApiResult<AuthSessionsResult>;
}

export function SessionManagementPage({
  platformLanguage,
  sessionsResult
}: SessionManagementPageProps) {
  const ui = createUiTranslator(platformLanguage);

  if (sessionsResult.error || !sessionsResult.data) {
    return (
      <main className="page-stack">
        <PageHeader eyebrow={ui.t("auth.account")} title={ui.t("auth.sessionsTitle")} />
        <ErrorState
          message={ui.t("auth.errorSessions")}
          title={ui.t("error.somethingNeedsAttention")}
        />
      </main>
    );
  }

  const sessions = sessionsResult.data.sessions;

  return (
    <main className="page-stack">
      <PageHeader
        actions={
          <>
            <Link className="ui-button ui-button-secondary ui-button-md" href="/profile">
              {ui.t("auth.profileTitle")}
            </Link>
            <form action={refreshSessionAction}>
              <Button type="submit" variant="secondary">{ui.t("action.refreshSession")}</Button>
            </form>
          </>
        }
        eyebrow={ui.t("auth.account")}
        title={ui.t("auth.sessionsTitle")}
      />

      <Card title={ui.t("auth.activeSessions")}>
        <p className="muted-text">{ui.t("auth.sessionsDescription")}</p>
        {sessions.length === 0 ? (
          <EmptyState title={ui.t("auth.noSessions")} />
        ) : (
          <Table ariaLabel={ui.t("auth.activeSessions")}>
            <thead>
              <tr>
                <th>{ui.t("auth.createdAt")}</th>
                <th>{ui.t("auth.lastLoginAt")}</th>
                <th>{ui.t("auth.roles")}</th>
                <th>{ui.t("auth.status")}</th>
                <th>{ui.t("auth.manageSessions")}</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{formatDate(session.createdAt, ui.t("dossier.notRecorded"))}</td>
                  <td>{formatDate(session.lastSeenAt, ui.t("dossier.notRecorded"))}</td>
                  <td>
                    <div className="status-grid">
                      {session.roles.map((role) => (
                        <Badge key={role} tone="neutral">{translateRoleName(role, platformLanguage)}</Badge>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Badge tone={session.revokedAt ? "warning" : "success"}>
                      {session.revokedAt
                        ? ui.t("auth.sessionRevoked")
                        : session.current
                          ? ui.t("auth.sessionCurrent")
                          : ui.t("auth.sessionActive")}
                    </Badge>
                  </td>
                  <td>
                    <form action={revokeSessionAction}>
                      <input name="sessionId" type="hidden" value={session.id} />
                      <Button disabled={Boolean(session.revokedAt)} size="sm" type="submit" variant="secondary">
                        {ui.t("action.revokeSession")}
                      </Button>
                    </form>
                  </td>
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
