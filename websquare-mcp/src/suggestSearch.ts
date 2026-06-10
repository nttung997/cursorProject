const DOC_LINKS = {
  userGuide: "https://docs.inswave.com/support/guide/sp4_english_html/index.xhtml",
  apiIndex: "https://docs.inswave.com/support/api/",
  support: "https://docs.inswave.com/support/",
  chapterPage: "https://docs.inswave.com/support/guide/sp4_english_html/chapter_05.xhtml",
  chapterDataCollection:
    "https://docs.inswave.com/support/guide/sp4_english_html/chapter_21.xhtml",
  chapterExample:
    "https://docs.inswave.com/support/guide/sp4_english_html/chapter_24.xhtml",
};

const TASK_QUERIES: Record<string, string[]> = {
  gridview: [
    "WebSquare5 gridView setCellData",
    "WebSquare.uiplugin.gridView",
    "WebSquare5 GridView column binding dataList",
    "웹스퀘어5 gridView",
  ],
  datalist: [
    "WebSquare5 DataList setJSON",
    "WebSquare5 dataCollection bind gridView",
    "WebSquare5 DataList getAllJSON",
    "웹스퀘어5 dataCollection 바인딩",
  ],
  submission: [
    "WebSquare5 submission submitdone",
    "WebSquare5 executeSubmission target data:json",
    "WebSquare5 Submission action mediatype application/json",
    "웹스퀘어5 submission",
  ],
  scwin: [
    "WebSquare5 scwin onpageload",
    "WebSquare5 initScript postScript",
  ],
  wframe: [
    "WebSquare5 WFrame scope",
    "WebSquare5 scwin WFrame scope true",
    "웹스퀘어5 WFrame scope",
  ],
  selectbox: [
    "WebSquare5 setNodeSet BindItemSet",
    "WebSquare5 selectbox dataList",
  ],
  popup: [
    "WebSquare5 popup open",
    "WebSquare5 floatingLayer",
  ],
  server: [
    "WebSquare5 SpringBoot WEBSQUARE_HOME",
    "WebSquare5 DefaultRequestDispatcher *.wq",
  ],
  studio: [
    "WebSquare5 Studio F7",
    "WebSquare5 WebSquare Page 생성",
  ],
  troubleshoot_blank: [
    "WebSquare5 websquare.html",
    "javascript.wq bootloader 404",
  ],
  troubleshoot_grid: [
    "WebSquare5 setJSON DataList",
    "GridView dataList bind",
  ],
  troubleshoot_submission: [
    "WebSquare5 submission submiterror",
    "WebSquare5 abort ModelUtil",
  ],
};

export function suggestSearch(task: string, component?: string): string {
  const key = task.toLowerCase().replace(/\s+/g, "_");
  const comp = component?.toLowerCase().replace(/^w2:/, "") ?? "";

  const matchedKey =
    Object.keys(TASK_QUERIES).find((k) => key.includes(k) || k.includes(key)) ??
    (comp ? Object.keys(TASK_QUERIES).find((k) => comp.includes(k)) : undefined);

  const queries = matchedKey
    ? TASK_QUERIES[matchedKey]
    : [
        `WebSquare5 ${task}${component ? ` ${component}` : ""}`,
        `WebSquare.uiplugin.${component || task}`,
        `웹스퀘어5 ${task}`,
      ];

  if (component && !queries.some((q) => q.includes(component))) {
    queries.unshift(`WebSquare.uiplugin.${component}`);
  }

  const lines = [
    "## Official documentation",
    `- SP4 User Guide: ${DOC_LINKS.userGuide}`,
    `- API index: ${DOC_LINKS.apiIndex}`,
    `- Page concepts (Ch.5): ${DOC_LINKS.chapterPage}`,
    `- DataCollection (Ch.21): ${DOC_LINKS.chapterDataCollection}`,
    `- GridView example (Ch.24): ${DOC_LINKS.chapterExample}`,
    "",
    "## Suggested web searches",
    ...queries.map((q) => `- ${q}`),
    "",
    "## Tips",
    "- Match queries to your engine SP version (e.g. WebSquare5 SP5 5.0).",
    "- Use site:docs.inswave.com for official API pages.",
    "- Append 웹스퀘어5 for Korean tutorial posts with Studio screenshots.",
  ];

  return lines.join("\n");
}
