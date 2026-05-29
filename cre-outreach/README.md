# cre-outreach

A small command-line pipeline for cold outreach to **commercial real estate / multifamily** companies. Give it a spreadsheet of domains and it will:

1. **Find the best contact** at each company via the [Hunter.io](https://hunter.io) Domain Search API (scored by seniority, CRE-relevant title, department, and confidence — the single best person is revealed, runners-up are logged).
2. **Update a spreadsheet** (`output/contacts.csv`) with the chosen name, title, and email.
3. **Write a personalized cold email** for each contact using Claude (`claude-opus-4-8`), following 2025 reply-rate best practices and weaving in your background (e.g. *Georgia Tech student with prior AI-in-real-estate experience*).
4. **Stage Gmail drafts** ready for you to review and send.

Each step writes editable artifacts, so you stay in control: review the spreadsheet, hand-edit any email, then push to drafts.

## Setup

```bash
cd cre-outreach
npm install
cp .env.example .env      # then fill in the values
```

Fill in `.env`:

- **`HUNTER_API_KEY`** — from <https://hunter.io/api-keys>.
- **`ANTHROPIC_API_KEY`** — from <https://console.anthropic.com/settings/keys>.
- **Google OAuth** — in [Google Cloud Console](https://console.cloud.google.com/): enable the **Gmail API**, create an **OAuth client ID** (type *Desktop app* is simplest), and add `http://localhost:5555/oauth2callback` as an authorized redirect URI. Put the client ID/secret in `.env`.
- **`SENDER_*`** — your name, background, and especially **`SENDER_PITCH`** (what you're reaching out about). This drives the personalization and matters most for reply rate.

## Usage

```bash
# 0) One-time: authorize Gmail (opens a consent URL, captures the redirect locally)
npm run auth

# 1) Find contacts for your domains and update the spreadsheet
npm run enrich -- --input data/domains.sample.csv

# 2) Write a personalized email per contact
npm run generate

#    → review output/contacts.csv, hand-edit any file in output/emails/*.md

# 3) Create Gmail drafts (re-reads your edits)
npm run draft

# …or do all three at once:
npm run run -- --input data/domains.sample.csv

# progress at any time:
npm run status
```

Tip: add `--limit 2` to any command for a cheap test run, and `--force` to redo a step.

## Input format

A CSV with a `domain` column (and optional `company`). Column naming is flexible — `website`/`url` also work:

```csv
domain,company
greystar.com,Greystar
hines.com,Hines
```

## Outputs

- `output/contacts.csv` — the enriched spreadsheet (best contact per domain + alternates + status).
- `output/emails/<domain>.md` — one editable email per contact (front-matter `to:` + `Subject:` + body). Edit these before `draft`.
- `output/state.json` — the pipeline's source of truth (safe to delete to start over).
- Gmail **Drafts** — created in the authorized account, never auto-sent.

## How the "best contact" is chosen

`src/scoring.ts` scores every Hunter result: **+40** executive / **+22** senior seniority, **+28** for a CRE-relevant title (acquisitions, principal, partner, owner, asset management, president/CEO/founder, VP, development…), department signal, a scaled slice of Hunter's confidence, **+10** personal mailbox / **−35** generic role mailbox (`info@`, `sales@`…), and **+8** for a real first name. Tune via `TARGET_ROLE_KEYWORDS` and `MIN_CONFIDENCE` in `.env`.

## Notes

- Nothing is ever sent automatically — the final artifact is a **draft**.
- Hunter Domain Search is rate-limited (~15 req/s); the pipeline checkpoints after every domain, so it's safe to stop and resume.
- `.env`, `token.json`, and `output/` are git-ignored.
