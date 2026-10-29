import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(new URL("../package.json", import.meta.url));
const { McpServer, createMcpHandler, LATEST_PROTOCOL_VERSION } = require("@modelcontextprotocol/server");
const { toNodeHandler } = require("@modelcontextprotocol/node");
const { z } = require("zod");

test("patched MCP Node adapter preserves authenticated initialize, tools and parsed-body compatibility", async (t) => {
  let executions = 0;
  const handler = toNodeHandler(createMcpHandler(async () => {
    const server = new McpServer({ name: "isolated-compatibility-test", version: "1.0.0" });
    server.registerTool("local_test", { inputSchema: z.object({}) }, async () => {
      executions++;
      return { content: [{ type: "text", text: "local fixture only" }] };
    });
    return server;
  }));
  // Exercise the application's toNodeHandler(req, res, req.body) boundary without
  // importing its bootstrap or any VPS operations, services or credentials.
  const server = createServer(async (request, response) => {
    if (request.headers.authorization !== "Bearer isolated-test-token") {
      response.writeHead(401, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Unauthorized." }));
      return;
    }
    try {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      await handler(request, response, body);
    } catch {
      response.writeHead(500);
      response.end();
    }
  });
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const url = `http://127.0.0.1:${server.address().port}/mcp/isolated`;
  const post = (body, authorized = true) => fetch(url, {
    method: "POST", signal: globalThis.AbortSignal.timeout(5000),
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream",
      "mcp-protocol-version": LATEST_PROTOCOL_VERSION,
      ...(authorized ? { authorization: "Bearer isolated-test-token" } : {}) },
    body: JSON.stringify(body)
  });
  const rpc = async (body) => {
    const response = await post(body);
    assert.equal(response.status, 200);
    const text = await response.text();
    const messages = response.headers.get("content-type")?.includes("text/event-stream")
      ? text.split(/\r?\n/u).filter((line) => line.startsWith("data: ")).map((line) => JSON.parse(line.slice(6)))
      : [JSON.parse(text)];
    const result = messages.find((message) => message.id === body.id);
    assert.ok(result);
    assert.equal(result.error, undefined);
    return result.result;
  };
  const denied = await post({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "local_test", arguments: {} } }, false);
  assert.equal(denied.status, 401);
  await denied.text();
  assert.equal(executions, 0);
  const initialization = await rpc({ jsonrpc: "2.0", id: 2, method: "initialize", params: {
    protocolVersion: LATEST_PROTOCOL_VERSION, capabilities: {}, clientInfo: { name: "local-test", version: "1.0.0" }
  } });
  assert.equal(initialization.serverInfo.name, "isolated-compatibility-test");
  const tools = await rpc({ jsonrpc: "2.0", id: 3, method: "tools/list", params: {} });
  assert.deepEqual(tools.tools.map((tool) => tool.name), ["local_test"]);
  const result = await rpc({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "local_test", arguments: {} } });
  assert.equal(result.content[0].text, "local fixture only");
  assert.equal(executions, 1);
});
