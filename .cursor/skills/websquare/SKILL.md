---
name: websquare
description: >-
  Develop WebSquare5 XML pages using MCP tools and AGENTS.md rules. Use when
  editing WebContent/*.xml, working with scwin, w2:gridView, DataList,
  Submission, WFrame, or WebSquare Studio page files.
---
# WebSquare5 Development

## Before editing any `.xml` page

1. Call MCP tool `get_dev_rules` or read resource `websquare://rules`.
2. For existing pages: `analyze_page` then `validate_page` before and after changes.
3. Reference canonical example: `websquare-demo/WebContent/ui/main.xml`.

## MCP tool workflow

| Task | Tools |
|------|-------|
| New grid page | `scaffold_page` (template: grid) → customize → `validate_page` |
| New form page | `scaffold_page` (template: form) → customize → `validate_page` |
| Add/fix data loading | `analyze_page` → edit Submission + scwin → `validate_page` |
| Empty grid | Prompt `fix-grid-binding` + `analyze_page` + `validate_page` |
| API / syntax unknown | `suggest_search` then web search with returned queries |

## Coding rules (summary)

- Handlers on `scwin` (per-frame `scwin` when using scoped WFrames).
- `head`: `xf:model` + script; `body`: UI components.
- Data binding: `data:dlt_id`; mutate via DataList/DataMap APIs.
- Network: `$p.executeSubmission("submission_id")` — never `$w`.
- GridView gBody column `id` must match DataList column `id`.
- No ES modules, no `document.querySelector`.

## Prompts (MCP)

- `create-grid-page` — full grid + DataList + Submission checklist
- `add-submission` — wire static JSON or API into existing page
- `fix-grid-binding` — diagnose empty GridView

## Project layout

```
WebContent/ui/*.xml      WebSquare pages
WebContent/data/*.json   static Submission targets
AGENTS.md                full rules and search guide
websquare-mcp/           MCP server package
```

## Setup

```bash
cd websquare-mcp && pnpm install && pnpm run build
```

Reload Cursor after build so `.cursor/mcp.json` picks up the server.
