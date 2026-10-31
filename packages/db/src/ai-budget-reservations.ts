import { randomUUID } from "node:crypto";
import { type ProjectedSpendingQuota } from "./ai-budget-projection.js";
import {
  PostgresFinancialUnitOfWork, assertFinancialMoney, assertFinancialUuid,
  financialRequestHash, financialUnits,
  type FinancialContext, type FinancialMoney
} from "./financial-persistence.js";

export interface AiReservationRequest {
  context: FinancialContext;
  executionId: string;
  projectId: string;
  agentId: string;
  agentVersionId: string;
  configurationSha256: string;
  tariffId: string;
  idempotencyKey: string;
  correlationId: string;
  maximum: FinancialMoney;
  maximumInputTokens: string;
  maximumOutputTokens: string;
  expiresAt: string;
  projection: { id: string; sourceSha256: string };
}
export interface AiReservationReceipt {
  operationId: string;
  reservationId: string;
  eventId: string;
  outcome: "RESERVED" | "RELEASED";
}
interface BudgetAccount {
  id: string; currency: string; monetary_scale: number;
  limit_units: string; limit_tokens: string;
  opening_consumed_units: string; opening_consumed_tokens: string;
}

/** Admin-only repository boundary. Not a provider authorization token or HTTP service. */
export class PostgresAiBudgetReservations {
  constructor(private readonly unit: PostgresFinancialUnitOfWork) {}

