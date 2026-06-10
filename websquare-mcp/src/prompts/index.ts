export const PROMPTS: Record<
  string,
  { description: string; messages: Array<{ role: "user"; content: { type: "text"; text: string } }> }
> = {
  "create-grid-page": {
    description:
      "Workflow to create a WebSquare grid page with DataList, Submission, and scwin.onpageload",
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Create a new WebSquare5 grid page following this workflow:

1. Call get_dev_rules to load AGENTS.md coding rules.
2. Call analyze_page on websquare-demo/WebContent/ui/main.xml as the reference pattern.
3. Scaffold with scaffold_page (template: grid) or copy main.xml structure:
   - w2:dataList in w2:dataCollection with columnInfo
   - xf:submission with target="data:json,<dataListId>" and action="/data/<file>.json"
   - scwin.onpageload calling $p.executeSubmission("<submissionId>")
   - w2:gridView with dataList="data:<dataListId>" and gBody column ids matching DataList columns
4. Run validate_page on the new file before finishing.
5. Do not use $w.executeSubmission, document.querySelector, or ES imports.

Canonical example: websquare-demo/WebContent/ui/main.xml`,
        },
      },
    ],
  },
  "add-submission": {
    description: "Wire a Submission into an existing WebSquare page for static JSON or API data",
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Add or fix a Submission on an existing WebSquare5 page:

1. analyze_page on the target XML file.
2. validate_page to see current issues.
3. In xf:model add or update xf:submission:
   - id, action (e.g. /data/file.json or /api/endpoint), target="data:json,<dataListId>"
   - ev:submitdone="scwin.<id>_submitdone" handler in script
4. In script: scwin.onpageload calls $p.executeSubmission("<id>").
5. Ensure DataList column ids match GridView gBody column ids.
6. validate_page again after edits.

Use suggest_search with task "submission" if API syntax is unclear.`,
        },
      },
    ],
  },
  "fix-grid-binding": {
    description: "Diagnose and fix empty GridView or DataList binding issues",
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Fix GridView / DataList binding on a WebSquare5 page:

1. analyze_page on the affected XML — inspect dataLists, gridViews, submissions, submissionCalls.
2. validate_page — focus on grid-column-match, grid-datalist-exists, submission-ref rules.
3. Check:
   - GridView dataList="data:dlt_xxx" matches an existing DataList id
   - gBody w2:column id values match DataList w2:column id values (not header ids)
   - Submission target="data:json,<sameDataListId>"
   - scwin.onpageload executes the correct submission id
4. suggest_search with task "troubleshoot_grid" for external references.
5. Re-run validate_page until errorCount is 0.`,
        },
      },
    ],
  },
};
