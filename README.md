# cursorProject

WebSquare5 demo project with an MCP AI harness for Cursor agents.

## Contents

| Path | Description |
|------|-------------|
| [websquare-demo/](websquare-demo/) | Sample WebSquare pages and static data |
| [websquare-mcp/](websquare-mcp/) | TypeScript MCP server for WebSquare development |
| [AGENTS.md](AGENTS.md) | WebSquare5 coding rules and search guide |
| [.cursor/skills/websquare/](.cursor/skills/websquare/) | Cursor skill for WebSquare workflows |

## Quick start — preview (no WebSquare engine)

```bash
cd websquare-demo
python -m http.server 5500
```

Open http://localhost:5500/preview/index.html

## MCP harness setup

```bash
cd websquare-mcp
pnpm install
pnpm run build
```

Reload Cursor. The `websquare` MCP server is configured in [.cursor/mcp.json](.cursor/mcp.json).

### MCP tools

| Tool | Purpose |
|------|---------|
| `get_dev_rules` | Read AGENTS.md |
| `list_pages` | List `WebContent/**/*.xml` |
| `read_page` | Raw XML + analysis |
| `analyze_page` | DataLists, Submissions, components, scwin |
| `validate_page` | Rule checks with fixes |
| `scaffold_page` | Create grid/form page from template |
| `suggest_search` | Doc links and web search queries |

### MCP resources

- `websquare://rules` — AGENTS.md
- `websquare://pages` — page index
- `websquare://page/{path}` — page XML

### MCP prompts

- `create-grid-page`
- `add-submission`
- `fix-grid-binding`

## WebSquare Studio (full engine)

Install WebSquare 5 Studio from Inswave, open `websquare-demo/WebContent/ui/main.xml`, press F7 to run.
