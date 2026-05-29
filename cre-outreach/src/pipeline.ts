import fs from "node:fs";
import { config, CONTACTS_CSV, requireAnthropicKeys, requireHunterKeys } from "./config.js";
import { readDomains, relativeToRoot, writeContactsCsv } from "./csv.js";
import { searchDomain } from "./hunter.js";
import { writeEmail } from "./emailWriter.js";
import { createDraft } from "./gmail.js";
import {
  emailFilePath,
  loadState,
  readEmailFile,
  saveState,
  writeEmailFile,
  type State,
} from "./state.js";
import type { OutreachRecord } from "./types.js";

function now(): string {
  return new Date().toISOString();
}

function findRecord(state: State, domain: string): OutreachRecord | undefined {
  return state.records.find((r) => r.domain === domain);
}

/** STEP 1 — Hunter.io lookup + best-contact selection. */
export async function enrich(opts: {
  input: string;
  limit?: number;
  force?: boolean;
}): Promise<void> {
  const hunterKeys = requireHunterKeys(); // fail fast before looping
  if (!fs.existsSync(opts.input))
    throw new Error(
      `Input file not found: ${relativeToRoot(opts.input)}. ` +
        `Pass --input <your.csv> (or try data/domains.sample.csv).`
    );
  const domains = readDomains(opts.input);
  if (domains.length === 0) {
    console.log(`No domains found in ${relativeToRoot(opts.input)}.`);
    return;
  }
  const state = loadState();

  // Upsert input rows into state without clobbering downstream work.
  for (const d of domains) {
    if (!findRecord(state, d.domain)) {
      state.records.push({
        domain: d.domain,
        company: d.company,
        status: "pending",
        contact: null,
        alternates: [],
        email: null,
        emailFile: null,
        gmailDraftId: null,
        notes: "",
        updatedAt: now(),
      });
    } else if (d.company) {
      findRecord(state, d.domain)!.company ??= d.company;
    }
  }

  const targets = state.records.filter(
    (r) => opts.force || ["pending", "error", "no_contact"].includes(r.status)
  );
  const slice = opts.limit ? targets.slice(0, opts.limit) : targets;
  console.log(
    `Enriching ${slice.length} domain(s) via Hunter.io ` +
      `(${hunterKeys.length} key${hunterKeys.length === 1 ? "" : "s"} pooled)${
        opts.limit ? `, limited to ${opts.limit}` : ""
      }...\n`
  );

  for (const rec of slice) {
    try {
      const { organization, contacts } = await searchDomain(rec.domain);
      rec.company ??= organization;
      if (contacts.length === 0) {
        rec.status = "no_contact";
        rec.contact = null;
        rec.notes = "Hunter returned no email addresses.";
        console.log(`  ${rec.domain}: no contacts found`);
      } else {
        const best = contacts[0];
        rec.contact = best;
        rec.alternates = contacts.slice(1, 5);
        if (best.confidence < config.minConfidence) {
          rec.status = "low_confidence";
          rec.notes = `Best contact below MIN_CONFIDENCE (${best.confidence} < ${config.minConfidence}).`;
        } else {
          rec.status = "enriched";
          rec.notes = "";
        }
        const name =
          [best.firstName, best.lastName].filter(Boolean).join(" ") || best.email;
        console.log(
          `  ${rec.domain}: ${name} — ${best.position ?? "?"} <${best.email}> ` +
            `[score ${best.score}, conf ${best.confidence}]`
        );
      }
    } catch (e) {
      rec.status = "error";
      rec.notes = (e as Error).message;
      console.log(`  ${rec.domain}: ERROR — ${(e as Error).message}`);
    }
    rec.updatedAt = now();
    saveState(state); // checkpoint after every domain
  }

  writeContactsCsv(state.records);
  console.log(`\n✓ Spreadsheet updated: ${relativeToRoot(CONTACTS_CSV)}`);
}

/** STEP 2 — write a personalized email for every record that has a contact. */
export async function generate(opts: {
  limit?: number;
  force?: boolean;
}): Promise<void> {
  const aiKeys = requireAnthropicKeys(); // fail fast before looping
  const state = loadState();
  const targets = state.records.filter(
    (r) =>
      r.contact &&
      ["enriched", "low_confidence", "generated", "drafted"].includes(r.status) &&
      (opts.force || !r.email)
  );
  const slice = opts.limit ? targets.slice(0, opts.limit) : targets;
  if (slice.length === 0) {
    console.log("Nothing to generate. Run `enrich` first, or pass --force to rewrite.");
    return;
  }
  console.log(
    `Writing ${slice.length} email(s) with ${config.anthropicModel} ` +
      `(${aiKeys.length} key${aiKeys.length === 1 ? "" : "s"} pooled)...\n`
  );

  for (const rec of slice) {
    try {
      const email = await writeEmail(rec);
      rec.email = email;
      rec.emailFile = writeEmailFile(rec);
      if (rec.status === "enriched" || rec.status === "low_confidence")
        rec.status = "generated";
      rec.updatedAt = now();
      saveState(state);
      console.log(`  ${rec.domain}: "${email.subject}" → ${relativeToRoot(rec.emailFile)}`);
    } catch (e) {
      rec.notes = (e as Error).message;
      rec.updatedAt = now();
      saveState(state);
      console.log(`  ${rec.domain}: ERROR — ${(e as Error).message}`);
    }
  }

  writeContactsCsv(state.records);
  console.log(
    `\n✓ Emails written to output/emails/. Edit any of them, then run \`draft\`.`
  );
}

/** STEP 3 — turn each (possibly edited) email file into a Gmail draft. */
export async function draft(opts: { limit?: number; force?: boolean }): Promise<void> {
  const state = loadState();
  const targets = state.records.filter(
    (r) => r.contact && r.email && (opts.force || r.status !== "drafted")
  );
  const slice = opts.limit ? targets.slice(0, opts.limit) : targets;
  if (slice.length === 0) {
    console.log("Nothing to draft. Run `generate` first.");
    return;
  }
  console.log(`Creating ${slice.length} Gmail draft(s)...\n`);

  for (const rec of slice) {
    try {
      // Re-read the file so hand-edits are picked up.
      const file = rec.emailFile ?? emailFilePath(rec.domain);
      const { to, email } = readEmailFile(file);
      const recipient = to || rec.contact!.email;
      const id = await createDraft({
        to: recipient,
        subject: email.subject,
        body: email.body,
      });
      rec.email = email;
      rec.gmailDraftId = id;
      rec.status = "drafted";
      rec.updatedAt = now();
      saveState(state);
      console.log(`  ${rec.domain}: draft created → ${recipient} (id ${id})`);
    } catch (e) {
      rec.notes = (e as Error).message;
      rec.updatedAt = now();
      saveState(state);
      console.log(`  ${rec.domain}: ERROR — ${(e as Error).message}`);
    }
  }

  writeContactsCsv(state.records);
  console.log(`\n✓ Drafts are in your Gmail "Drafts" folder, ready to review and send.`);
}

export function status(): void {
  const state = loadState();
  if (state.records.length === 0) {
    console.log("No records yet. Run `enrich --input <your.csv>` to start.");
    return;
  }
  const counts: Record<string, number> = {};
  for (const r of state.records) counts[r.status] = (counts[r.status] ?? 0) + 1;
  console.log(`\n${state.records.length} domain(s) tracked:`);
  for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(16)} ${v}`);
  console.log(`\nSpreadsheet: ${relativeToRoot(CONTACTS_CSV)}`);
}
