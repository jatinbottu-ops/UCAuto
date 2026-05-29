import { requireHunter } from "./config.js";
import { scoreContact } from "./scoring.js";
import type { Contact } from "./types.js";

const ENDPOINT = "https://api.hunter.io/v2/domain-search";

interface HunterEmail {
  value: string;
  type: string | null;
  confidence: number | null;
  first_name: string | null;
  last_name: string | null;
  position: string | null;
  seniority: string | null;
  department: string | null;
}

export interface HunterResult {
  organization: string | null;
  /** All candidates, scored and sorted best-first. */
  contacts: Contact[];
}

/**
 * Query Hunter.io's Domain Search for a domain, then score + sort every email
 * it returns. Asks for up to 25 contacts so the scorer has a real pool to pick
 * the most relevant person from.
 *
 * Docs: https://hunter.io/api-documentation#domain-search
 */
export async function searchDomain(domain: string): Promise<HunterResult> {
  const apiKey = requireHunter();
  const url = new URL(ENDPOINT);
  url.searchParams.set("domain", domain);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("limit", "25");

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const json = (await res.json()) as any;

  if (!res.ok) {
    const detail =
      json?.errors?.map((e: any) => e.details).join("; ") ??
      `HTTP ${res.status}`;
    throw new Error(`Hunter.io error for ${domain}: ${detail}`);
  }

  const data = json?.data ?? {};
  const emails: HunterEmail[] = data.emails ?? [];

  const contacts: Contact[] = emails
    .filter((e) => e.value)
    .map((e) => {
      const base = {
        email: e.value.toLowerCase(),
        firstName: e.first_name,
        lastName: e.last_name,
        position: e.position,
        seniority: e.seniority,
        department: e.department,
        confidence: e.confidence ?? 0,
        type: e.type,
      };
      const { score, reasons } = scoreContact(base);
      return { ...base, score, scoreReasons: reasons };
    })
    .sort((a, b) => b.score - a.score);

  return { organization: data.organization ?? null, contacts };
}
