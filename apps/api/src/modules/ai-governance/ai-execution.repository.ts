import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { type FileBackedRuntimeDatabase, getDefaultRuntimeDatabase } from "@laborator/db";
import { openSync, closeSync, unlinkSync } from "node:fs";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import { type AgentExecutionTask } from "./ai-execution.types";
import { randomUUID } from "node:crypto";

@Injectable()
export class AiExecutionRepository {
  constructor(@Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()) {}

  get(organizationId: string, id: string): AgentExecutionTask | null {
    return this.database.findByIdForTenant<AgentExecutionTask>("ai_execution_records", id, organizationId);
  }

  list(organizationId: string): AgentExecutionTask[] {
    return this.database.selectForTenant<AgentExecutionTask>("ai_execution_records", organizationId)
      .filter((task) => Boolean(task.idempotencyKey));
  }

  create(task: AgentExecutionTask): AgentExecutionTask {
    return this.lock("write", () => {
      const prior = this.list(task.organizationId).find((candidate) =>
        candidate.userId === task.userId && candidate.idempotencyKey === task.idempotencyKey);
      if (prior) {
        if (prior.requestHash !== task.requestHash) throw new ConflictException("Idempotency key payload mismatch.");
        return prior;
      }
      const created = this.database.insert("ai_execution_records", task);
      this.audit(created);
      return created;
    });
  }

  save(task: AgentExecutionTask, expected: AgentExecutionTask["status"], actorId = task.userId): AgentExecutionTask {
    return this.lock("write", () => {
      const current = this.get(task.organizationId, task.id);
      if (!current || current.status !== expected) throw new ConflictException("Task state changed.");
      const allowed: Partial<Record<AgentExecutionTask["status"], AgentExecutionTask["status"][]>> = {
        CREATED: ["AUTHORIZED", "BLOCKED", "CANCELLED"],
        AUTHORIZED: ["RUNNING", "BLOCKED", "CANCELLED"],
        RUNNING: ["COMPLETED", "FAILED", "CANCELLED"]
      };
      if (!allowed[current.status]?.includes(task.status)) throw new ConflictException("Invalid task transition.");
      const saved = this.database.upsert("ai_execution_records", task);
      this.audit(saved, actorId);
      return saved;
    });
  }

  acquireExecution(): () => void {
    return this.acquire("execution");
  }

  private audit(task: AgentExecutionTask, actorId = task.userId) {
    this.database.insert("ai_operational_audit_events", {
      id: randomUUID(), organizationId: task.organizationId, executionId: task.id,
      agentId: task.agentId, actorId, action: `AI_TASK_${task.status}`,
      correlationId: task.correlationId, createdAt: new Date().toISOString(),
      metadata: { configurationSha256: task.configurationSha256, failureCode: task.failureCode }
    });
  }

  private acquire(kind: string) {
    const path = `${this.database.getPath()}.ai-${kind}.lock`;
    let descriptor: number;
    try { descriptor = openSync(path, "wx", 0o600); }
    catch { throw new ConflictException("AI runtime is busy or requires lock recovery."); }
    return () => { closeSync(descriptor); unlinkSync(path); };
  }

  private lock<T>(kind: string, action: () => T): T {
    const release = this.acquire(kind);
    try { return action(); } finally { release(); }
  }
}
