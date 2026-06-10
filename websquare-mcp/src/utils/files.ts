import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { XMLParser } from "fast-xml-parser";
import { parsePageXml, type PageAnalysis } from "../parsers/pageParser.js";

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  cdataPropName: "__cdata",
  parseTagValue: false,
  trimValues: true,
});

export function listXmlPages(webContentDir: string): string[] {
  if (!existsSync(webContentDir)) return [];

  const results: string[] = [];

  function walk(dir: string): void {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) {
        walk(full);
      } else if (entry.endsWith(".xml")) {
        results.push(relative(webContentDir, full).replace(/\\/g, "/"));
      }
    }
  }

  walk(webContentDir);
  return results.sort();
}

export function readPageFile(webContentDir: string, relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\//, "");
  const full = join(webContentDir, normalized);
  if (!existsSync(full)) {
    throw new Error(`Page not found: ${relativePath}`);
  }
  return readFileSync(full, "utf-8");
}

export function analyzePageFile(
  webContentDir: string,
  relativePath: string,
): { xml: string; analysis: PageAnalysis } {
  const xml = readPageFile(webContentDir, relativePath);
  const parsed = xmlParser.parse(xml);
  const analysis = parsePageXml(relativePath, xml, parsed);
  return { xml, analysis };
}

export function writePageFile(
  webContentDir: string,
  relativePath: string,
  content: string,
): string {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\//, "");
  const full = join(webContentDir, normalized);
  writeFileSync(full, content, "utf-8");
  return normalized;
}
