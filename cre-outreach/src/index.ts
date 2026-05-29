import path from "node:path";
import { ROOT } from "./config.js";
import { draft, enrich, generate, status } from "./pipeline.js";
import { runAuthFlow } from "./gmail.js";

interface Args {
  command: string;
  input: string;
  limit?: number;
  force: boolean;
}

function parseArgs(argv: string[]): Args {
  const [command = "help", ...rest] = argv;
  const args: Args = {
    command,
    input: path.join(ROOT, "data", "domains.csv"),
    force: false,
  };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--input" || a === "-i") args.input = path.resolve(rest[++i]);
    else if (a === "--limit" || a === "-l") args.limit = Number(rest[++i]);
    else if (a === "--force" || a === "-f") args.force = true;
  }
  return args;
}

const HELP = `
cre-outreach — find CRE/multifamily contacts, write cold emails, stage Gmail drafts.

Usage:
  npm run auth                          One-time Gmail authorization.
  npm run enrich -- --input <file.csv>  Hunter.io lookup -> best contact -> output/contacts.csv
  npm run generate                      Write a personalized email per contact (Claude).
  npm run draft                         Create Gmail drafts from the email files.
  npm run run -- --input <file.csv>     enrich + generate + draft in one go.
  npm run status                        Show pipeline progress.

Flags:
  --input, -i <file>   Input CSV of domains (default: data/domains.csv).
  --limit, -l <n>      Only process the first n records (great for a test run).
  --force, -f          Re-run a step even if already done (re-query / rewrite / re-draft).
`;

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  switch (args.command) {
    case "auth":
      await runAuthFlow();
      break;
    case "enrich":
      await enrich({ input: args.input, limit: args.limit, force: args.force });
      break;
    case "generate":
      await generate({ limit: args.limit, force: args.force });
      break;
    case "draft":
      await draft({ limit: args.limit, force: args.force });
      break;
    case "run":
      await enrich({ input: args.input, limit: args.limit, force: args.force });
      await generate({ limit: args.limit, force: args.force });
      await draft({ limit: args.limit, force: args.force });
      break;
    case "status":
      status();
      break;
    default:
      console.log(HELP);
  }
}

main().catch((e) => {
  console.error(`\nError: ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
});
