import { BadRequestException, Injectable } from "@nestjs/common";
import {
  type WorkflowRuleCondition,
  type WorkflowRulePredicate
} from "./workflow.types";

const ALLOWED_FACT_ROOTS = new Set(["actor", "context", "instance"]);
const FORBIDDEN_PATH_PARTS = new Set(["__proto__", "constructor", "prototype"]);

@Injectable()
export class WorkflowRuleEvaluator {
  evaluate(predicate: WorkflowRulePredicate, facts: Record<string, unknown>): boolean {
    const branches = [predicate.all, predicate.any, predicate.condition, predicate.not]
      .filter((branch) => branch !== undefined);
    if (branches.length !== 1) {
      throw new BadRequestException("A workflow rule predicate must define exactly one operator.");
    }

    if (predicate.all) {
      return predicate.all.every((child) => this.evaluate(child, facts));
    }
    if (predicate.any) {
      return predicate.any.some((child) => this.evaluate(child, facts));
    }
    if (predicate.not) {
      return !this.evaluate(predicate.not, facts);
    }
    if (!predicate.condition) {
      throw new BadRequestException("Workflow rule condition is required.");
    }

    return this.evaluateCondition(predicate.condition, facts);
  }

  validate(predicate: WorkflowRulePredicate): void {
    const branches = [predicate.all, predicate.any, predicate.condition, predicate.not]
      .filter((branch) => branch !== undefined);
    if (branches.length !== 1) {
      throw new BadRequestException("A workflow rule predicate must define exactly one operator.");
    }
    if (predicate.all) {
      predicate.all.forEach((child) => this.validate(child));
      return;
    }
    if (predicate.any) {
      predicate.any.forEach((child) => this.validate(child));
      return;
    }
    if (predicate.not) {
      this.validate(predicate.not);
      return;
    }
    if (!predicate.condition) {
      throw new BadRequestException("Workflow rule condition is required.");
    }
    this.validateFactPath(predicate.condition.fact);
    if (["IN", "NOT_IN"].includes(predicate.condition.operator) && !Array.isArray(predicate.condition.value)) {
      throw new BadRequestException("IN workflow rule values must be arrays.");
    }
    if (
      ["GREATER_THAN_OR_EQUAL", "LESS_THAN_OR_EQUAL"].includes(predicate.condition.operator) &&
      (typeof predicate.condition.value !== "number" || !Number.isFinite(predicate.condition.value))
    ) {
      throw new BadRequestException("Numeric workflow rule operators require finite numbers.");
    }
  }

  private evaluateCondition(
    condition: WorkflowRuleCondition,
    facts: Record<string, unknown>
  ): boolean {
    const actual = this.readFact(condition.fact, facts);
    switch (condition.operator) {
      case "EQUALS":
        return this.valuesEqual(actual, condition.value);
      case "NOT_EQUALS":
        return !this.valuesEqual(actual, condition.value);
      case "IN":
        return this.inCollection(actual, condition.value);
      case "NOT_IN":
        return !this.inCollection(actual, condition.value);
      case "EXISTS":
        return actual !== undefined && actual !== null;
      case "GREATER_THAN_OR_EQUAL":
        return this.asNumber(actual) >= this.asNumber(condition.value);
      case "LESS_THAN_OR_EQUAL":
        return this.asNumber(actual) <= this.asNumber(condition.value);
    }
  }

  private readFact(path: string, facts: Record<string, unknown>): unknown {
    this.validateFactPath(path);
    const parts = path.split(".").filter(Boolean);

    let current: unknown = facts;
    for (const part of parts) {
      if (!current || typeof current !== "object" || Array.isArray(current)) {
        return undefined;
      }
      current = (current as Record<string, unknown>)[part];
    }
    return current;
  }

  private validateFactPath(path: string): void {
    const parts = path.split(".").filter(Boolean);
    const root = parts[0];
    if (parts.length < 2 || !root || !ALLOWED_FACT_ROOTS.has(root)) {
      throw new BadRequestException(`Unsupported workflow rule fact: ${path}.`);
    }
    if (parts.some((part) => FORBIDDEN_PATH_PARTS.has(part))) {
      throw new BadRequestException("Unsafe workflow rule fact path.");
    }
  }

  private inCollection(actual: unknown, expected: unknown): boolean {
    if (!Array.isArray(expected)) {
      throw new BadRequestException("IN workflow rule values must be arrays.");
    }
    if (Array.isArray(actual)) {
      return actual.some((value) => expected.some((item) => this.valuesEqual(value, item)));
    }
    return expected.some((item) => this.valuesEqual(actual, item));
  }

  private valuesEqual(left: unknown, right: unknown): boolean {
    return typeof left === typeof right && JSON.stringify(left) === JSON.stringify(right);
  }

  private asNumber(value: unknown): number {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new BadRequestException("Numeric workflow rule operators require finite numbers.");
    }
    return value;
  }
}
