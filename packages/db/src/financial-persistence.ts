import { createHash } from "node:crypto";

export type IntegerUnits = string;
export interface FinancialMoney { units: IntegerUnits; currency: string; scale: number }
export interface FinancialContext { organizationId: string; actorId: string }
export interface FinancialQueryResult<Row> { rows: Row[] }
/** A connected PostgreSQL client, not a pool-level query function. */
export interface FinancialClient {
  query<Row = Record<string, unknown>>(sql: string, parameters?: unknown[]): Promise<FinancialQueryResult<Row>>;
  release(error?: Error): void;
}
export interface FinancialPool { connect(): Promise<FinancialClient> }
export interface FinancialOperation {
  id: string; owner: "AI_GOVERNANCE" | "COMMERCE";
  kind: "RESERVE" | "DISPATCH" | "SETTLE" | "RELEASE" | "RECONCILE";
  idempotencyKey: string; requestSha256: string; correlationId: string; sourceReference: string;
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u;
export function assertFinancialUuid(value: string): void {
  if (typeof value !== "string" || !uuid.test(value)) throw new Error("INVALID_FINANCIAL_ID");
}
export function financialUnits(value: IntegerUnits): bigint {
  if (typeof value !== "string" || !/^(0|[1-9][0-9]{0,18})$/u.test(value)) throw new Error("INVALID_FINANCIAL_UNITS");
  const amount = BigInt(value);
  if (amount > 9223372036854775807n) throw new Error("FINANCIAL_UNITS_OVERFLOW");
  return amount;
}
export function assertFinancialMoney(value: FinancialMoney): void {
  financialUnits(value.units);
  if (!/^[A-Z]{3}$/u.test(value.currency) || !Number.isInteger(value.scale) || value.scale < 0 || value.scale > 9) {
    throw new Error("INVALID_FINANCIAL_DENOMINATION");
  }
}

/** Canonical JSON hashing rejects undefined, non-finite values and unsafe numbers. */
export function financialRequestHash(value: unknown): string {
  const seen = new Set<object>();
  const normalize = (item: unknown): unknown => {
    if (item === null || typeof item === "string" || typeof item === "boolean") return item;
    if (typeof item === "number" && Number.isSafeInteger(item)) return item;
    if (typeof item !== "object" || seen.has(item)) throw new Error("INVALID_FINANCIAL_PAYLOAD");
    seen.add(item);
    try {
      if (Array.isArray(item)) {
        for (let index = 0; index < item.length; index++) {
          if (!Object.hasOwn(item, index)) throw new Error("INVALID_FINANCIAL_PAYLOAD");
        }
        return item.map(normalize);
      }
      if (Object.getPrototypeOf(item) !== Object.prototype) throw new Error("INVALID_FINANCIAL_PAYLOAD");
      return Object.fromEntries(Object.entries(item).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
        .map(([key, entry]) => [key, normalize(entry)]));
    } finally { seen.delete(item); }
  };
  return createHash("sha256").update(JSON.stringify(normalize(value))).digest("hex");
}

export interface FinancialLedgerLine { money: FinancialMoney; side: "DEBIT" | "CREDIT" }
export function assertBalancedFinancialLines(lines: readonly FinancialLedgerLine[]): void {
  if (lines.length < 2) throw new Error("UNBALANCED_FINANCIAL_JOURNAL");
  let balance = 0n;
  const denomination = lines[0]!.money;
  for (const line of lines) {
    assertFinancialMoney(line.money);
    const units = financialUnits(line.money.units);
    if (!units || !["DEBIT", "CREDIT"].includes(line.side) ||
      line.money.currency !== denomination.currency || line.money.scale !== denomination.scale) {
      throw new Error("INVALID_FINANCIAL_JOURNAL_LINE");
    }
    balance += line.side === "DEBIT" ? units : -units;
  }
  if (balance !== 0n) throw new Error("UNBALANCED_FINANCIAL_JOURNAL");
}

/** P0-A infrastructure only. No provider calls, policy bypass or automatic retry. */
export class PostgresFinancialUnitOfWork {
  private readonly activeTransactions = new WeakMap<FinancialClient, FinancialContext>();
  constructor(private readonly pool: FinancialPool) {}

