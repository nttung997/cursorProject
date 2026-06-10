# cursorProject

WebSquare5 demo project with an MCP AI harness for Cursor agents.

## Contents

| Path | Description |
|------|-------------|
| [websquare-demo/](websquare-demo/) | Sample WebSquare pages and static data |
| [websquare-mcp/](websquare-mcp/) | TypeScript MCP server — see [websquare-mcp/README.md](websquare-mcp/README.md) |
| [AGENTS.md](AGENTS.md) | WebSquare5 coding rules and search guide |
| [.cursor/skills/websquare/](.cursor/skills/websquare/) | Cursor skill for WebSquare workflows |

## Quick start — preview (no WebSquare engine)

```bash
cd websquare-demo
python -m http.server 5500
```

Open http://localhost:5500/preview/index.html

## MCP harness setup

See **[websquare-mcp/README.md](websquare-mcp/README.md)** for installation, tool reference, validation rules, and architecture.

```bash
cd websquare-mcp
pnpm install
pnpm run build
```

Reload Cursor. The `websquare` MCP server is configured in [.cursor/mcp.json](.cursor/mcp.json).

AI agents: read [websquare-mcp/AGENTS.md](websquare-mcp/AGENTS.md) for required workflows.

## WebSquare Studio (full engine)

Install WebSquare 5 Studio from Inswave, open `websquare-demo/WebContent/ui/main.xml`, press F7 to run.
