export interface DataListColumn {
  id: string;
  name?: string;
  dataType?: string;
}

export interface DataListInfo {
  id: string;
  columns: DataListColumn[];
}

export interface SubmissionInfo {
  id: string;
  action: string;
  target: string;
  method?: string;
  submitdoneHandler?: string;
}

export interface ComponentInfo {
  id: string;
  tag: string;
}

export interface GridViewInfo {
  id: string;
  dataListBinding: string;
  bodyColumnIds: string[];
}

export interface PageAnalysis {
  relativePath: string;
  dataLists: DataListInfo[];
  submissions: SubmissionInfo[];
  gridViews: GridViewInfo[];
  components: ComponentInfo[];
  scwinFunctions: string[];
  submissionCalls: string[];
  eventHandlers: string[];
  scriptContent: string;
}

function toRecordArray(value: unknown): Record<string, unknown>[] {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value as Record<string, unknown>[];
  return [value as Record<string, unknown>];
}

function stripNs(tag: string): string {
  const idx = tag.indexOf(":");
  return idx >= 0 ? tag.slice(idx + 1) : tag;
}

function attr(el: Record<string, unknown>, name: string): string {
  const val = el[`@_${name}`];
  return typeof val === "string" ? val : "";
}

function collectByTag(
  node: unknown,
  tagName: string,
  results: Record<string, unknown>[] = [],
): Record<string, unknown>[] {
  if (!node || typeof node !== "object") return results;

  if (Array.isArray(node)) {
    for (const item of node) {
      collectByTag(item, tagName, results);
    }
    return results;
  }

  const record = node as Record<string, unknown>;
  for (const [key, value] of Object.entries(record)) {
    if (stripNs(key) === tagName) {
      results.push(...toRecordArray(value));
    }
    collectByTag(value, tagName, results);
  }

  return results;
}

function extractScriptContent(xml: string): string {
  const match = xml.match(/<script[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/script>/i);
  if (match) return match[1];
  const plain = xml.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  return plain?.[1]?.trim() ?? "";
}

function extractScwinFunctions(script: string): string[] {
  const names = new Set<string>();
  const patterns = [
    /scwin\.(\w+)\s*=\s*function/g,
    /function\s+(scwin\.\w+)\s*\(/g,
    /scwin\.(\w+)\s*=\s*\(/g,
  ];
  for (const pattern of patterns) {
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(script)) !== null) {
      const name = m[1].startsWith("scwin.") ? m[1] : `scwin.${m[1]}`;
      names.add(name);
    }
  }
  return [...names].sort();
}

function extractSubmissionCalls(script: string): string[] {
  const calls: string[] = [];
  const pattern = /\$[pw]\.executeSubmission\s*\(\s*["']([^"']+)["']\s*\)/g;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(script)) !== null) {
    calls.push(m[1]);
  }
  return calls;
}

function extractEventHandlers(xml: string): string[] {
  const handlers = new Set<string>();
  const patterns = [
    /ev:onpageload\s*=\s*["']([^"']+)["']/g,
    /ev:handler\s*=\s*["']([^"']+)["']/g,
    /ev:submitdone\s*=\s*["']([^"']+)["']/g,
  ];
  for (const pattern of patterns) {
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(xml)) !== null) {
      handlers.add(m[1]);
    }
  }
  return [...handlers].sort();
}

function collectComponents(
  node: unknown,
  results: ComponentInfo[] = [],
): ComponentInfo[] {
  if (!node || typeof node !== "object") return results;

  if (Array.isArray(node)) {
    for (const item of node) {
      collectComponents(item, results);
    }
    return results;
  }

  const record = node as Record<string, unknown>;
  for (const [key, value] of Object.entries(record)) {
    if (key.startsWith("@_")) continue;
    const tag = stripNs(key);
    const elements = toRecordArray(value);
    if (elements.length === 0) continue;
    for (const el of elements) {
      const id = attr(el, "id");
      if (id && !tag.startsWith("column") && tag !== "row" && tag !== "label") {
        results.push({ id, tag });
      }
      collectComponents(el, results);
    }
  }

  return results;
}

export function parsePageXml(relativePath: string, xml: string, parsed: unknown): PageAnalysis {
  const scriptContent = extractScriptContent(xml);
  const dataListEls = collectByTag(parsed, "dataList");
  const submissionEls = collectByTag(parsed, "submission");
  const gridEls = collectByTag(parsed, "gridView");

  const dataLists: DataListInfo[] = dataListEls.map((el) => {
    const columnEls = collectByTag(el, "column").filter((c) => {
      const parent = c;
      return attr(parent, "id") && !attr(parent, "inputType");
    });
    const columns: DataListColumn[] = columnEls.map((c) => ({
      id: attr(c, "id"),
      name: attr(c, "name") || undefined,
      dataType: attr(c, "dataType") || undefined,
    }));
    return { id: attr(el, "id"), columns };
  });

  const submissions: SubmissionInfo[] = submissionEls.map((el) => ({
    id: attr(el, "id"),
    action: attr(el, "action"),
    target: attr(el, "target"),
    method: attr(el, "method") || undefined,
    submitdoneHandler: attr(el, "submitdone") || undefined,
  }));

  const gridViews: GridViewInfo[] = gridEls.map((el) => {
    const gBodyEl = collectByTag(el, "gBody")[0];
    const gBodyCols = gBodyEl
      ? collectByTag(gBodyEl, "column")
          .filter((c) => attr(c, "inputType"))
          .map((c) => attr(c, "id"))
          .filter(Boolean)
      : [];
    return {
      id: attr(el, "id"),
      dataListBinding: attr(el, "dataList"),
      bodyColumnIds: gBodyCols,
    };
  });

  const bodyNode = (parsed as Record<string, unknown>)?.html
    ? ((parsed as Record<string, unknown>).html as Record<string, unknown>)?.body
    : (parsed as Record<string, unknown>)?.body;

  const components = collectComponents(bodyNode).filter(
    (c, i, arr) => arr.findIndex((x) => x.id === c.id) === i,
  );

  return {
    relativePath,
    dataLists,
    submissions,
    gridViews,
    components,
    scwinFunctions: extractScwinFunctions(scriptContent),
    submissionCalls: extractSubmissionCalls(scriptContent),
    eventHandlers: extractEventHandlers(xml),
    scriptContent,
  };
}