  async transaction<T>(context: FinancialContext, budgetAccountIds: readonly string[],
    action: (client: FinancialClient) => Promise<T>): Promise<T> {
    assertFinancialUuid(context.organizationId);
    assertFinancialUuid(context.actorId);
    budgetAccountIds.forEach(assertFinancialUuid);
    const ids = [...new Set(budgetAccountIds)].sort();
    const client = await this.pool.connect();
    let poisoned: Error | undefined;
    let began = false;
    try {
      await client.query("BEGIN ISOLATION LEVEL SERIALIZABLE");
      began = true;
      await client.query("SELECT set_config('app.current_organization_id', $1, true), set_config('app.current_user_id', $2, true)",
        [context.organizationId, context.actorId]);
      await client.query("SET LOCAL lock_timeout = '5s'");
      await client.query("SET LOCAL statement_timeout = '15s'");
      // No SKIP LOCKED: an unavailable or unauthorized scope blocks the whole command.
      const locked = await client.query<{ id: string }>(
        "SELECT id FROM ai_budget_account WHERE organization_id = $1 AND id = ANY($2::uuid[]) ORDER BY id FOR UPDATE",
        [context.organizationId, ids]);
      if (locked.rows.length !== ids.length || locked.rows.some((row, index) => row.id !== ids[index])) {
        throw new Error("FINANCIAL_SCOPE_UNAVAILABLE");
      }
      this.activeTransactions.set(client, { ...context });
      const result = await action(client);
      await client.query("SET CONSTRAINTS ALL IMMEDIATE");
      await client.query("COMMIT");
      return result;
    } catch (error) {
      if (began) {
        try { await client.query("ROLLBACK"); }
        catch { poisoned = new Error("FINANCIAL_TRANSACTION_CONNECTION_UNSAFE"); }
      } else { poisoned = new Error("FINANCIAL_TRANSACTION_BEGIN_FAILED"); }
      throw error;
    } finally { this.activeTransactions.delete(client); client.release(poisoned); }
  }

  /** Must run inside transaction(); a mismatch never becomes a new financial action. */
  async claimOperation(client: FinancialClient, context: FinancialContext, operation: FinancialOperation) {
    const transactionContext = this.activeTransactions.get(client);
    if (!transactionContext || transactionContext.organizationId !== context.organizationId || transactionContext.actorId !== context.actorId) {
      throw new Error("FINANCIAL_TRANSACTION_REQUIRED");
    }
    [context.organizationId, context.actorId, operation.id, operation.correlationId].forEach(assertFinancialUuid);
    if (!/^[a-f0-9]{64}$/u.test(operation.requestSha256) || !operation.idempotencyKey.trim() ||
      operation.idempotencyKey.length > 120 || !operation.sourceReference.trim() || operation.sourceReference.length > 200 ||
      !["AI_GOVERNANCE", "COMMERCE"].includes(operation.owner) ||
      !["RESERVE", "DISPATCH", "SETTLE", "RELEASE", "RECONCILE"].includes(operation.kind)) throw new Error("INVALID_FINANCIAL_OPERATION");
    const inserted = await client.query<{ id: string }>(
      `INSERT INTO financial_operation
        (id, organization_id, actor_id, owner, operation_kind, idempotency_key, request_sha256, correlation_id, source_reference)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (organization_id, idempotency_key) DO NOTHING RETURNING id`,
      [operation.id, context.organizationId, context.actorId, operation.owner, operation.kind,
        operation.idempotencyKey, operation.requestSha256, operation.correlationId, operation.sourceReference]);
    if (inserted.rows[0]) return { id: inserted.rows[0].id, created: true };
    const previous = await client.query<{ id: string; request_sha256: string; owner: string; operation_kind: string; actor_id: string }>(
      "SELECT id, request_sha256, owner, operation_kind, actor_id FROM financial_operation WHERE organization_id = $1 AND idempotency_key = $2",
      [context.organizationId, operation.idempotencyKey]);
    const row = previous.rows[0];
    if (!row || row.request_sha256 !== operation.requestSha256 || row.owner !== operation.owner || row.operation_kind !== operation.kind || row.actor_id !== context.actorId) {
      throw new Error("FINANCIAL_IDEMPOTENCY_CONFLICT");
    }
    return { id: row.id, created: false };
  }
}
