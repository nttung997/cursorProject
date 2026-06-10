# websquare-mcp — Agent Instructions

You have access to the **`websquare` MCP server**. Use it for all WebSquare5 `.xml` page work instead of guessing structure or APIs.

## When to use this MCP

| User intent | Action |
|-------------|--------|
| Create/edit WebSquare `.xml` | `get_dev_rules` → `analyze_page` → edit → `validate_page` |
| New grid/list page | Prompt `create-grid-page` or `scaffold_page` (template: `grid`) |
| New form page | `scaffold_page` (template: `form`) |
| Add/fix data loading | Prompt `add-submission` or `analyze_page` + edit Submission |
| Empty grid / binding issues | Prompt `fix-grid-binding` + `validate_page` |
| Unknown WebSquare API | `suggest_search` → web search with returned queries |
| Need project rules | `get_dev_rules` or resource `websquare://rules` |
| Browse pages | `list_pages` or resource `websquare://pages` |

## Required workflow

**Before editing any page:**

1. `get_dev_rules` (or read `websquare://rules`)
2. `analyze_page` on the target file
3. Make changes following rules below

**After editing:**

4. `validate_page` — do not finish until `valid: true` or user accepts warnings

**Before creating a page:**

- Prefer `scaffold_page` over writing XML from scratch
- Add matching JSON under `WebContent/data/` if using Submission to static file
- Run `validate_page` on the scaffolded file

## Tool reference (quick)

```
get_dev_rules({ section? })
list_pages()
read_page({ path: "ui/main.xml" })
analyze_page({ path: "ui/main.xml" })
validate_page({ path: "ui/main.xml" })
scaffold_page({ name, template: "grid"|"form", ... })
suggest_search({ task, component? })
```

**Paths** are relative to `WebContent/` (e.g. `ui/main.xml`, not `websquare-demo/WebContent/ui/main.xml`).

## WebSquare rules (enforced by validate_page)

- Handlers on **`scwin`** (e.g. `scwin.btn_save_onclick`)
- **`$p.executeSubmission("id")`** — never `$w`
- GridView **gBody column `id`** must match DataList **column `id`**
- DataList binding: `data:dlt_id` or `data:json,dlt_id`
- Submission target: `data:json,<dataListId>`
- No `document.querySelector`, no ES `import` in script
- UI via component **id** (e.g. `txb_status.setValue(...)`)

Full rules: project root [AGENTS.md](../AGENTS.md).

## Canonical example

`websquare-demo/WebContent/ui/main.xml` — employee grid with:

- `dlt_employee` DataList
- `sbm_loadEmployees` → `/data/employees.json`
- `grd_employee` bound to `data:dlt_employee`
- `scwin.onpageload` calls `$p.executeSubmission`

Call `analyze_page({ path: "ui/main.xml" })` to inspect this pattern.

## Prompts

| Prompt | Triggers |
|--------|----------|
| `create-grid-page` | "new grid", "list page", "employee table" |
| `add-submission` | "load json", "fetch data", "wire submission" |
| `fix-grid-binding` | "grid empty", "no data", "binding error" |

## Do not

- Invent WebSquare APIs — use `suggest_search` then official docs
- Use React/Vue/jQuery patterns — DataCollection + Submission model
- Skip `validate_page` after edits
- Assume backend exists — static JSON at `/data/*.json` is valid
- Call `scaffold_page` without confirming file name (it writes to disk)

## Error handling

When `validate_page` returns issues:

1. Read each `rule`, `message`, and `fix` field
2. Apply fixes in order: errors first, then warnings
3. Re-run `validate_page`

Common fixes:

| Rule | Fix |
|------|-----|
| `grid-column-match` | Align gBody `w2:column id` with DataList `w2:column id` |
| `scwin-defined` | Add missing `scwin.handler = function() { ... }` |
| `submission-ref` | Add `xf:submission id="..."` or fix `executeSubmission` id |
| `submission-api` | Replace `$w` with `$p` |

## Resources vs tools

- **`websquare://rules`** — read-only rules markdown (prefer `get_dev_rules` for section filter)
- **`websquare://pages`** — index JSON; use before `read_page` on unknown paths
- **`websquare://page/ui/main.xml`** — raw XML only; use `analyze_page` for structure

## Out of scope

This MCP cannot:

- Run WebSquare Studio or render pages in a browser
- Execute Submissions or validate server responses
- Fetch live Inswave documentation

For rendering: WebSquare Studio (F7) or project `preview/index.html` (non-WebSquare HTML preview).
