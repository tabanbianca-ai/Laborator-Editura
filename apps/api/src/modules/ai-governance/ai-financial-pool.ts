import { createRequire } from "node:module";
import { type FinancialPool, type FinancialClient } from "@laborator/db";

export interface ManagedFinancialPool extends FinancialPool { end(): Promise<void> }

/** No implicit connection to a runtime/staging database and no privilege bypass. */
export function createFinancialPool(): ManagedFinancialPool | null {
  const connectionString = process.env.AI_FINANCIAL_DATABASE_URL;
  if (!connectionString) return null;
  try {
    if (!["postgres:", "postgresql:"].includes(new URL(connectionString).protocol)) throw new Error();
  } catch { throw new Error("INVALID_FINANCIAL_DATABASE_CONFIGURATION"); }
  const { Pool } = createRequire(__filename)("pg") as { Pool: new (options: {
    connectionString: string; max: number; connectionTimeoutMillis: number;
  }) => ManagedFinancialPool };
  const pool = new Pool({ connectionString, max: 5, connectionTimeoutMillis: 5000 });
  return {
    async connect(): Promise<FinancialClient> {
      let client: FinancialClient;
      try { client = await pool.connect(); }
      catch { throw new Error("FINANCIAL_DATABASE_UNAVAILABLE"); }
      try {
        const role = (await client.query<{ rolsuper: boolean; rolbypassrls: boolean }>(
          "SELECT rolsuper,rolbypassrls FROM pg_roles WHERE rolname=current_user")).rows[0];
        if (!role || role.rolsuper || role.rolbypassrls) throw new Error("UNSAFE_FINANCIAL_DATABASE_ROLE");
        const ownership = (await client.query<{ owns_financial: boolean }>(`SELECT EXISTS(
          SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
          WHERE n.nspname=current_schema() AND c.relname IN
            ('financial_operation','ai_provider_tariff','ai_budget_account','ai_cost_reservation','ai_budget_allocation',
             'ai_provider_attempt','ai_financial_reconciliation_event','financial_journal','financial_ledger_entry','ai_budget_projection')
          AND pg_has_role(current_user,c.relowner,'USAGE')) AS owns_financial`)).rows[0];
        if (!ownership || ownership.owns_financial) throw new Error("UNSAFE_FINANCIAL_DATABASE_ROLE");
        return client;
      } catch (error) {
        client.release(new Error("FINANCIAL_ROLE_VERIFICATION_FAILED"));
        throw new Error(error instanceof Error && error.message === "UNSAFE_FINANCIAL_DATABASE_ROLE"
          ? "UNSAFE_FINANCIAL_DATABASE_ROLE" : "FINANCIAL_ROLE_VERIFICATION_FAILED");
      }
    },
    end: () => pool.end()
  };
}
