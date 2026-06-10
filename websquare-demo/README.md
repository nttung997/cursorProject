# WebSquare Demo Project

Starter project for learning **WebSquare 5** with Spring Boot 3.

## Structure

| Path | Purpose |
|------|---------|
| `WebContent/ui/main.xml` | WebSquare page — DataList, GridView, Submission |
| `WebContent/data/employees.json` | Static sample data |
| `websquare_home/` | WebSquare engine home (config) |
| `local_libs/` | Place licensed WebSquare engine JAR here |
| `preview/index.html` | Browser preview without WebSquare engine |
| `src/main/java/` | Spring Boot REST API |

## Quick start (no WebSquare engine)

```bash
cd websquare-demo
./gradlew bootRun
```

- API: http://localhost:8080/api/employees
- Preview: open `preview/index.html` in a browser (or serve the folder)

## Full WebSquare setup

1. Install **WebSquare 5 Studio** (or Eclipse plugin) from Inswave.
2. Copy the WebSquare engine JAR into `local_libs/`.
3. Copy engine static assets into `WebContent/websquare/` (from your distribution).
4. Point `websquare_home` at your full engine config.
5. Open `WebContent/ui/main.xml` in WebSquare Studio (F7 to run in browser).
6. With servlet registered, access pages via `*.wq` URL mapping.

## main.xml concepts

- **DataCollection** — `dlt_employee` DataList for grid binding
- **Submission** — `sbm_loadEmployees` fetches `/api/employees`
- **scwin** — page script namespace (`onpageload`, button handler)
- **GridView** — `grd_employee` bound to `data:dlt_employee`

## Requirements

- JDK 17+
- Gradle (wrapper optional — run `gradle wrapper` if needed)
- Licensed WebSquare 5 engine for XML page rendering
