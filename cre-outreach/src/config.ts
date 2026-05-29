import "dotenv/config";
import path from "node:path";

/**
 * Central config. We read from the environment lazily and validate per-command
 * (via `require*` helpers) so that, e.g., running `enrich` doesn't demand a
 * Gmail OAuth client and running `draft` doesn't demand a Hunter key.
 */

export const ROOT = process.cwd();
export const OUTPUT_DIR = path.join(ROOT, "output");
export const EMAILS_DIR = path.join(OUTPUT_DIR, "emails");
export const STATE_FILE = path.join(OUTPUT_DIR, "state.json");
export const CONTACTS_CSV = path.join(OUTPUT_DIR, "contacts.csv");
export const TOKEN_FILE = path.join(ROOT, "token.json");

function get(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v.trim() : undefined;
}

function num(name: string, fallback: number): number {
  const v = get(name);
  if (v === undefined) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export const config = {
  hunterApiKey: get("HUNTER_API_KEY"),

  anthropicApiKey: get("ANTHROPIC_API_KEY"),
  anthropicModel: get("ANTHROPIC_MODEL") ?? "claude-opus-4-8",
  anthropicEffort: (get("ANTHROPIC_EFFORT") ?? "medium") as
    | "low"
    | "medium"
    | "high"
    | "max",

  googleClientId: get("GOOGLE_CLIENT_ID"),
  googleClientSecret: get("GOOGLE_CLIENT_SECRET"),
  googleOauthPort: num("GOOGLE_OAUTH_PORT", 5555),

  // Hardcoded per request — name and phone always appear, regardless of .env.
  senderName: "Jatin Bottu",
  senderPhone: "470-991-9274",
  senderBackground:
    get("SENDER_BACKGROUND") ??
    "I'm a Georgia Tech student with prior hands-on experience applying AI in commercial real estate.",
  senderPitch:
    get("SENDER_PITCH") ??
    "I build AI tools for commercial real estate and would love to learn how your team works today.",
  senderCalendarLink: get("SENDER_CALENDAR_LINK"),
  senderSignature: get("SENDER_SIGNATURE"),

  targetRoleKeywords: (get("TARGET_ROLE_KEYWORDS") ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
  minConfidence: num("MIN_CONFIDENCE", 50),
};

export function requireHunter(): string {
  if (!config.hunterApiKey)
    throw new Error("HUNTER_API_KEY is not set. Add it to your .env file.");
  return config.hunterApiKey;
}

export function requireAnthropic(): string {
  if (!config.anthropicApiKey)
    throw new Error("ANTHROPIC_API_KEY is not set. Add it to your .env file.");
  return config.anthropicApiKey;
}

export function requireGoogle(): { clientId: string; clientSecret: string } {
  if (!config.googleClientId || !config.googleClientSecret)
    throw new Error(
      "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are not set. Add them to your .env file."
    );
  return {
    clientId: config.googleClientId,
    clientSecret: config.googleClientSecret,
  };
}

export function redirectUri(): string {
  return `http://localhost:${config.googleOauthPort}/oauth2callback`;
}
