import Anthropic from "@anthropic-ai/sdk";
import { config, requireAnthropicKeys } from "./config.js";
import { KeyPool, withRotation, type FailureKind } from "./keypool.js";
import type { GeneratedEmail, OutreachRecord } from "./types.js";

// Pool of Anthropic keys, shared for the run. One client cached per key.
let pool: KeyPool | undefined;
const clients = new Map<string, Anthropic>();

function anthropicPool(): KeyPool {
  if (!pool) pool = new KeyPool("Anthropic", requireAnthropicKeys());
  return pool;
}

function clientFor(key: string): Anthropic {
  let c = clients.get(key);
  if (!c) {
    c = new Anthropic({ apiKey: key });
    clients.set(key, c);
  }
  return c;
}

// Rotate to the next key on auth/permission/rate-limit/quota problems; any other
// error (e.g. a malformed response we can't parse) is fatal for this record.
const classify = (err: unknown): FailureKind => {
  if (
    err instanceof Anthropic.AuthenticationError || // 401 bad key
    err instanceof Anthropic.PermissionDeniedError || // 403 (incl. billing)
    err instanceof Anthropic.RateLimitError // 429 rate/credit limit
  )
    return "rotate";
  if (err instanceof Anthropic.APIError && err.status === 402) return "rotate";
  return "fatal";
};

/**
 * Best-practice rules for cold outreach, distilled from 2025 reply-rate
 * research (subject length, timeline-hook framing, text-message tone, value
 * before ask). This is the stable system prompt — reused across every contact,
 * so we mark it for prompt caching.
 */
const SYSTEM_PROMPT = `You are an expert cold-email copywriter for B2B outreach to commercial real estate and multifamily companies. You write emails that get replies.

Follow these evidence-based rules (2025 reply-rate research):
- SUBJECT: 2-4 words, under 50 characters, lowercase or sentence case, specific to the company. A short question often works well. No clickbait, no ALL CAPS, no emojis, no "Re:" tricks.
- LENGTH: 50-110 words in the body. It should read like a short, natural text message from one person to another — not a marketing blast.
- OPENING: one personalized line that references the recipient's company or role specifically. Never "I hope this email finds you well" or "My name is...".
- HOOK: prefer a forward-looking / timeline framing ("as you head into next year...", "with rates where they are...") over a generic pain-point pitch.
- VALUE BEFORE ASK: give a relevant insight or offer something useful before asking for anything.
- CREDIBILITY: weave in the sender's background naturally and briefly — do not brag or list credentials.
- CTA: the call-to-action must be exactly this line, verbatim, as the last sentence before the sign-off: "Worth a quick 10 minute call sometime this week?" Do not reword it, and use no other CTA.
- TONE: warm, direct, human, confident-but-humble. Contractions are good. No corporate filler, no buzzword soup, no exclamation overload.
- FORMATTING: plain text. 2-4 short paragraphs. No markdown, no bullet lists, no links unless a calendar link is provided. Sign off with the sender's name (a signature is appended separately, so end the body at the sign-off line like "Best,\\n<First Name>").
- NEVER fabricate facts about the recipient's company, deals, or numbers. Keep claims general unless given specifics.

Return only the subject and body.`;

const SCHEMA = {
  type: "object",
  properties: {
    subject: {
      type: "string",
      description: "2-4 words, under 50 characters.",
    },
    body: {
      type: "string",
      description:
        "50-110 word plain-text email body ending at the sign-off (e.g. 'Best,\\nJatin'). No signature block.",
    },
  },
  required: ["subject", "body"],
  additionalProperties: false,
} as const;

function buildUserPrompt(rec: OutreachRecord): string {
  const c = rec.contact!;
  const firstName = c.firstName ?? "there";
  const company = rec.company ?? rec.domain;
  const senderFirst = config.senderName.split(/\s+/)[0];

  const lines = [
    "Write a personalized cold outreach email.",
    "",
    "RECIPIENT:",
    `- Name: ${[c.firstName, c.lastName].filter(Boolean).join(" ") || "Unknown"}`,
    `- First name for greeting: ${firstName}`,
    `- Title: ${c.position ?? "Unknown"}`,
    `- Company: ${company}`,
    `- Industry: commercial real estate / multifamily`,
    "",
    "SENDER:",
    `- Name: ${config.senderName} (sign off as "${senderFirst}")`,
    `- Phone (appears in the signature): ${config.senderPhone}`,
    `- Background to weave in: ${config.senderBackground}`,
    `- What the email is about (the value/offer): ${config.senderPitch}`,
    `- REQUIRED call-to-action (verbatim, as the last line before the sign-off): "Worth a quick 10 minute call sometime this week?"`,
  ];
  if (config.senderCalendarLink) {
    lines.push(`- Optional scheduling link for the CTA: ${config.senderCalendarLink}`);
  }
  return lines.join("\n");
}

/**
 * Generate one personalized cold email for a record that has a contact.
 * Pools multiple Anthropic keys: rotates to the next key on auth/rate/quota
 * failures so several users' AI credits combine into one shared budget.
 */
export async function writeEmail(rec: OutreachRecord): Promise<GeneratedEmail> {
  if (!rec.contact) throw new Error(`No contact to write for ${rec.domain}`);

  return withRotation(
    anthropicPool(),
    async (key) => {
      const res = await clientFor(key).messages.create({
        model: config.anthropicModel,
        max_tokens: 6000,
        thinking: { type: "adaptive" },
        output_config: {
          effort: config.anthropicEffort,
          format: { type: "json_schema", schema: SCHEMA },
        },
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [{ role: "user", content: buildUserPrompt(rec) }],
      } as Anthropic.MessageCreateParamsNonStreaming);

      const textBlock = res.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text")
        throw new Error(`No text output from model for ${rec.domain}`);

      let parsed: GeneratedEmail;
      try {
        parsed = JSON.parse(textBlock.text) as GeneratedEmail;
      } catch {
        throw new Error(
          `Model output for ${rec.domain} was not valid JSON:\n${textBlock.text.slice(0, 400)}`
        );
      }
      if (!parsed.subject || !parsed.body)
        throw new Error(`Model output for ${rec.domain} missing subject/body.`);

      return { subject: parsed.subject.trim(), body: parsed.body.trim() };
    },
    classify
  );
}
