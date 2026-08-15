import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { VpsOperationsService } from "./vps-operations.service";

export function createVpsOperationsMcpServer(
  service: VpsOperationsService
) {
  const server = new McpServer({
    name: "laborator-vps-operations",
    version: "1.0.0"
  });

  server.registerTool(
    "vps_capabilities",
    {
      description:
        "List read-only VPS operations exposed by Laborator Editura.",
      inputSchema: z.object({})
    },
    async () => ({
      content: [
        {
          type: "text",
          text: JSON.stringify({
            mode: "read-only",
            actions: [
              "health",
              "ports",
              "nginx-status",
              "disk",
              "git-head"
            ]
          })
        }
      ]
    })
  );

  server.registerTool(
    "vps_execute",
    {
      description:
        "Execute one allowlisted read-only VPS operation.",
      inputSchema: z.object({
        action: z.enum([
          "health",
          "ports",
          "nginx-status",
          "disk",
          "git-head"
        ])
      })
    },
    async ({ action }: { action: "health" | "ports" | "nginx-status" | "disk" | "git-head" }) => {
      const result = await service.executeTrustedAction(action);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result)
          }
        ]
      };
    }
  );

  return server;
}
