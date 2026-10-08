import raw from "../data/synthetic-data.json";

// Typed view over data/synthetic-data.json: the only source of on-screen records.
export const D = raw;
export type Person = (typeof raw.people)[number];
export type Deal = (typeof raw.deals)[number];

export const person = (id: string) => raw.people.find((p) => p.id === id)!;
export const company = (id: string | null) => (id ? raw.companies.find((c) => c.id === id)! : null);
export const clientName = (personId: string) => {
  const p = person(personId);
  const co = company(p.company);
  return co ? co.name : p.name;
};
export const deals = raw.deals.map((d) => ({ ...d, p: person(d.person), co: company(person(d.person).company) }));

// Dashboard "Open deals" order: critical alerts → overdue next actions → no
// next action → past the stage's time limit → blocked → other alerts.
const critical = ["SLA breach", "Stopped responding to onboarding", "Funding not arriving", "Qualification missing"];
const limits: Record<string, number> = { "Contact Established": 2, Qualified: 5, "Solution Presented": 5, Onboarding: 7, "Funding Pending": 3 };
export const urgencyRank = (d: (typeof deals)[number]) => {
  if (d.alert && critical.includes(d.alert)) return 0;
  if (d.next_action?.due === "Overdue" || d.alert === "Action overdue") return 1;
  if (!d.next_action) return 2;
  const lim = limits[d.stage];
  if (lim != null && "days_in_stage" in d && (d as { days_in_stage?: number }).days_in_stage! > lim) return 3;
  if (d.blocker) return 4;
  if (d.alert) return 5;
  return 6;
};
export const openDealsSorted = [...deals].sort((a, b) => urgencyRank(a) - urgencyRank(b));
