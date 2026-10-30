import { type FinancialContext, type FinancialMoney, type IntegerUnits } from "@laborator/db";

/** AI Governance owns these commands. No HTTP/controller binding is provided in P0-A. */
export interface AiFinancialCommand {
  context: FinancialContext;
  idempotencyKey: string;
  requestSha256: string;
  correlationId: string;
  executionId: string;
}
export interface ReserveAiCost extends AiFinancialCommand {
  projectId: string; agentId: string; tariffId: string;
  budgetAccountIds: string[];
  maximum: FinancialMoney;
  maximumInputTokens: IntegerUnits;
  maximumOutputTokens: IntegerUnits;
  expiresAt: string;
}
export interface DispatchAiCost extends AiFinancialCommand {
  reservationId: string; attemptId: string; provider: string;
  tariffId: string; maximum: FinancialMoney;
  maximumInputTokens: IntegerUnits; maximumOutputTokens: IntegerUnits;
  providerIdempotencyKey: string; requestEvidenceSha256: string;
}
export interface SettleAiCost extends AiFinancialCommand {
  reservationId: string; attemptId: string; actual: FinancialMoney;
  inputTokens: IntegerUnits; outputTokens: IntegerUnits;
  providerEventId: string; evidenceSha256: string;
}
export interface ReleaseAiCost extends AiFinancialCommand {
  reservationId: string; reason: string; evidenceSha256: string;
}
export interface ReconcileAiCost extends SettleAiCost {
  reason: string; approvedBy: string;
}
export interface AiFinancialReceipt {
  operationId: string; reservationId: string; eventId: string;
  outcome: "RESERVED" | "DISPATCHED" | "SETTLED" | "RELEASED" | "RECONCILIATION_REQUIRED";
}
/** Implemented in P0-B/P0-C only after all spend paths share the same transaction authority. */
export interface AiFinancialServiceContract {
  reserve(command: ReserveAiCost): Promise<AiFinancialReceipt>;
  dispatch(command: DispatchAiCost): Promise<AiFinancialReceipt>;
  settle(command: SettleAiCost): Promise<AiFinancialReceipt>;
  release(command: ReleaseAiCost): Promise<AiFinancialReceipt>;
  reconcile(command: ReconcileAiCost): Promise<AiFinancialReceipt>;
}
