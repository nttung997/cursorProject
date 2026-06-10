# WebSquare5 Development Rules

You are editing WebSquare5 page files (.xml) under the web root (e.g. `WebContent/`).

## Coding rules

- **Logic scope:** Attach handlers to `scwin` (e.g. `scwin.btn_save_onclick = function() { ... };`). In scoped WFrames, use that frame's `scwin`.
- **Page structure:** `head` holds `xf:model` (DataCollection, Submissions) and `<script>`; `body` holds UI components.
- **Data:** Bind with `data:dlt_id`. Mutate via DataList/DataMap APIs (`setCellData(rowIndex, "columnId", value)`, `set("key", value)`), not raw array edits.
- **UI:** Reference components by their XML `id` (e.g. `txb_status.setValue(...)`).
- **Network / static data:** Use Submissions in `xf:model`; run with `$p.executeSubmission("submission_id")`.
- **GridView:** Body column `id` must match DataList column `id`.
- **Avoid:** ES modules, `document.querySelector`, and direct DOM manipulation unless using raw HTML blocks.

## Official documentation (search here first)

| Resource | URL | Use for |
|----------|-----|---------|
| SP4 User Guide (English) | https://docs.inswave.com/support/guide/sp4_english_html/index.xhtml | Concepts: Page, Scope, WFrame, DataCollection, Submission |
| API index (versioned) | https://docs.inswave.com/support/api/ | Component/method signatures — match your engine version |
| Inswave support portal | https://docs.inswave.com/support/ | Guides, release notes, troubleshooting |
| Confluence KB (if your org has access) | `inswave01.atlassian.net` | Spring Boot/Tomcat integration, internal patterns |

**API lookup pattern:** `WebSquare.uiplugin.<componentName>` — e.g. `WebSquare.uiplugin.gridView`, `WebSquare.uiplugin.dataList`.

**Global APIs:** `$p` (page), `WebSquare.ModelUtil`, `WebSquare.util` — search API index for `$p`, `ModelUtil`, `util`.

## What to search on the web

Use **exact component/API names** from the XML `id` or tag prefix (`w2:gridView` → `gridView`).

### Search query templates

| Goal | Example queries |
|------|-----------------|
| Component API | `WebSquare5 gridView setCellData` / `WebSquare.uiplugin.gridView` |
| Data binding | `WebSquare5 DataList setJSON` / `WebSquare5 dataCollection bind gridView` |
| Submission | `WebSquare5 submission submitdone` / `WebSquare5 executeSubmission target data:json` |
| Page lifecycle | `WebSquare5 scwin onpageload` / `WebSquare5 initScript postScript` |
| Layout / navigation | `WebSquare5 WFrame scope` / `WebSquare5 TabControl` / `WebSquare5 WindowContainer` |
| Select/check lists | `WebSquare5 setNodeSet BindItemSet` / `WebSquare5 selectbox dataList` |
| Excel / file | `WebSquare5 gridView excel download` / `WebSquare5 upload submission` |
| Popup / dialog | `WebSquare5 popup open` / `WebSquare5 floatingLayer` |
| Server integration | `WebSquare5 SpringBoot WEBSQUARE_HOME` / `WebSquare5 DefaultRequestDispatcher *.wq` |
| Studio usage | `WebSquare5 Studio F7` / `WebSquare5 WebSquare Page 생성` |

### By task (copy-paste starters)

```
WebSquare5 DataList getAllJSON
WebSquare5 DataMap set get
WebSquare5 GridView column binding dataList
WebSquare5 Submission action mediatype application/json
WebSquare5 $p.executeSubmission
WebSquare5 scwin WFrame scope true
WebSquare5 config.xml websquare.xml
WebSquare5 WEBSQUARE_HOME servlet
```

### Troubleshooting searches

| Symptom | Search for |
|---------|------------|
| Page blank / not rendering | `WebSquare5 websquare.html` / `javascript.wq bootloader 404` |
| Submission fails | `WebSquare5 submission submiterror` / `WebSquare5 abort ModelUtil` |
| Grid empty after load | `WebSquare5 setJSON DataList` / `GridView dataList bind` |
| Wrong servlet version | `WebSquare5 jakarta servlet` OR `javax.servlet SpringBoot` (match your stack) |
| Studio browser error | `WebSquare5 Studio 브라우저 실행` / `WebSquare.startApplication is not function` |
| JSON/XML mapping | `WebSquare5 submission target data:json` / `baseNode repeatNode` |

### Korean vs English

- **English:** Official guide chapters on `docs.inswave.com` (SP4 User Guide).
- **Korean:** Often more examples on blogs — append `웹스퀘어5` or `WebSquare5`:
  - `웹스퀘어5 gridView`
  - `웹스퀘어5 dataCollection 바인딩`
  - `웹스퀘어5 submission`
  - `웹스퀘어5 WFrame scope`
- Prefer **official API docs** for method names; use **Korean blog posts** for step-by-step Studio screenshots.

### Version discipline

Always include your **engine/SP version** when searching — APIs differ between SP4/SP5 and builds:

```
WebSquare5 SP5 5.0 gridView API
site:docs.inswave.com dataList
```

If Studio is installed, check **Help → About** or the JAR filename (e.g. `websquare_5.0_5.xxxx`) and search that build's API index.

## Key guide chapters (official)

| Topic | Guide chapter |
|-------|----------------|
| Page / scwin / onpageload | Chapter 5 — Page |
| WFrame / scope | Chapter 5–6 — Page, Coding |
| DataCollection / DataList / DataMap | Chapter 21 — DataCollection |
| Submission | Submission / Workflow chapters |
| GridView binding | Chapter 24 — Example |
| Component palette | Chapter 8 — Palette |

## Project layout (this repo)

```
WebContent/ui/*.xml     ← WebSquare pages
WebContent/data/*.json ← static data for Submissions
websquare_home/        ← engine config (WEBSQUARE_HOME)
local_libs/            ← licensed engine JAR
preview/               ← HTML preview without engine (not WebSquare)
```

## When stuck

1. Identify the **component tag** (`w2:gridView`) or **API object** (`dlt_employee`, `$p`).
2. Search `WebSquare.uiplugin.<component>` on docs.inswave.com API index.
3. Search `WebSquare5 <component> <what you want>` on the web; add `웹스퀘어5` for tutorials.
4. Confirm **Submission target** syntax: `data:json,<dataListId>` or `data:xml,<dataListId>`.
5. Do **not** default to React/Vue/jQuery patterns — use WebSquare DataCollection + Submission model.
