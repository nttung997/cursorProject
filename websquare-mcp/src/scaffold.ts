import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

interface ColumnDef {
  id: string;
  name: string;
}

interface ScaffoldGridOptions {
  pageName: string;
  pageTitle: string;
  dataListId: string;
  submissionId: string;
  submissionAction: string;
  columns: ColumnDef[];
  templatesDir: string;
}

interface ScaffoldFormOptions {
  pageName: string;
  pageTitle: string;
  dataMapId: string;
  fields: ColumnDef[];
  templatesDir: string;
}

function loadTemplate(templatesDir: string, name: string): string {
  const path = join(templatesDir, name);
  if (!existsSync(path)) {
    throw new Error(`Template not found: ${name}`);
  }
  return readFileSync(path, "utf-8");
}

function replaceAll(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.split(`{{${key}}}`).join(value);
  }
  return result;
}

export function scaffoldGridPage(opts: ScaffoldGridOptions): string {
  const base = opts.pageName.replace(/\.xml$/i, "");
  const columns = opts.columns.length
    ? opts.columns
    : [
        { id: "id", name: "ID" },
        { id: "name", name: "Name" },
      ];

  const columnXml = columns
    .map(
      (c) =>
        `                    <w2:column id="${c.id}" name="${c.name}" dataType="text"/>`,
    )
    .join("\n");

  const headerXml = columns
    .map(
      (c) =>
        `                    <w2:column id="hdr_${c.id}" inputType="text" value="${c.name}" width="120"/>`,
    )
    .join("\n");

  const bodyXml = columns
    .map(
      (c) =>
        `                    <w2:column id="${c.id}" inputType="text" width="120" readOnly="true"/>`,
    )
    .join("\n");

  const template = loadTemplate(opts.templatesDir, "grid-page.xml");

  return replaceAll(template, {
    DATA_LIST_ID: opts.dataListId,
    SUBMISSION_ID: opts.submissionId,
    SUBMISSION_ACTION: opts.submissionAction,
    PAGE_TITLE: opts.pageTitle,
    TITLE_TEXTBOX_ID: `txb_${base}_title`,
    STATUS_TEXTBOX_ID: `txb_${base}_status`,
    REFRESH_BUTTON_ID: `btn_${base}_refresh`,
    GRID_ID: `grd_${base}`,
    COLUMNS: columnXml,
    HEADER_COLUMNS: headerXml,
    BODY_COLUMNS: bodyXml,
  });
}

export function scaffoldFormPage(opts: ScaffoldFormOptions): string {
  const base = opts.pageName.replace(/\.xml$/i, "");
  const fields = opts.fields.length ? opts.fields : [{ id: "name", name: "Name" }];

  const keyInfo = fields
    .map(
      (f) =>
        `                    <w2:key id="${f.id}" name="${f.name}" dataType="text"/>`,
    )
    .join("\n");

  const template = loadTemplate(opts.templatesDir, "form-page.xml");

  return replaceAll(template, {
    DATA_MAP_ID: opts.dataMapId,
    PAGE_TITLE: opts.pageTitle,
    TITLE_TEXTBOX_ID: `txb_${base}_title`,
    STATUS_TEXTBOX_ID: `txb_${base}_status`,
    NAME_INPUT_ID: `inp_${fields[0]?.id ?? "name"}`,
    SAVE_BUTTON_ID: `btn_${base}_save`,
    CLEAR_BUTTON_ID: `btn_${base}_clear`,
    KEY_INFO: keyInfo,
  });
}
