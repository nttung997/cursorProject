#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { resolveProjectPaths } from "./config.js";
import { validatePage } from "./validators/rules.js";
import { suggestSearch } from "./suggestSearch.js";
import { PROMPTS } from "./prompts/index.js";
import { scaffoldGridPage, scaffoldFormPage } from "./scaffold.js";
import {
  listXmlPages,
  readPageFile,
  analyzePageFile,
  writePageFile,
} from "./utils/files.js";

const paths = resolveProjectPaths();

const server = new McpServer({
  name: "websquare",
  version: "1.0.0",
});

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

function readAgentsMd(section?: string): string {
  if (!existsSync(paths.agentsMd)) {
    return "AGENTS.md not found at project root.";
  }
  const content = readFileSync(paths.agentsMd, "utf-8");
  if (!section) return content;

  const sections = content.split(/^## /m);
  const header = sections[0] ?? "";
  const match = sections.find((s) =>
    s.toLowerCase().startsWith(section.toLowerCase()),
  );
  if (!match) {
    return `Section "${section}" not found.\n\nAvailable sections:\n${sections
      .slice(1)
      .map((s) => "- " + s.split("\n")[0])
      .join("\n")}`;
  }
  return "## " + match;
}

function formatAnalysis(relativePath: string, analysis: ReturnType<typeof analyzePageFile>["analysis"]): string {
  return JSON.stringify(
    {
      relativePath,
      dataLists: analysis.dataLists,
      submissions: analysis.submissions,
      gridViews: analysis.gridViews,
      components: analysis.components,
      scwinFunctions: analysis.scwinFunctions,
      submissionCalls: analysis.submissionCalls,
      eventHandlers: analysis.eventHandlers,
    },
    null,
    2,
  );
}

// --- Tools ---

server.tool(
  "get_dev_rules",
  "Return WebSquare development rules from AGENTS.md",
  { section: z.string().optional().describe("Optional section heading to filter") },
  async ({ section }) => textResult(readAgentsMd(section)),
);

server.tool(
  "list_pages",
  "List WebSquare XML pages under WebContent",
  {},
  async () => {
    const pages = listXmlPages(paths.webContentDir);
    return textResult(
      JSON.stringify({ webContentDir: paths.webContentDir, pages }, null, 2),
    );
  },
);

server.tool(
  "read_page",
  "Read a WebSquare page XML file with parsed summary",
  {
    path: z.string().describe("Relative path under WebContent, e.g. ui/main.xml"),
  },
  async ({ path: pagePath }) => {
    const { xml, analysis } = analyzePageFile(paths.webContentDir, pagePath);
    const summary = formatAnalysis(pagePath, analysis);
    return textResult(`## Raw XML\n\n${xml}\n\n## Analysis\n\n${summary}`);
  },
);

server.tool(
  "analyze_page",
  "Extract DataLists, Submissions, components, scwin functions, and GridView bindings",
  {
    path: z.string().describe("Relative path under WebContent, e.g. ui/main.xml"),
  },
  async ({ path: pagePath }) => {
    const { analysis } = analyzePageFile(paths.webContentDir, pagePath);
    return textResult(formatAnalysis(pagePath, analysis));
  },
);

server.tool(
  "validate_page",
  "Validate a WebSquare page against AGENTS.md rules",
  {
    path: z.string().describe("Relative path under WebContent, e.g. ui/main.xml"),
  },
  async ({ path: pagePath }) => {
    const { xml, analysis } = analyzePageFile(paths.webContentDir, pagePath);
    const result = validatePage(analysis, xml);
    return textResult(JSON.stringify(result, null, 2));
  },
);

server.tool(
  "scaffold_page",
  "Create a new WebSquare page from a template under WebContent/ui/",
  {
    name: z.string().describe("File name without path, e.g. users.xml"),
    template: z.enum(["grid", "form"]).describe("Template type"),
    pageTitle: z.string().optional(),
    dataListId: z.string().optional(),
    submissionId: z.string().optional(),
    submissionAction: z.string().optional(),
    dataMapId: z.string().optional(),
    columns: z
      .array(z.object({ id: z.string(), name: z.string() }))
      .optional()
      .describe("Column definitions for grid template"),
  },
  async (args) => {
    const fileName = args.name.endsWith(".xml") ? args.name : `${args.name}.xml`;
    const relativePath = `ui/${fileName}`;
    const base = fileName.replace(/\.xml$/i, "");

    let content: string;
    if (args.template === "grid") {
      content = scaffoldGridPage({
        pageName: base,
        pageTitle: args.pageTitle ?? `WebSquare — ${base}`,
        dataListId: args.dataListId ?? `dlt_${base}`,
        submissionId: args.submissionId ?? `sbm_load_${base}`,
        submissionAction: args.submissionAction ?? `/data/${base}.json`,
        columns: args.columns ?? [],
        templatesDir: paths.templatesDir,
      });
    } else {
      content = scaffoldFormPage({
        pageName: base,
        pageTitle: args.pageTitle ?? `WebSquare Form — ${base}`,
        dataMapId: args.dataMapId ?? `dma_${base}`,
        fields: args.columns ?? [{ id: "name", name: "Name" }],
        templatesDir: paths.templatesDir,
      });
    }

    const written = writePageFile(paths.webContentDir, relativePath, content);
    const { analysis } = analyzePageFile(paths.webContentDir, written);
    const validation = validatePage(analysis, content);

    return textResult(
      JSON.stringify(
        {
          created: written,
          template: args.template,
          validation,
        },
        null,
        2,
      ),
    );
  },
);

server.tool(
  "suggest_search",
  "Return official doc links and web search queries for a WebSquare task or component",
  {
    task: z.string().describe("Task or symptom, e.g. submission, grid empty, wframe"),
    component: z.string().optional().describe("Component name, e.g. gridView, dataList"),
  },
  async ({ task, component }) => textResult(suggestSearch(task, component)),
);

// --- Resources ---

server.resource(
  "rules",
  "websquare://rules",
  { description: "WebSquare5 development rules from AGENTS.md", mimeType: "text/markdown" },
  async () => ({
    contents: [
      {
        uri: "websquare://rules",
        mimeType: "text/markdown",
        text: readAgentsMd(),
      },
    ],
  }),
);

server.resource(
  "pages",
  "websquare://pages",
  { description: "Index of WebSquare XML pages", mimeType: "application/json" },
  async () => {
    const pages = listXmlPages(paths.webContentDir);
    const index = pages.map((p) => {
      try {
        const { analysis } = analyzePageFile(paths.webContentDir, p);
        return {
          path: p,
          componentCount: analysis.components.length,
          dataListCount: analysis.dataLists.length,
          submissionCount: analysis.submissions.length,
        };
      } catch {
        return { path: p, error: "parse failed" };
      }
    });
    return {
      contents: [
        {
          uri: "websquare://pages",
          mimeType: "application/json",
          text: JSON.stringify({ webContentDir: paths.webContentDir, pages: index }, null, 2),
        },
      ],
    };
  },
);

server.resource(
  "page",
  "websquare://page/{path}",
  { description: "Raw WebSquare page XML", mimeType: "application/xml" },
  async (uri) => {
    const url = new URL(uri.href);
    const pagePath = decodeURIComponent(url.pathname.replace(/^\//, ""));
    const xml = readPageFile(paths.webContentDir, pagePath);
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/xml",
          text: xml,
        },
      ],
    };
  },
);

// --- Prompts ---

for (const [name, prompt] of Object.entries(PROMPTS)) {
  server.prompt(name, prompt.description, {}, async () => ({
    messages: prompt.messages,
  }));
}

// --- Start ---

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("websquare-mcp failed:", err);
  process.exit(1);
});
