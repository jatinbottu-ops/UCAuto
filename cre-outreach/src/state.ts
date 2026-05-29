import fs from "node:fs";
import path from "node:path";
import { EMAILS_DIR, OUTPUT_DIR, STATE_FILE } from "./config.js";
import type { GeneratedEmail, OutreachRecord } from "./types.js";

export interface State {
  version: 1;
  records: OutreachRecord[];
}

export function loadState(): State {
  if (!fs.existsSync(STATE_FILE)) return { version: 1, records: [] };
  const raw = fs.readFileSync(STATE_FILE, "utf8");
  try {
    return JSON.parse(raw) as State;
  } catch {
    throw new Error(
      `Could not parse ${STATE_FILE}. Delete the output/ folder to start fresh.`
    );
  }
}

export function saveState(state: State): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf8");
}

export function slugForDomain(domain: string): string {
  return domain.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
}

export function emailFilePath(domain: string): string {
  return path.join(EMAILS_DIR, `${slugForDomain(domain)}.md`);
}

/**
 * Editable on-disk format for one email. Front matter carries the addressing
 * metadata; the body is a `Subject:` line followed by the message. Users can
 * hand-edit these between `generate` and `draft`.
 */
export function writeEmailFile(rec: OutreachRecord): string {
  fs.mkdirSync(EMAILS_DIR, { recursive: true });
  const file = emailFilePath(rec.domain);
  const to = rec.contact?.email ?? "";
  const who = [
    [rec.contact?.firstName, rec.contact?.lastName].filter(Boolean).join(" "),
    rec.contact?.position,
  ]
    .filter(Boolean)
    .join(" — ");
  const fm = [
    "---",
    `to: ${to}`,
    `domain: ${rec.domain}`,
    `company: ${rec.company ?? rec.domain}`,
    `contact: ${who}`,
    "---",
    "",
    `Subject: ${rec.email?.subject ?? ""}`,
    "",
    rec.email?.body ?? "",
    "",
  ].join("\n");
  fs.writeFileSync(file, fm, "utf8");
  return file;
}

/** Parse an (possibly hand-edited) email markdown file back into to/subject/body. */
export function readEmailFile(
  file: string
): { to: string; email: GeneratedEmail } {
  const text = fs.readFileSync(file, "utf8");
  let to = "";
  let rest = text;

  const fmMatch = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fmMatch) {
    const fm = fmMatch[1];
    const toLine = fm.split("\n").find((l) => l.toLowerCase().startsWith("to:"));
    if (toLine) to = toLine.slice(toLine.indexOf(":") + 1).trim();
    rest = text.slice(fmMatch[0].length);
  }

  rest = rest.replace(/^\s+/, "");
  let subject = "";
  const subjMatch = rest.match(/^Subject:\s*(.*)\n/i);
  if (subjMatch) {
    subject = subjMatch[1].trim();
    rest = rest.slice(subjMatch[0].length);
  }
  const body = rest.replace(/^\s+/, "").replace(/\s+$/, "");

  return { to, email: { subject, body } };
}
