import fs from "node:fs";
import http from "node:http";
import { URL } from "node:url";
import { google } from "googleapis";
import type { OAuth2Client } from "google-auth-library";
import MailComposer from "nodemailer/lib/mail-composer/index.js";
import { config, redirectUri, requireGoogle, TOKEN_FILE } from "./config.js";

const SCOPES = ["https://www.googleapis.com/auth/gmail.compose"];

function oauthClient(): OAuth2Client {
  const { clientId, clientSecret } = requireGoogle();
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri());
}

function hasToken(): boolean {
  return fs.existsSync(TOKEN_FILE);
}

/** Build an authorized client from the saved token (run `auth` first). */
function authorizedClient(): OAuth2Client {
  if (!hasToken())
    throw new Error(
      "No Gmail token found. Run `npm run auth` once to authorize Gmail."
    );
  const client = oauthClient();
  client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8")));
  return client;
}

/**
 * One-time interactive OAuth: opens a consent URL, runs a tiny localhost server
 * to capture the redirect, exchanges the code, and persists the token.
 */
export async function runAuthFlow(): Promise<void> {
  const client = oauthClient();
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  console.log("\nOpen this URL in your browser to authorize Gmail access:\n");
  console.log(authUrl + "\n");

  const code = await waitForCode();
  const { tokens } = await client.getToken(code);
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2), "utf8");
  console.log(`\n✓ Gmail authorized. Token saved to ${TOKEN_FILE}`);
}

function waitForCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const url = new URL(req.url ?? "", redirectUri());
        if (url.pathname !== "/oauth2callback") {
          res.writeHead(404).end();
          return;
        }
        const code = url.searchParams.get("code");
        const err = url.searchParams.get("error");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          `<html><body style="font-family:sans-serif"><h2>${
            code ? "Authorized — you can close this tab." : "Authorization failed."
          }</h2></body></html>`
        );
        server.close();
        if (code) resolve(code);
        else reject(new Error(err ?? "No authorization code received."));
      } catch (e) {
        reject(e as Error);
      }
    });
    server.listen(config.googleOauthPort, () => {
      console.log(
        `Waiting for the OAuth redirect on ${redirectUri()} ...\n(If your browser didn't open the page, paste the URL above.)`
      );
    });
    server.on("error", reject);
  });
}

let _fromAddress: string | undefined;
async function fromHeader(gmail: ReturnType<typeof google.gmail>): Promise<string> {
  if (!_fromAddress) {
    const profile = await gmail.users.getProfile({ userId: "me" });
    _fromAddress = profile.data.emailAddress ?? "me";
  }
  return `${config.senderName} <${_fromAddress}>`;
}

function signature(): string {
  // Name + phone are hardcoded and always present in the signature.
  return `${config.senderName}\n${config.senderPhone}`;
}

/** Compose RFC-2822 MIME and create a Gmail draft. Returns the draft id. */
export async function createDraft(opts: {
  to: string;
  subject: string;
  body: string;
}): Promise<string> {
  const auth = authorizedClient();
  const gmail = google.gmail({ version: "v1", auth });

  const fullBody = `${opts.body.trim()}\n\n${signature()}\n`;
  const mail = new MailComposer({
    from: await fromHeader(gmail),
    to: opts.to,
    subject: opts.subject,
    text: fullBody,
  });

  const message = await new Promise<Buffer>((resolve, reject) => {
    mail.compile().build((err: Error | null, msg: Buffer) => {
      if (err) reject(err);
      else resolve(msg);
    });
  });

  const raw = message
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.drafts.create({
    userId: "me",
    requestBody: { message: { raw } },
  });

  return res.data.id ?? "";
}

export { hasToken };
