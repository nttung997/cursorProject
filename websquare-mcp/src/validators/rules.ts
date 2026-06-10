import type { PageAnalysis } from "../parsers/pageParser.js";

export type Severity = "error" | "warning";

export interface ValidationIssue {
  severity: Severity;
  rule: string;
  message: string;
  fix?: string;
}

export interface ValidationResult {
  valid: boolean;
  errorCount: number;
  warningCount: number;
  issues: ValidationIssue[];
}

function dataListIdFromBinding(binding: string): string | null {
  const typed = binding.match(/^data:(?:json|xml),(.+)$/);
  if (typed) return typed[1];
  const shorthand = binding.match(/^data:([^,]+)$/);
  return shorthand?.[1] ?? null;
}

export function validatePage(analysis: PageAnalysis, rawXml: string): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (rawXml.includes("$w.executeSubmission")) {
    issues.push({
      severity: "error",
      rule: "submission-api",
      message: "Found $w.executeSubmission — use $p.executeSubmission instead.",
      fix: 'Replace $w.executeSubmission("id") with $p.executeSubmission("id").',
    });
  }

  if (/\bdocument\.querySelector\b/.test(analysis.scriptContent)) {
    issues.push({
      severity: "error",
      rule: "no-dom-api",
      message: "document.querySelector found in script — use component ids instead.",
      fix: "Access components by id (e.g. txb_status.setValue(...)).",
    });
  }

  if (/\bimport\s+/.test(analysis.scriptContent)) {
    issues.push({
      severity: "error",
      rule: "no-es-modules",
      message: "ES module import found in script block.",
      fix: "Remove import statements; WebSquare pages use scwin-scoped scripts.",
    });
  }

  for (const call of analysis.submissionCalls) {
    const exists = analysis.submissions.some((s) => s.id === call);
    if (!exists) {
      issues.push({
        severity: "error",
        rule: "submission-ref",
        message: `Script calls executeSubmission("${call}") but no matching xf:submission id exists.`,
        fix: `Add <xf:submission id="${call}" ...> in xf:model or fix the call id.`,
      });
    }
  }

  for (const handler of analysis.eventHandlers) {
    if (!handler.startsWith("scwin.")) {
      issues.push({
        severity: "warning",
        rule: "scwin-handler",
        message: `Event handler "${handler}" is not scoped to scwin.`,
        fix: `Use scwin.myHandler format (e.g. scwin.btn_save_onclick).`,
      });
      continue;
    }
    if (!analysis.scwinFunctions.includes(handler)) {
      issues.push({
        severity: "error",
        rule: "scwin-defined",
        message: `Handler "${handler}" is referenced in XML but not defined in script.`,
        fix: `Add ${handler} = function() { ... }; in the script block.`,
      });
    }
  }

  for (const grid of analysis.gridViews) {
    if (!grid.dataListBinding.startsWith("data:")) {
      issues.push({
        severity: "error",
        rule: "grid-binding-syntax",
        message: `GridView "${grid.id}" dataList="${grid.dataListBinding}" — expected data:dlt_id format.`,
        fix: 'Set dataList="data:dlt_yourListId".',
      });
      continue;
    }

    const dltId = dataListIdFromBinding(grid.dataListBinding);
    const dataList = analysis.dataLists.find((d) => d.id === dltId);
    if (!dataList) {
      issues.push({
        severity: "error",
        rule: "grid-datalist-exists",
        message: `GridView "${grid.id}" binds to "${grid.dataListBinding}" but DataList "${dltId}" not found.`,
        fix: `Add w2:dataList id="${dltId}" in w2:dataCollection.`,
      });
      continue;
    }

    const columnIds = new Set(dataList.columns.map((c) => c.id));
    for (const colId of grid.bodyColumnIds) {
      if (!columnIds.has(colId)) {
        issues.push({
          severity: "error",
          rule: "grid-column-match",
          message: `GridView "${grid.id}" body column id="${colId}" not in DataList "${dltId}" columnInfo.`,
          fix: `Add <w2:column id="${colId}" .../> to DataList or fix gBody column id.`,
        });
      }
    }
  }

  for (const sub of analysis.submissions) {
    if (!sub.target.match(/^data:(json|xml),/)) {
      issues.push({
        severity: "warning",
        rule: "submission-target",
        message: `Submission "${sub.id}" target="${sub.target}" — expected data:json,<id> or data:xml,<id>.`,
        fix: 'Set target="data:json,dlt_yourListId".',
      });
    }

    if (
      sub.action &&
      !sub.action.startsWith("/data/") &&
      !sub.action.startsWith("http") &&
      sub.action !== ""
    ) {
      issues.push({
        severity: "warning",
        rule: "submission-action",
        message: `Submission "${sub.id}" action="${sub.action}" — verify path is served from WebContent.`,
        fix: "Use /data/file.json for static data or a known API path.",
      });
    }
  }

  const ids = analysis.components.map((c) => c.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  for (const id of [...new Set(dupes)]) {
    issues.push({
      severity: "error",
      rule: "unique-component-id",
      message: `Duplicate component id "${id}" in body.`,
      fix: "Assign unique id attributes to each component.",
    });
  }

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;

  return {
    valid: errorCount === 0,
    errorCount,
    warningCount,
    issues,
  };
}
