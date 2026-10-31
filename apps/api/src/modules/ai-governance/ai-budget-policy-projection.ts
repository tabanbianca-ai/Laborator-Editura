import { financialRequestHash, financialUnits, type BudgetPolicySnapshot, type ProjectedSpendingQuota } from "@laborator/db";
import { type DatabaseAiGovernanceRepository } from "./ai-governance.repository";
import { resolveAiAgentIdentity } from "./ai-agent-identity";

type PolicySource = Parameters<Parameters<DatabaseAiGovernanceRepository["withFinancialSource"]>[0]>[0];

/** Exact decimal conversion; reject unsupported precision instead of rounding a budget up. */
export function budgetMonetaryUnits(value: number): string {
  if (!Number.isFinite(value) || value < 0 || !/^\d+(\.\d{1,6})?$/u.test(String(value))) throw new Error("UNSUPPORTED_BUDGET_AMOUNT");
  const [whole, fraction = ""] = String(value).split(".");
  const units = BigInt(whole!) * 1000000n + BigInt(fraction.padEnd(6, "0"));
  financialUnits(units.toString());
  return units.toString();
}

export function projectGovernanceBudgets(organizationId: string, source: PolicySource, now = new Date()): BudgetPolicySnapshot {
  if (!Number.isFinite(now.getTime())) throw new Error("INVALID_POLICY_CLOCK");
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)).toISOString();
  let validUntil = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)).toISOString();
  for (const budget of source.budgets) {
    for (const boundary of [budget.startsAt, budget.endsAt]) {
      if (!boundary) continue;
      const instant = Date.parse(boundary);
      if (!Number.isFinite(instant)) throw new Error("INVALID_BUDGET_PERIOD");
      if (instant > now.getTime() && instant < Date.parse(validUntil)) validUntil = new Date(instant).toISOString();
    }
  }
  // Stable serialization of actual persisted records. No policy is inferred from a request.
  const normalized = JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(source).map(([key, rows]) =>
    [key, [...rows].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0)]))));
  const sourceSha256 = financialRequestHash({ organizationId, start, end, validUntil, day: now.toISOString().slice(0,10), persistedSource: JSON.stringify(normalized) });
  const accounts: BudgetPolicySnapshot["accounts"] = [];
  const quotas: ProjectedSpendingQuota[] = [];
  for (const budget of source.budgets) {
    if (budget.organizationId !== organizationId) throw new Error("FOREIGN_BUDGET_POLICY");
    if (budget.startsAt && !Number.isFinite(Date.parse(budget.startsAt)) || budget.endsAt && !Number.isFinite(Date.parse(budget.endsAt))) {
      throw new Error("INVALID_BUDGET_PERIOD");
    }
    if (budget.startsAt && Date.parse(budget.startsAt) > now.getTime() || budget.endsAt && Date.parse(budget.endsAt) <= now.getTime()) continue;
    // Custom/per-run policy semantics are not silently converted into monthly allowances.
    if (!["MONTHLY", "PER_RUN"].includes(budget.period) || budget.currency !== "EUR" ||
      !["ORGANIZATION", "PROJECT", "USER", "AGENT"].includes(budget.budgetScope)) throw new Error("UNSUPPORTED_BUDGET_POLICY");
    let subjectId = budget.scopeRef ?? null;
    if (budget.budgetScope === "AGENT") {
      const identity = resolveAiAgentIdentity(budget.agentName ?? "");
      if (identity.status !== "RESOLVED") throw new Error("UNRESOLVED_BUDGET_AGENT");
      subjectId = source.agents.find((agent) => agent.canonicalAgentId === identity.identity.agentId)?.id ?? null;
      if (!subjectId) throw new Error("UNRESOLVED_BUDGET_AGENT");
    }
    if (budget.budgetScope === "ORGANIZATION") subjectId = null;
    const scope = budget.budgetScope as "ORGANIZATION" | "PROJECT" | "USER" | "AGENT";
    if (budget.perRunLimit !== undefined || budget.period === "PER_RUN") {
      quotas.push({ scope, subjectId, maximumUnits: budgetMonetaryUnits(budget.perRunLimit ?? budget.amount), maximumTokens: null,
        runsPerDay: null, runsPerMonth: null, openingDayRuns: "0", openingMonthRuns: "0" });
    }
    if (budget.period === "PER_RUN") continue;
    const usage = source.usage.filter((row) => row.createdAt >= start && row.createdAt < end &&
      (scope !== "PROJECT" || row.projectId === subjectId) && (scope !== "USER" || row.userId === subjectId) &&
      (scope !== "AGENT" || row.agentName === budget.agentName));
    let opening = 0n; let tokens = 0n;
    for (const row of usage) {
      if (row.organizationId !== organizationId || row.currency !== budget.currency || row.actualCost === undefined ||
        !Number.isSafeInteger(row.totalTokens) || row.totalTokens < 0) throw new Error("UNVERIFIED_OPENING_CONSUMPTION");
      // A later P0-C projection must deduplicate settled ledger identities before this is relaxed.
      if (row.metadata?.financialOperationId) throw new Error("SETTLEMENT_PROJECTION_REQUIRES_P0_C");
      opening += BigInt(budgetMonetaryUnits(row.actualCost)); tokens += BigInt(row.totalTokens);
    }
    accounts.push({ sourceBudgetId: budget.id, sourceSha256: financialRequestHash(JSON.stringify(budget)),
      scope, subjectId, currency: budget.currency, scale: 6, limitUnits: budgetMonetaryUnits(budget.monthlyBudget ?? budget.amount),
      limitTokens: "9223372036854775807", openingUnits: opening.toString(), openingTokens: tokens.toString(),
      periodStart: budget.startsAt && Date.parse(budget.startsAt) > Date.parse(start) ? new Date(budget.startsAt).toISOString() : start,
      periodEnd: budget.endsAt && Date.parse(budget.endsAt) < Date.parse(end) ? new Date(budget.endsAt).toISOString() : end });
  }
  for (const quota of source.quotas) {
    if (quota.organizationId !== organizationId) throw new Error("FOREIGN_QUOTA_POLICY");
    const scope = quota.quotaScope;
    if (!["ORGANIZATION","PROJECT","USER","AGENT"].includes(scope)) throw new Error("UNSUPPORTED_QUOTA_POLICY");
    let subjectId = scope === "ORGANIZATION" ? null : quota.scopeRef ?? null;
    if (scope === "AGENT") {
      const identity = resolveAiAgentIdentity(quota.agentName ?? "");
      if (identity.status !== "RESOLVED") throw new Error("UNRESOLVED_QUOTA_AGENT");
      subjectId = source.agents.find((agent) => agent.canonicalAgentId === identity.identity.agentId)?.id ?? null;
    }
    if (scope !== "ORGANIZATION" && !subjectId) throw new Error("INVALID_QUOTA_SUBJECT");
    const usage = source.usage.filter((row) => row.organizationId === organizationId && row.createdAt >= start && row.createdAt < end &&
      (scope !== "PROJECT" || row.projectId === subjectId) && (scope !== "USER" || row.userId === subjectId) &&
      (scope !== "AGENT" || row.agentName === quota.agentName));
    const integer = (value: number | undefined) => {
      if (value === undefined) return null;
      if (!Number.isSafeInteger(value) || value < 0) throw new Error("INVALID_QUOTA_LIMIT");
      return String(value);
    };
    quotas.push({ scope: scope as ProjectedSpendingQuota["scope"], subjectId,
      maximumUnits: quota.maxCostPerRun === undefined ? null : budgetMonetaryUnits(quota.maxCostPerRun),
      maximumTokens: integer(quota.maxTokensPerRun), runsPerDay: integer(quota.maxRunsPerDay), runsPerMonth: integer(quota.maxRunsPerMonth),
      openingDayRuns: String(usage.filter((row) => row.createdAt.slice(0,10) === now.toISOString().slice(0,10)).length),
      openingMonthRuns: String(usage.length) });
  }
  // Runtime handler estimates may be zero. Apply policy ceilings to the actual
  // reservation cap as well; explicit spend consent is not a budget override.
  for (const policy of source.policies) {
    if (policy.organizationId !== organizationId) throw new Error("FOREIGN_COST_POLICY");
    if (policy.status !== "ACTIVE") continue;
    const hard = policy.hardLimitMetadata?.maxCostPerRun;
    if (hard !== undefined && typeof hard !== "number") throw new Error("INVALID_POLICY_COST_LIMIT");
    const hardUnits = hard === undefined ? null : BigInt(budgetMonetaryUnits(hard));
    const approval = policy.approvalRequiredOverThreshold;
    const approvalUnits = approval === undefined ? null : BigInt(budgetMonetaryUnits(approval));
    let maximumUnits = hardUnits;
    if (approvalUnits !== null && approvalUnits > 0n) {
      const belowApproval = approvalUnits - 1n;
      if (maximumUnits === null || belowApproval < maximumUnits) maximumUnits = belowApproval;
    }
    quotas.push({ scope: "ORGANIZATION", subjectId: null, maximumUnits: maximumUnits?.toString() ?? null,
      maximumTokens: null, runsPerDay: approvalUnits === 0n ? "0" : null, runsPerMonth: null,
      openingDayRuns: "0", openingMonthRuns: "0" });
  }
  return { sourceSha256, validUntil, accounts, quotas };
}
