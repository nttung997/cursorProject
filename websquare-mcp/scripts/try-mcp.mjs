import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const transport = new StdioClientTransport({
  command: "node",
  args: [join(root, "websquare-mcp", "dist", "index.js")],
  env: { ...process.env, WEBSQUARE_PROJECT_ROOT: root },
});

const client = new Client({ name: "try-mcp", version: "1.0.0" });

async function callTool(name, args = {}) {
  const result = await client.callTool({ name, arguments: args });
  const text = result.content?.find((c) => c.type === "text")?.text ?? JSON.stringify(result);
  return text;
}

try {
  await client.connect(transport);

  const { tools } = await client.listTools();
  console.log("Tools:", tools.map((t) => t.name).join(", "));
  console.log("");

  console.log("--- list_pages ---");
  console.log(await callTool("list_pages"));
  console.log("");

  console.log("--- analyze_page (ui/main.xml) ---");
  console.log(await callTool("analyze_page", { path: "ui/main.xml" }));
  console.log("");

  console.log("--- validate_page (ui/main.xml) ---");
  console.log(await callTool("validate_page", { path: "ui/main.xml" }));
  console.log("");

  console.log("--- suggest_search ---");
  console.log(await callTool("suggest_search", { task: "submission", component: "gridView" }));

  await client.close();
  process.exit(0);
} catch (err) {
  console.error("MCP test failed:", err);
  process.exit(1);
}
