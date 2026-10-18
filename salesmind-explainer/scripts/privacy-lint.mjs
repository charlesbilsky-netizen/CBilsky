// Privacy gate for the SalesMind training film. Fails on anything that is not
// visibly synthetic: emails outside example.com, phone numbers outside the
// fictional ranges, non-demo IDs, live URLs, internal domains, money that is
// not a multiple of EUR 250,000, and any term on the local blocklist.
//
// usage: node scripts/privacy-lint.mjs <file>...   (env BLOCKLIST=<path> for extra terms,
// one per line; the blocklist itself stays outside the repository)
import { readFileSync, existsSync } from "node:fs";

const files = process.argv.slice(2);
const blocklist = process.env.BLOCKLIST && existsSync(process.env.BLOCKLIST)
  ? readFileSync(process.env.BLOCKLIST, "utf8").split("\n").map((s) => s.trim()).filter(Boolean)
  : [];

const rules = [
  ["email outside example.com", /[\w.+-]+@([\w-]+\.)+[a-z]{2,}/gi, (m) => !/@([\w-]+\.)*example\.com$/i.test(m)],
  ["phone outside fictional ranges", /\+\d[\d ()-]{7,}\d/g,
    (m) => !/^\+1 202 555 01\d\d$/.test(m) && !/^\+44 20 7946 0\d\d\d$/.test(m)],
  ["CRM id not CRM-DEMO-###", /\bCRM-[A-Z0-9-]+/g, (m) => !/^CRM-DEMO-\d{3}$/.test(m)],
  ["application id not APP-DEMO-###", /\bAPP-[A-Z0-9-]+/g, (m) => !/^APP-DEMO-\d{3}$/.test(m)],
  ["ticket key not TRAIN-###", /\b[A-Z][A-Z0-9]{1,9}-\d{1,6}\b/g,
    (m) => !/^(TRAIN-\d{3}|CRM-DEMO-\d{3}|APP-DEMO-\d{3}|UTF-8)$/.test(m) && !/^DEMO-\d{3}$/.test(m)],
  ["live URL", /\bhttps?:\/\/\S+/gi, () => true],
  ["internal domain", /\b[\w.-]*exante\.(eu|com)\b/gi, () => true],
  ["workspace path", /\/rm\/[a-z]{2,4}\b/gi, () => true],
  ["money not a multiple of EUR 250,000", /EUR\s?([\d,]+)/g,
    (m) => { const n = Number(m.replace(/[^\d]/g, "")); return n !== 0 && n % 250000 !== 0; }],
];

let failures = 0;
for (const f of files) {
  let text = readFileSync(f, "utf8");
  // The _meta block describes the rules themselves; it is never rendered.
  if (f.endsWith(".json")) { const o = JSON.parse(text); delete o._meta; text = JSON.stringify(o, null, 1); }
  // Money stored as plain numbers in JSON is checked by key name.
  const extra = [];
  if (f.endsWith(".json")) {
    const walk = (o, path) => {
      if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) walk(v, `${path}.${k}`);
      else if (typeof o === "number" && /\.(expected_deposit|potential_aum|liquid_nav|total_nav|target|remaining|goal|value)$/.test(path) && o % 250000 !== 0)
        extra.push(`money not a multiple of EUR 250,000: ${path} = ${o}`);
    };
    walk(JSON.parse(text), "");
  }
  const hits = [...extra];
  for (const [name, re, bad] of rules) for (const m of text.match(re) ?? []) if (bad(m)) hits.push(`${name}: ${m}`);
  for (const term of blocklist) if (text.toLowerCase().includes(term.toLowerCase())) hits.push(`blocklisted term: ${term.slice(0, 2)}…`);
  if (hits.length) { failures += hits.length; console.log(`FAIL ${f}`); for (const h of [...new Set(hits)]) console.log(`  ${h}`); }
  else console.log(`PASS ${f}`);
}
process.exit(failures ? 1 : 0);
