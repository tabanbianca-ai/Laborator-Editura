import { NestFactory } from "@nestjs/core";
import { timingSafeEqual } from "node:crypto";
import { type IncomingMessage, type ServerResponse } from "node:http";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { AppModule } from "./modules/app.module";
import { createVpsOperationsMcpServer } from "./modules/vps-operations/vps-operations.mcp";
import { VpsOperationsService } from "./modules/vps-operations/vps-operations.service";
import { validateSecurityEnvironment } from "./modules/security/environment-security";

type VpsOperationsRequest = IncomingMessage & {
  body?: Record<string, unknown>;
};

type VpsOperationsResponse = ServerResponse & {
  status(code: number): VpsOperationsResponse;
  json(body: unknown): unknown;
};

type HttpError = {
  getStatus?: () => number;
  message?: unknown;
};

function getErrorStatus(error: unknown): number {
  if (typeof error !== "object" || error === null) {
    return 500;
  }

  const httpError = error as HttpError;
  return typeof httpError.getStatus === "function"
    ? httpError.getStatus()
    : 500;
}

function getErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null) {
    return "Operation failed.";
  }

  const { message } = error as HttpError;
  return typeof message === "string" ? message : "Operation failed.";
}

async function bootstrap() {
  validateSecurityEnvironment();
  const app = await NestFactory.create(AppModule);

  const express = app.getHttpAdapter().getInstance();
  const vpsOperationsService = app.get(VpsOperationsService);

  const mcpHandler = createMcpHandler(
    async () => createVpsOperationsMcpServer(vpsOperationsService)
  );

  const nodeMcpHandler = toNodeHandler(mcpHandler);
  const expectedToken = process.env.VPS_MCP_BEARER_TOKEN;

  express.use(
    "/mcp/vps-operations",
    async (req: VpsOperationsRequest, res: VpsOperationsResponse) => {
      if (!expectedToken) {
        return res.status(503).json({
          error: "VPS MCP authentication is not configured."
        });
      }

      const authorization = req.headers.authorization;
      const suppliedToken =
        typeof authorization === "string" &&
        authorization.startsWith("Bearer ")
          ? authorization.slice(7)
          : "";

      if (suppliedToken !== expectedToken) {
        return res.status(401).json({
          error: "Unauthorized."
        });
      }

      return nodeMcpHandler(req, res, req.body);
    }
  );


  const actionToken = process.env.VPS_ACTION_BEARER_TOKEN;

  const readJsonBody = async (
    req: VpsOperationsRequest
  ): Promise<Record<string, unknown>> => {
    if (req.body && typeof req.body === "object") {
      return req.body;
    }

    const chunks: Buffer[] = [];
    let size = 0;

    for await (const chunk of req) {
      const buffer = Buffer.from(chunk);
      size += buffer.length;

      if (size > 8192) {
        throw new Error("Request body too large.");
      }

      chunks.push(buffer);
    }

    if (chunks.length === 0) {
      return {};
    }

    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  };

  const validBearer = (
    authorization: unknown,
    expected: string | undefined
  ): boolean => {
    if (
      !expected ||
      typeof authorization !== "string" ||
      !authorization.startsWith("Bearer ")
    ) {
      return false;
    }

    const supplied = authorization.slice(7);
    const a = Buffer.from(supplied);
    const b = Buffer.from(expected);

    return a.length === b.length && timingSafeEqual(a, b);
  };

  express.get(
    "/actions/vps-operations/capabilities",
    async (req: VpsOperationsRequest, res: VpsOperationsResponse) => {
      if (!validBearer(req.headers.authorization, actionToken)) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      return res.json({
        mode: "controlled",
        readOnlyActions: [
          "health",
          "ports",
          "nginx-status",
          "disk",
          "git-head"
        ],
        approvalRequiredActions: [
          "request-deploy",
          "approve-deploy",
          "deploy-approved"
        ],
        arbitraryShell: false,
        projectRoot: "/opt/laborator-editura"
      });
    }
  );

  express.post(
    "/actions/vps-operations/execute",
    async (req: VpsOperationsRequest, res: VpsOperationsResponse) => {
      if (!validBearer(req.headers.authorization, actionToken)) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      try {
        const body = await readJsonBody(req);
        const action =
          typeof body.action === "string" ? body.action : "";

        const result =
          await vpsOperationsService.executeTrustedAction(action);

        return res.json(result);
      } catch (error) {
        const status = getErrorStatus(error);

        return res.status(status).json({
          error: getErrorMessage(error)
        });
      }
    }
  );

  express.post(
    "/actions/vps-operations/request-deploy",
    async (req: VpsOperationsRequest, res: VpsOperationsResponse) => {
      if (!validBearer(req.headers.authorization, actionToken)) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      try {
        const body = await readJsonBody(req);
        const ref = typeof body.ref === "string" ? body.ref : "";

        const result = await vpsOperationsService.requestTrustedDeploy(ref);

        return res.json(result);
      } catch (error) {
        const status = getErrorStatus(error);

        return res.status(status).json({
          error: getErrorMessage(error)
        });
      }
    }
  );

  express.post(
    "/actions/vps-operations/approve-deploy",
    async (req: VpsOperationsRequest, res: VpsOperationsResponse) => {
      if (!validBearer(req.headers.authorization, actionToken)) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      try {
        const body = await readJsonBody(req);
        const approvalId =
          typeof body.approvalId === "string" ? body.approvalId : "";

        const result = await vpsOperationsService.approveTrustedDeploy(approvalId);

        return res.json(result);
      } catch (error) {
        const status = getErrorStatus(error);

        return res.status(status).json({
          error: getErrorMessage(error)
        });
      }
    }
  );

  express.post(
    "/actions/vps-operations/authorize-deploy",
    async (req: VpsOperationsRequest, res: VpsOperationsResponse) => {
      if (!validBearer(req.headers.authorization, actionToken)) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      try {
        const body = await readJsonBody(req);
        const ref = typeof body.ref === "string" ? body.ref : "";
        const approvalId =
          typeof body.approvalId === "string" ? body.approvalId : "";

        const result = await vpsOperationsService.deployTrustedApproved(
          ref,
          approvalId
        );

        return res.json(result);
      } catch (error) {
        const status = getErrorStatus(error);

        return res.status(status).json({
          error: getErrorMessage(error)
        });
      }
    }
  );

  express.post(
    "/actions/vps-operations/execute-approved-deploy",
    async (req: VpsOperationsRequest, res: VpsOperationsResponse) => {
      if (!validBearer(req.headers.authorization, actionToken)) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      try {
        const body = await readJsonBody(req);
        const ref = typeof body.ref === "string" ? body.ref : "";
        const approvalId =
          typeof body.approvalId === "string" ? body.approvalId : "";

        const result =
          await vpsOperationsService.executeApprovedDeploy(
            ref,
            approvalId
          );

        return res.json(result);
      } catch (error) {
        const status = getErrorStatus(error);

        return res.status(status).json({
          error: getErrorMessage(error)
        });
      }
    }
  );


  express.post(
    "/actions/vps-operations/request-github-push",
    async (req: VpsOperationsRequest, res: VpsOperationsResponse) => {
      if (!validBearer(req.headers.authorization, actionToken)) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      try {
        const body = await readJsonBody(req);
        const ref = typeof body.ref === "string" ? body.ref : "";

        const result =
          await vpsOperationsService.requestGithubPush(ref);

        return res.json(result);
      } catch (error) {
        const status = getErrorStatus(error);

        return res.status(status).json({
          error: getErrorMessage(error)
        });
      }
    }
  );

  express.post(
    "/actions/vps-operations/approve-github-push",
    async (req: VpsOperationsRequest, res: VpsOperationsResponse) => {
      if (!validBearer(req.headers.authorization, actionToken)) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      try {
        const body = await readJsonBody(req);
        const approvalId =
          typeof body.approvalId === "string" ? body.approvalId : "";

        const result =
          await vpsOperationsService.approveGithubPush(approvalId);

        return res.json(result);
      } catch (error) {
        const status = getErrorStatus(error);

        return res.status(status).json({
          error: getErrorMessage(error)
        });
      }
    }
  );

  express.post(
    "/actions/vps-operations/authorize-github-push",
    async (req: VpsOperationsRequest, res: VpsOperationsResponse) => {
      if (!validBearer(req.headers.authorization, actionToken)) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      try {
        const body = await readJsonBody(req);
        const ref = typeof body.ref === "string" ? body.ref : "";
        const approvalId =
          typeof body.approvalId === "string" ? body.approvalId : "";

        const result =
          await vpsOperationsService.authorizeGithubPush(
            ref,
            approvalId
          );

        return res.json(result);
      } catch (error) {
        const status = getErrorStatus(error);

        return res.status(status).json({
          error: getErrorMessage(error)
        });
      }
    }
  );

  express.post(
    "/actions/vps-operations/execute-approved-github-push",
    async (req: VpsOperationsRequest, res: VpsOperationsResponse) => {
      if (!validBearer(req.headers.authorization, actionToken)) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      try {
        const body = await readJsonBody(req);
        const ref = typeof body.ref === "string" ? body.ref : "";
        const approvalId =
          typeof body.approvalId === "string" ? body.approvalId : "";

        const result =
          await vpsOperationsService.executeApprovedGithubPush(
            ref,
            approvalId
          );

        return res.json(result);
      } catch (error) {
        const status = getErrorStatus(error);

        return res.status(status).json({
          error: getErrorMessage(error)
        });
      }
    }
  );


  express.post(
    "/actions/vps-operations/request-storage-cleanup",
    async (req: VpsOperationsRequest, res: VpsOperationsResponse) => {
      if (!validBearer(req.headers.authorization, actionToken)) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      try {
        const result =
          await vpsOperationsService.requestStorageCleanup();

        return res.json(result);
      } catch (error) {
        const status = getErrorStatus(error);

        return res.status(status).json({
          error: getErrorMessage(error)
        });
      }
    }
  );

  express.post(
    "/actions/vps-operations/approve-storage-cleanup",
    async (req: VpsOperationsRequest, res: VpsOperationsResponse) => {
      if (!validBearer(req.headers.authorization, actionToken)) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      try {
        const body = await readJsonBody(req);
        const approvalId =
          typeof body.approvalId === "string" ? body.approvalId : "";

        const result =
          await vpsOperationsService.approveStorageCleanup(
            approvalId
          );

        return res.json(result);
      } catch (error) {
        const status = getErrorStatus(error);

        return res.status(status).json({
          error: getErrorMessage(error)
        });
      }
    }
  );

  express.post(
    "/actions/vps-operations/authorize-storage-cleanup",
    async (req: VpsOperationsRequest, res: VpsOperationsResponse) => {
      if (!validBearer(req.headers.authorization, actionToken)) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      try {
        const body = await readJsonBody(req);
        const approvalId =
          typeof body.approvalId === "string" ? body.approvalId : "";

        const result =
          await vpsOperationsService.authorizeStorageCleanup(
            approvalId
          );

        return res.json(result);
      } catch (error) {
        const status = getErrorStatus(error);

        return res.status(status).json({
          error: getErrorMessage(error)
        });
      }
    }
  );

  express.post(
    "/actions/vps-operations/execute-approved-storage-cleanup",
    async (req: VpsOperationsRequest, res: VpsOperationsResponse) => {
      if (!validBearer(req.headers.authorization, actionToken)) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      try {
        const body = await readJsonBody(req);
        const approvalId =
          typeof body.approvalId === "string" ? body.approvalId : "";

        const result =
          await vpsOperationsService.executeApprovedStorageCleanup(
            approvalId
          );

        return res.json(result);
      } catch (error) {
        const status = getErrorStatus(error);

        return res.status(status).json({
          error: getErrorMessage(error)
        });
      }
    }
  );

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}

void bootstrap();
