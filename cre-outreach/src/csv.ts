import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { CONTACTS_CSV, OUTPUT_DIR } from "./config.js";
import type { OutreachRecord } from "./types.js";

export interface DomainInput {
  domain: string;
  company: string | null;
}

const DOMAIN_KEYS = ["domain", "website", "url", "site", "web"];
const COMPANY_KEYS = ["company", "name", "organization", "org", "business"];

/** Normalize "https://www.Acme.com/foo" -> "acme.com". */
export function normalizeDomain(raw: string): string {
  let d = raw.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "");
  d = d.replace(/^www\./, "");
  d = d.split("/")[0];
  d = d.split("?")[0];
  return d.trim();
}

/**
 * Read the input spreadsheet of domains. Tolerant of column naming: looks for a
 * domain-ish column and an optional company column. Falls back to the first
 * column if no header matches.
 */
export function readDomains(filePath: string): DomainInput[] {
  const text = fs.readFileSync(filePath, "utf8");
  const rows: Record<string, string>[] = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });
  if (rows.length === 0) return [];

  const headers = Object.keys(rows[0]).map((h) => h.toLowerCase());
  const domainKey =
    Object.keys(rows[0]).find((h) => DOMAIN_KEYS.includes(h.toLowerCase())) ??
    Object.keys(rows[0])[0];
  const companyKey = Object.keys(rows[0]).find((h) =>
    COMPANY_KEYS.includes(h.toLowerCase())
  );

  const seen = new Set<string>();
  const out: DomainInput[] = [];
  for (const row of rows) {
    const rawDomain = row[domainKey];
    if (!rawDomain) continue;
    const domain = normalizeDomain(rawDomain);
    if (!domain || seen.has(domain)) continue;
    seen.add(domain);
    out.push({
      domain,
      company: companyKey && row[companyKey] ? row[companyKey].trim() : null,
    });
  }
  void headers;
  return out;
}

/** Write the human-friendly enriched spreadsheet from the current state. */
export function writeContactsCsv(records: OutreachRecord[]): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const rows = records.map((r) => ({
    domain: r.domain,
    company: r.company ?? "",
    status: r.status,
    first_name: r.contact?.firstName ?? "",
    last_name: r.contact?.lastName ?? "",
    position: r.contact?.position ?? "",
    seniority: r.contact?.seniority ?? "",
    department: r.contact?.department ?? "",
    email: r.contact?.email ?? "",
    confidence: r.contact ? String(r.contact.confidence) : "",
    score: r.contact ? String(r.contact.score) : "",
    email_subject: r.email?.subject ?? "",
    gmail_draft_id: r.gmailDraftId ?? "",
    alternates: r.alternates
      .map((a) => `${a.email} (${a.position ?? "?"}, ${a.confidence})`)
      .join(" | "),
    notes: r.notes,
  }));
  const csv = stringify(rows, { header: true });
  fs.writeFileSync(CONTACTS_CSV, csv, "utf8");
}

export function relativeToRoot(p: string): string {
  return path.relative(process.cwd(), p);
}
