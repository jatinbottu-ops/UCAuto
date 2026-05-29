import { requireHunterKeys } from "./config.js";
import { KeyPool, withRotation, type FailureKind } from "./keypool.js";
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

// Error tagged so the rotation helper knows to fail over to the next key.
class RotateError extends Error {}

// One shared pool for the whole run, so exhausted free keys are skipped.
let pool: KeyPool | undefined;
function hunterPool(): KeyPool {
  if (!pool) pool = new KeyPool("Hunter.io", requireHunterKeys());
  return pool;
}

const classify = (err: unknown): FailureKind =>
  err instanceof RotateError ? "rotate" : "fatal";

/**
 * Query Hunter.io's Domain Search for a domain, scoring + sorting every email.
 * Pools multiple API keys: if a key is invalid, rate-limited, or out of its
 * free monthly credits, it's dropped and the next key is used automatically.
 *
 * Docs: https://hunter.io/api-documentation#domain-search
 */
export async function searchDomain(domain: string): Promise<HunterResult> {
  return withRotation(
    hunterPool(),
    async (apiKey) => {
      const url = new URL(ENDPOINT);
      url.searchParams.set("domain", domain);
      url.searchParams.set("api_key", apiKey);
      url.searchParams.set("limit", "25");

      let res: Response;
      try {
        res = await fetch(url, { headers: { Accept: "application/json" } });
      } catch (e) {
        // Network blip — try another key rather than failing the domain.
        throw new RotateError(`network error: ${(e as Error).message}`);
      }

      const json = (await res.json().catch(() => ({}))) as any;

      if (!res.ok) {
        const detail =
          json?.errors?.map((e: any) => e.details || e.id).join("; ") ||
          `HTTP ${res.status}`;
        // 401 invalid key, 402 payment required, 403 forbidden, 429 rate/usage
        // limit, or any 5xx => this key is unusable right now, rotate.
        if ([401, 402, 403, 429].includes(res.status) || res.status >= 500) {
          throw new RotateError(detail);
        }
        // e.g. 400 bad domain — rotating won't help; fail just this domain.
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
    },
    classify
  );
}
