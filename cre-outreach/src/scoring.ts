import { config } from "./config.js";
import type { Contact } from "./types.js";

/**
 * Title keywords that signal a decision-maker we'd want to reach in
 * multifamily / commercial real estate, ordered loosely by relevance.
 */
const ROLE_KEYWORDS = [
  "acquisition",
  "investment",
  "asset management",
  "asset manager",
  "principal",
  "managing partner",
  "managing director",
  "partner",
  "owner",
  "founder",
  "president",
  "chief executive",
  "ceo",
  "coo",
  "cio",
  "cfo",
  "vice president",
  "vp ",
  "development",
  "portfolio",
  "real estate",
  "leasing",
  "operations",
];

const GENERIC_LOCALPARTS = [
  "info",
  "contact",
  "hello",
  "sales",
  "support",
  "admin",
  "office",
  "leasing",
  "marketing",
  "careers",
  "jobs",
  "press",
  "media",
];

/**
 * Score a contact for outreach relevance. Higher is better. The breakdown is
 * recorded in `scoreReasons` so the spreadsheet/logs explain each pick.
 */
export function scoreContact(c: Omit<Contact, "score" | "scoreReasons">): {
  score: number;
  reasons: string[];
} {
  let score = 0;
  const reasons: string[] = [];

  // Seniority.
  const seniority = (c.seniority ?? "").toLowerCase();
  if (seniority === "executive") {
    score += 40;
    reasons.push("+40 executive seniority");
  } else if (seniority === "senior") {
    score += 22;
    reasons.push("+22 senior seniority");
  } else if (seniority === "junior") {
    score += 5;
    reasons.push("+5 junior seniority");
  }

  // Title relevance to CRE / multifamily.
  const position = (c.position ?? "").toLowerCase();
  const keywords = [...ROLE_KEYWORDS, ...config.targetRoleKeywords];
  const matched = keywords.find((k) => position.includes(k));
  if (matched) {
    score += 28;
    reasons.push(`+28 relevant title ("${matched.trim()}")`);
  }

  // Department signal.
  const dept = (c.department ?? "").toLowerCase();
  if (["executive", "management"].includes(dept)) {
    score += 15;
    reasons.push(`+15 ${dept} department`);
  } else if (["finance", "real_estate", "operations"].includes(dept)) {
    score += 8;
    reasons.push(`+8 ${dept} department`);
  }

  // Confidence (Hunter's validity estimate), scaled.
  const conf = Math.round(c.confidence * 0.3);
  score += conf;
  reasons.push(`+${conf} confidence (${c.confidence}/100)`);

  // Prefer a named individual over a role mailbox.
  const localpart = c.email.split("@")[0].toLowerCase();
  const isGeneric =
    c.type === "generic" || GENERIC_LOCALPARTS.includes(localpart);
  if (isGeneric) {
    score -= 35;
    reasons.push("-35 generic/role mailbox");
  } else {
    score += 10;
    reasons.push("+10 personal mailbox");
  }

  // A real name we can greet by.
  if (c.firstName) {
    score += 8;
    reasons.push("+8 has first name");
  }

  return { score, reasons };
}
