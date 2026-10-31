import { randomUUID } from "node:crypto";
import { PostgresFinancialUnitOfWork, financialRequestHash, financialUnits,
  assertFinancialUuid, type FinancialContext } from "./financial-persistence.js";

export interface ProjectedBudgetAccount {
  sourceBudgetId: string; sourceSha256: string;
  scope: "ORGANIZATION" | "PROJECT" | "USER" | "AGENT";
  subjectId: string | null;
  limitUnits: string; limitTokens: string;
  openingUnits: string; openingTokens: string;
  currency: string; scale: number; periodStart: string; periodEnd: string;
}
export interface BudgetPolicySnapshot {
  sourceSha256: string;
  validUntil: string;
  accounts: ProjectedBudgetAccount[];
  quotas?: ProjectedSpendingQuota[];
}
export interface ProjectedSpendingQuota {
  scope: "ORGANIZATION" | "PROJECT" | "USER" | "AGENT"; subjectId: string | null;
  maximumUnits: string | null; maximumTokens: string | null;
  runsPerDay: string | null; runsPerMonth: string | null;
  openingDayRuns: string; openingMonthRuns: string;
}

/** Called only while the canonical Governance repository's source fence is held. */
export class PostgresAiBudgetProjection {
  constructor(private readonly unit: PostgresFinancialUnitOfWork) {}

  async synchronize(context: FinancialContext, snapshot: BudgetPolicySnapshot, correlationId: string) {
    assertFinancialUuid(correlationId);
    if (!/^[a-f0-9]{64}$/u.test(snapshot.sourceSha256) || !Number.isFinite(Date.parse(snapshot.validUntil)) || !snapshot.accounts.length ||
      !snapshot.accounts.some((account) => account.scope === "ORGANIZATION")) throw new Error("INVALID_POLICY_SNAPSHOT");
    for (const account of snapshot.accounts) {
      assertFinancialUuid(account.sourceBudgetId);
      if (account.subjectId) assertFinancialUuid(account.subjectId);
      [account.limitUnits, account.limitTokens, account.openingUnits, account.openingTokens].forEach(financialUnits);
      if (!/^[a-f0-9]{64}$/u.test(account.sourceSha256) || !/^[A-Z]{3}$/u.test(account.currency) ||
        !Number.isInteger(account.scale) || account.scale < 0 || account.scale > 9 ||
        !["ORGANIZATION", "PROJECT", "USER", "AGENT"].includes(account.scope) ||
        (account.scope === "ORGANIZATION") !== (account.subjectId === null) ||
        !Number.isFinite(Date.parse(account.periodStart)) || !Number.isFinite(Date.parse(account.periodEnd)) ||
        Date.parse(account.periodEnd) <= Date.parse(account.periodStart)) {
        throw new Error("INVALID_POLICY_ACCOUNT");
      }
    }
    if (new Set(snapshot.accounts.map((account) => account.sourceBudgetId)).size !== snapshot.accounts.length) {
      throw new Error("DUPLICATE_POLICY_ACCOUNT");
    }
    return this.unit.transaction(context, [], async (client) => {
      // Same tenant lock is acquired by reserve(). Snapshot conflicts abort SERIALIZABLE.
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`ai-budget:${context.organizationId}`]);
      const freshness = await client.query<{ fresh: boolean }>(
        "SELECT $1::timestamptz>clock_timestamp() AS fresh", [snapshot.validUntil]);
      if (!freshness.rows[0]?.fresh) throw new Error("STALE_POLICY_SNAPSHOT");
      const previous = (await client.query<{ id: string; source_sha256: string; version: string }>(
        "SELECT id,source_sha256,version FROM ai_budget_projection WHERE organization_id=$1 ORDER BY version DESC LIMIT 1",
        [context.organizationId])).rows[0];
      if (previous?.source_sha256 === snapshot.sourceSha256) return { id: previous.id, sourceSha256: snapshot.sourceSha256 };
      const accounts: string[] = [];
      for (const account of snapshot.accounts) {
        // Include opening usage in the revision so a changed opening balance cannot reuse an old row.
        const revision = financialRequestHash(account);
        const row = (await client.query<{ id: string }>(`INSERT INTO ai_budget_account
          (id,organization_id,source_budget_id,source_sha256,scope_kind,project_id,agent_id,user_id,currency,monetary_scale,
          limit_units,limit_tokens,opening_consumed_units,opening_consumed_tokens,period_start,period_end,approved_by)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
          ON CONFLICT (organization_id,source_budget_id,period_start,source_sha256) DO NOTHING RETURNING id`,
        [randomUUID(), context.organizationId, account.sourceBudgetId, revision, account.scope,
          account.scope === "PROJECT" ? account.subjectId : null, account.scope === "AGENT" ? account.subjectId : null,
          account.scope === "USER" ? account.subjectId : null, account.currency, account.scale, account.limitUnits,
          account.limitTokens, account.openingUnits, account.openingTokens, account.periodStart, account.periodEnd, context.actorId])).rows[0];
        const existing = row ?? (await client.query<{ id: string }>(`SELECT id FROM ai_budget_account WHERE organization_id=$1
          AND source_budget_id=$2 AND period_start=$3 AND source_sha256=$4`,
        [context.organizationId, account.sourceBudgetId, account.periodStart, revision])).rows[0];
        if (!existing) throw new Error("PROJECTION_ACCOUNT_UNAVAILABLE");
        accounts.push(existing.id);
      }
      const id = randomUUID();
      for (const quota of snapshot.quotas ?? []) {
        if (!["ORGANIZATION","PROJECT","USER","AGENT"].includes(quota.scope) ||
          (quota.scope === "ORGANIZATION") !== (quota.subjectId === null)) throw new Error("INVALID_PROJECTED_QUOTA");
        if (quota.subjectId) assertFinancialUuid(quota.subjectId);
        for (const value of [quota.maximumUnits,quota.maximumTokens,quota.runsPerDay,quota.runsPerMonth,
          quota.openingDayRuns,quota.openingMonthRuns]) if (value !== null) financialUnits(value);
      }
      await client.query(`INSERT INTO ai_budget_projection(id,organization_id,version,source_sha256,account_ids,actor_id,correlation_id,quotas,valid_until)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [id, context.organizationId, (BigInt(previous?.version ?? "0") + 1n).toString(),
        snapshot.sourceSha256, accounts.sort(), context.actorId, correlationId, JSON.stringify(snapshot.quotas ?? []), snapshot.validUntil]);
      return { id, sourceSha256: snapshot.sourceSha256 };
    });
  }
}