  async reserve(request: AiReservationRequest): Promise<AiReservationReceipt> {
    const { context } = request;
    [request.executionId, request.projectId, request.agentId, request.agentVersionId, request.tariffId, request.correlationId].forEach(assertFinancialUuid);
    if (!/^[a-f0-9]{64}$/u.test(request.configurationSha256)) throw new Error("INVALID_CONFIGURATION_HASH");
    assertFinancialMoney(request.maximum);
    const units = financialUnits(request.maximum.units);
    const input = financialUnits(request.maximumInputTokens);
    const output = financialUnits(request.maximumOutputTokens);
    const tokens = input + output;
    financialUnits(tokens.toString());
    if (!Number.isFinite(Date.parse(request.expiresAt))) throw new Error("INVALID_RESERVATION_EXPIRY");
    if (!request.projection) throw new Error("BUDGET_PROJECTION_REQUIRED");
    const { projection, ...payload } = request;
    const requestSha256 = financialRequestHash({ ...payload, expiresAt: new Date(request.expiresAt).toISOString() });

    return this.unit.transaction(context, [], async (client) => {
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [`ai-budget:${context.organizationId}`]);
      const current = (await client.query<{ id: string; source_sha256: string; account_ids: string[]; quotas: ProjectedSpendingQuota[]; fresh: boolean }>(
        "SELECT id,source_sha256,account_ids,quotas,valid_until>clock_timestamp() AS fresh FROM ai_budget_projection WHERE organization_id=$1 ORDER BY version DESC LIMIT 1",
        [context.organizationId])).rows[0];
      if (!current?.fresh || current.id !== projection.id || current.source_sha256 !== projection.sourceSha256) {
        throw new Error("STALE_BUDGET_PROJECTION");
      }
      await client.query("SELECT set_config('app.ai_budget_source_sha256',$1,true)", [projection.sourceSha256]);
      const operation = await this.unit.claimOperation(client, context, {
        id: randomUUID(), owner: "AI_GOVERNANCE", kind: "RESERVE",
        idempotencyKey: request.idempotencyKey, requestSha256,
        correlationId: request.correlationId, sourceReference: `ai-execution:${request.executionId}`
      });
      if (!operation.created) {
        const previous = await client.query<{ reservation_id: string; id: string }>(
          "SELECT reservation_id,id FROM ai_financial_reconciliation_event WHERE organization_id=$1 AND operation_id=$2 AND event_kind='RESERVED'",
          [context.organizationId, operation.id]);
        const row = previous.rows[0];
        if (!row) throw new Error("INCOMPLETE_FINANCIAL_OPERATION");
        return { operationId: operation.id, reservationId: row.reservation_id, eventId: row.id, outcome: "RESERVED" };
      }

      const task = await client.query<{ id: string }>(`SELECT id FROM ai_execution_records
        WHERE organization_id=$1 AND id=$2 AND project_id=$3 AND agent_id=$4 AND user_id=$5
        AND status IN ('CREATED','AUTHORIZED') AND agent_version_id=$6 AND configuration_sha256=$7`,
      [context.organizationId, request.executionId, request.projectId, request.agentId, context.actorId, request.agentVersionId, request.configurationSha256]);
      if (!task.rows[0]) throw new Error("FINANCIAL_EXECUTION_SCOPE_UNAVAILABLE");
      for (const quota of current.quotas) {
        if (quota.scope === "PROJECT" && quota.subjectId !== request.projectId || quota.scope === "USER" && quota.subjectId !== context.actorId ||
          quota.scope === "AGENT" && quota.subjectId !== request.agentId) continue;
        if (quota.maximumUnits !== null && units > financialUnits(quota.maximumUnits) ||
          quota.maximumTokens !== null && tokens > financialUnits(quota.maximumTokens)) throw new Error("AI_QUOTA_EXHAUSTED");
        const counts = (await client.query<{ day: string; month: string }>(`SELECT
          count(*) FILTER(WHERE r.created_at >= date_trunc('day',transaction_timestamp() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC')::text AS day,
          count(*) FILTER(WHERE r.created_at >= date_trunc('month',transaction_timestamp() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC')::text AS month
          FROM ai_cost_reservation r JOIN ai_execution_records t ON t.organization_id=r.organization_id AND t.id=r.execution_id
          WHERE r.organization_id=$1 AND ($2='ORGANIZATION' OR $2='PROJECT' AND r.project_id=$3::uuid
            OR $2='USER' AND t.user_id=$3::uuid OR $2='AGENT' AND r.agent_id=$3::uuid)`,
        [context.organizationId, quota.scope, quota.subjectId])).rows[0]!;
        if (quota.runsPerDay !== null && BigInt(counts.day) + financialUnits(quota.openingDayRuns) >= financialUnits(quota.runsPerDay) ||
          quota.runsPerMonth !== null && BigInt(counts.month) + financialUnits(quota.openingMonthRuns) >= financialUnits(quota.runsPerMonth)) {
          throw new Error("AI_QUOTA_EXHAUSTED");
        }
      }

      // Discover every applicable scope server-side. Never accept caller-selected accounts.
      // SERIALIZABLE predicate reads also protect concurrent policy/account insertions.
      const accounts = await client.query<BudgetAccount>(`
        SELECT * FROM ai_budget_account WHERE organization_id=$1 AND id=ANY($5::uuid[])
        AND period_start <= transaction_timestamp() AND period_end > transaction_timestamp()
        AND (scope_kind='ORGANIZATION' OR (scope_kind='PROJECT' AND project_id=$2)
          OR (scope_kind='AGENT' AND agent_id=$3) OR (scope_kind='USER' AND user_id=$4))
        ORDER BY id FOR UPDATE`, [context.organizationId, request.projectId, request.agentId, context.actorId, current.account_ids]);
      const organization = await client.query<{ present: boolean }>(
        "SELECT EXISTS(SELECT 1 FROM ai_budget_account WHERE organization_id=$1 AND id=ANY($2::uuid[]) AND scope_kind='ORGANIZATION') AS present",
        [context.organizationId, accounts.rows.map((row) => row.id)]);
      if (!organization.rows[0]?.present) throw new Error("ORGANIZATION_BUDGET_REQUIRED");

      const tariff = await client.query<{ input_units_per_million: string; output_units_per_million: string }>(`
        SELECT input_units_per_million,output_units_per_million FROM ai_provider_tariff
        WHERE organization_id=$1 AND id=$2 AND currency=$3 AND monetary_scale=$4 AND effective_at<=transaction_timestamp()
        AND NOT EXISTS(SELECT 1 FROM ai_provider_tariff newer WHERE newer.organization_id=ai_provider_tariff.organization_id
          AND newer.provider=ai_provider_tariff.provider AND newer.model=ai_provider_tariff.model
          AND newer.version>ai_provider_tariff.version AND newer.effective_at<=transaction_timestamp())`,
      [context.organizationId, request.tariffId, request.maximum.currency, request.maximum.scale]);
      const rate = tariff.rows[0];
      if (!rate || units < (input * BigInt(rate.input_units_per_million) + output * BigInt(rate.output_units_per_million) + 999999n) / 1000000n) {
        throw new Error("INVALID_OR_UNDERFUNDED_TARIFF");
      }
      const expiry = await client.query<{ valid: boolean }>(`
        SELECT $1::timestamptz > transaction_timestamp()
          AND $1::timestamptz <= transaction_timestamp()+interval '15 minutes'
          AND NOT EXISTS(SELECT 1 FROM ai_budget_account WHERE organization_id=$2 AND id=ANY($3::uuid[]) AND period_end<$1::timestamptz) AS valid`,
      [request.expiresAt, context.organizationId, accounts.rows.map((row) => row.id)]);
      if (!expiry.rows[0]?.valid) throw new Error("INVALID_RESERVATION_EXPIRY");

      for (const account of accounts.rows) {
        if (account.currency !== request.maximum.currency || account.monetary_scale !== request.maximum.scale) {
          throw new Error("BUDGET_DENOMINATION_MISMATCH");
        }
        // Conservative until P0-C: settled/uncertain/expired holds remain charged.
        // Only an explicit safe pre-dispatch release removes held capacity.
        const usage = await client.query<{ units: string; tokens: string }>(`
          SELECT COALESCE(sum(r.maximum_units::numeric),0)::text AS units,
            COALESCE(sum(r.maximum_input_tokens::numeric+r.maximum_output_tokens::numeric),0)::text AS tokens
          FROM ai_cost_reservation r JOIN ai_execution_records t ON t.organization_id=r.organization_id AND t.id=r.execution_id
          JOIN ai_budget_account a ON a.organization_id=r.organization_id AND a.id=$2
          WHERE r.organization_id=$1 AND r.created_at < a.period_end
          AND (a.scope_kind='ORGANIZATION' OR a.scope_kind='PROJECT' AND a.project_id=r.project_id
            OR a.scope_kind='AGENT' AND a.agent_id=r.agent_id OR a.scope_kind='USER' AND a.user_id=t.user_id)
          AND NOT EXISTS(SELECT 1 FROM ai_financial_reconciliation_event e
            WHERE e.organization_id=r.organization_id AND e.reservation_id=r.id AND e.event_kind='RELEASED')`,
        [context.organizationId, account.id]);
        const held = usage.rows[0]!;
        if (BigInt(account.opening_consumed_units) + BigInt(held.units) + units > BigInt(account.limit_units) ||
          BigInt(account.opening_consumed_tokens) + BigInt(held.tokens) + tokens > BigInt(account.limit_tokens)) {
          throw new Error("AI_BUDGET_EXHAUSTED");
        }
      }
      const reservationId = randomUUID(); const eventId = randomUUID();
      await client.query(`INSERT INTO ai_cost_reservation
        (id,organization_id,operation_id,execution_id,project_id,agent_id,tariff_id,currency,monetary_scale,maximum_units,maximum_input_tokens,maximum_output_tokens,expires_at,projection_id)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [reservationId, context.organizationId, operation.id, request.executionId, request.projectId, request.agentId,
        request.tariffId, request.maximum.currency, request.maximum.scale, units.toString(), input.toString(), output.toString(), request.expiresAt, projection.id]);
      for (const account of accounts.rows) await client.query(`INSERT INTO ai_budget_allocation
        (id,organization_id,reservation_id,budget_account_id,currency,monetary_scale,reserved_units,reserved_tokens)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
      [randomUUID(), context.organizationId, reservationId, account.id, request.maximum.currency, request.maximum.scale, units.toString(), tokens.toString()]);
      await client.query(`INSERT INTO ai_financial_reconciliation_event
        (id,organization_id,reservation_id,operation_id,event_kind,currency,monetary_scale,amount_units,input_tokens,output_tokens,evidence_sha256,reason)
        VALUES($1,$2,$3,$4,'RESERVED',$5,$6,$7,$8,$9,$10,'Atomic budget reservation; dispatch disabled pending P0-C')`,
      [eventId, context.organizationId, reservationId, operation.id, request.maximum.currency, request.maximum.scale,
        units.toString(), input.toString(), output.toString(), requestSha256]);
      return { operationId: operation.id, reservationId, eventId, outcome: "RESERVED" };
    });
  }

  /** Neither timeout, expiry nor cancellation proves that a dispatched attempt was free. */
  async releaseUndispatched(context: FinancialContext, reservationId: string,
    idempotencyKey: string, correlationId: string): Promise<AiReservationReceipt> {
    assertFinancialUuid(reservationId);
    return this.unit.transaction(context, [], async (client) => {
      const accounts = await client.query<{ budget_account_id: string }>(
        "SELECT budget_account_id FROM ai_budget_allocation WHERE organization_id=$1 AND reservation_id=$2 ORDER BY budget_account_id",
        [context.organizationId, reservationId]);
      await client.query("SELECT id FROM ai_budget_account WHERE organization_id=$1 AND id=ANY($2::uuid[]) ORDER BY id FOR UPDATE",
        [context.organizationId, accounts.rows.map((row) => row.budget_account_id)]);
      const reservation = await client.query<{ currency: string; monetary_scale: number }>(
        "SELECT currency,monetary_scale FROM ai_cost_reservation WHERE organization_id=$1 AND id=$2", [context.organizationId, reservationId]);
      const row = reservation.rows[0];
      if (!row || accounts.rows.length === 0) throw new Error("FINANCIAL_SCOPE_UNAVAILABLE");
      const operation = await this.unit.claimOperation(client, context, { id: randomUUID(), owner: "AI_GOVERNANCE", kind: "RELEASE",
        idempotencyKey, correlationId, sourceReference: `ai-reservation:${reservationId}`,
        requestSha256: financialRequestHash({ context, reservationId, reason: "UNDISPATCHED" }) });
      const prior = await client.query<{ id: string; operation_id: string }>(
        "SELECT id,operation_id FROM ai_financial_reconciliation_event WHERE organization_id=$1 AND reservation_id=$2 AND event_kind='RELEASED'",
        [context.organizationId, reservationId]);
      if (prior.rows[0]) {
        if (prior.rows[0].operation_id !== operation.id) throw new Error("RESERVATION_ALREADY_RELEASED");
        return { operationId: operation.id, reservationId, eventId: prior.rows[0].id, outcome: "RELEASED" };
      }
      const attempts = await client.query<{ blocked: boolean }>(`SELECT
        EXISTS(SELECT 1 FROM ai_provider_attempt WHERE organization_id=$1 AND reservation_id=$2)
        OR EXISTS(SELECT 1 FROM ai_financial_reconciliation_event WHERE organization_id=$1 AND reservation_id=$2
          AND event_kind IN ('DISPATCHED','SETTLED','RECONCILIATION_REQUIRED','ADJUSTED')) AS blocked`, [context.organizationId, reservationId]);
      if (attempts.rows[0]?.blocked) throw new Error("DISPATCHED_RESERVATION_REQUIRES_RECONCILIATION");
      const eventId = randomUUID();
      await client.query(`INSERT INTO ai_financial_reconciliation_event
        (id,organization_id,reservation_id,operation_id,event_kind,currency,monetary_scale,amount_units,input_tokens,output_tokens,evidence_sha256,reason)
        VALUES($1,$2,$3,$4,'RELEASED',$5,$6,0,0,0,$7,'Verified undispatched reservation release')`,
      [eventId, context.organizationId, reservationId, operation.id, row.currency, row.monetary_scale,
        financialRequestHash({ reservationId, reason: "UNDISPATCHED" })]);
      return { operationId: operation.id, reservationId, eventId, outcome: "RELEASED" };
    });
  }
}
