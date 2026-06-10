# WebSquare Demo Project

Starter project for learning **WebSquare 5** — static data only, **no backend required**.

## Structure

| Path | Purpose |
|------|---------|
| `WebContent/ui/main.xml` | WebSquare page — DataList, GridView, Submission |
| `WebContent/data/employees.json` | Static sample data |
| `websquare_home/` | WebSquare engine home (config) |
| `local_libs/` | Place licensed WebSquare engine JAR here |
| `preview/index.html` | Browser preview without WebSquare engine |
| `src/main/java/` | Optional Spring Boot sample (not required) |

## Quick start

1. Open `WebContent/ui/main.xml` in **WebSquare Studio** → **F7** to run.
2. Or open `preview/index.html` in a browser (serve the project folder if fetch is blocked).

Data loads from `WebContent/data/employees.json` via Submission — no API server needed.

## Full WebSquare setup

1. Install **WebSquare 5 Studio** (or Eclipse plugin) from Inswave.
2. Copy the WebSquare engine JAR into `local_libs/`.
3. Copy engine static assets into `WebContent/websquare/` (from your distribution).
4. Point `websquare_home` at your full engine config.
5. Open `WebContent/ui/main.xml` in WebSquare Studio (F7 to run in browser).

## main.xml concepts

- **DataCollection** — `dlt_employee` DataList for grid binding
- **Submission** — `sbm_loadEmployees` fetches `/data/employees.json`
- **scwin** — page script namespace (`onpageload`, button handler)
- **GridView** — `grd_employee` bound to `data:dlt_employee`

## Requirements

- Licensed WebSquare 5 engine for XML page rendering (Studio includes this)
- Optional: JDK 17+ only if you want to run the unused Spring Boot sample in `src/`
