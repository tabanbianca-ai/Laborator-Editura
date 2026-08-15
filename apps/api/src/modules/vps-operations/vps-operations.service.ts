import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException
} from "@nestjs/common";
import { createConnection } from "node:net";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import {
  VPS_READ_ONLY_ACTIONS,
  type VpsReadOnlyAction
} from "./vps-operations.types";

const SOCKET_PATH = "/run/laborator-ops-agent/ops.sock";

@Injectable()
export class VpsOperationsService {
  async execute(actor: AuthenticatedRequestContext, action: string) {
    this.requireAdmin(actor);

    return this.executeTrustedAction(action);
  }

  async executeTrustedAction(action: string) {
    if (!VPS_READ_ONLY_ACTIONS.includes(action as VpsReadOnlyAction)) {
      throw new BadRequestException("VPS operation is not allowlisted.");
    }

    return this.requestAgent(action);
  }

  capabilities(actor: AuthenticatedRequestContext) {
    this.requireAdmin(actor);

    return {
      mode: "controlled",
      readOnlyActions: VPS_READ_ONLY_ACTIONS,
      approvalRequiredActions: [
        "request-deploy",
        "approve-deploy",
        "deploy-approved"
      ],
      arbitraryShell: false,
      projectRoot: "/opt/laborator-editura"
    };
  }

  async requestDeploy(
    actor: AuthenticatedRequestContext,
    ref: string
  ) {
    this.requireAdmin(actor);

    if (!ref) {
      throw new BadRequestException("Deployment ref is required.");
    }

    return this.requestAgent("request-deploy", { ref });
  }

  async approveDeploy(
    actor: AuthenticatedRequestContext,
    approvalId: string
  ) {
    this.requireAdmin(actor);

    if (!approvalId) {
      throw new BadRequestException("Approval ID is required.");
    }

    return this.requestAgent("approve-deploy", { approvalId });
  }

  async deployApproved(
    actor: AuthenticatedRequestContext,
    ref: string,
    approvalId: string
  ) {
    this.requireAdmin(actor);

    if (!ref || !approvalId) {
      throw new BadRequestException(
        "Deployment ref and approval ID are required."
      );
    }

    return this.requestAgent("authorize-deploy", {
      ref,
      approvalId
    });
  }

  async requestTrustedDeploy(ref: string) {
    if (!ref) {
      throw new BadRequestException("Deployment ref is required.");
    }

    return this.requestAgent("request-deploy", { ref });
  }

  async approveTrustedDeploy(approvalId: string) {
    if (!approvalId) {
      throw new BadRequestException("Approval ID is required.");
    }

    return this.requestAgent("approve-deploy", { approvalId });
  }

  async deployTrustedApproved(
    ref: string,
    approvalId: string
  ) {
    if (!ref || !approvalId) {
      throw new BadRequestException(
        "Deployment ref and approval ID are required."
      );
    }

    return this.requestAgent("authorize-deploy", {
      ref,
      approvalId
    });
  }

  async executeApprovedDeploy(
    ref: string,
    approvalId: string
  ) {
    if (!ref || !approvalId) {
      throw new BadRequestException(
        "Deployment ref and approval ID are required."
      );
    }

    return this.requestAgent("execute-approved-deploy", {
      ref,
      approvalId
    });
  }

  private requireAdmin(actor: AuthenticatedRequestContext) {
    if (
      !actor.roles.includes("ADMIN") &&
      !actor.roles.includes("PLATFORM_CREATOR")
    ) {
      throw new ForbiddenException(
        "VPS operations require an authorized administrator."
      );
    }
  }

  private requestAgent(
    action: string,
    params: Record<string, string> = {}
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const socket = createConnection(SOCKET_PATH);
      const chunks: Buffer[] = [];

      const timeout = setTimeout(() => {
        socket.destroy();
        reject(
          new ServiceUnavailableException(
            "VPS Operations Agent timed out."
          )
        );
      }, 15_000);

      socket.on("connect", () => {
        socket.write(JSON.stringify({ action, ...params }));
        socket.end();
      });

      socket.on("data", (chunk) => chunks.push(Buffer.from(chunk)));

      socket.on("end", () => {
        clearTimeout(timeout);

        try {
          resolve(
            JSON.parse(Buffer.concat(chunks).toString("utf8"))
          );
        } catch {
          reject(
            new ServiceUnavailableException(
              "Invalid response from VPS Operations Agent."
            )
          );
        }
      });

      socket.on("error", () => {
        clearTimeout(timeout);
        reject(
          new ServiceUnavailableException(
            "VPS Operations Agent is unavailable."
          )
        );
      });
    });
  }
}
