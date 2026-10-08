import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AppShell } from "../ui/AppShell";
import { Button, Chip, Demo, Label, Panel, Table, Tabs } from "../ui/primitives";
import { C, eur, fontFamily } from "../theme";
import { D } from "../data";
import { prog, reveal, stagger } from "../ui/anim";

// S29 · Performance: six sections, period filter, abstract charts. Figures are
// round training values or none at all.
export const Performance: React.FC<{ start?: number; tab?: number }> = ({ start = 0, tab = 0 }) => {
  const f = useCurrentFrame() - start;
  const bars = [3, 4, 4, 5, 6, 7];
  return (
    <AppShell page="Performance" title="Performance">
      <div style={{ fontFamily, display: "flex", flexDirection: "column", gap: 18, height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tabs items={["NAV milestones", "Pipeline", "Funding", "Standing", "Conversion", "Communication"]} active={tab} style={{ flex: 1 }} />
          <Chip style={{ marginLeft: 16 }}>Analytics period: This month ▾</Chip>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <Panel style={{ flex: 1, padding: 24, ...reveal(stagger(f, 0, 4, 3)) }}>
            <Label>Active Milestone</Label>
            <div style={{ fontSize: 30, fontWeight: 600, color: C.off, marginTop: 10 }}>{eur(500000)} of {eur(1000000)}</div>
            <div style={{ fontSize: 16, color: C.muted, marginTop: 6 }}>Training milestone · checked Day 5 (Fri)</div>
          </Panel>
          <Panel style={{ flex: 1, padding: 24, ...reveal(stagger(f, 1, 4, 3)) }}>
            <Label>Last Cleared Milestone</Label>
            <div style={{ fontSize: 30, fontWeight: 600, color: C.bright, marginTop: 10 }}>Completed</div>
            <div style={{ fontSize: 16, color: C.muted, marginTop: 6 }}>Synthetic</div>
          </Panel>
        </div>
        <Panel style={{ padding: 24, flex: 1, ...reveal(stagger(f, 2, 4, 3)) }}>
          <Label>Milestones by tenure</Label>
          <div style={{ display: "flex", gap: 18, marginTop: 18, alignItems: "flex-end", height: 260 }}>
            {["Month 3 · own liquid NAV", "Month 6 · total liquid NAV", "Month 12", "Month 24", "Month 36"].map((m, i) => (
              <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ width: "70%", height: 40 + i * 44 * prog(f, 10 + i * 3, 18), borderRadius: 8, background: i === 0 ? C.bright : `rgba(38,191,107,${0.5 - i * 0.07})` }} />
                <div style={{ fontSize: 15, color: C.text, textAlign: "center" }}>{m}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 22, alignItems: "flex-end", height: 60 }}>
            {bars.map((b, i) => (
              <div key={i} style={{ flex: 1, height: b * 8 * prog(f, 20 + i * 2, 14), background: "rgba(255,255,255,0.08)", borderRadius: 4 }} />
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
};

// S30 · Sales plan tab.
export const SalesPlan: React.FC<{ start?: number; hi?: string | null }> = ({ start = 0, hi = null }) => {
  const f = useCurrentFrame() - start;
  const ring = (k: string) => (hi === k ? { boxShadow: `0 0 0 2px ${C.bright}`, borderRadius: 10 } : {});
  const cols = [
    { key: "client", label: "Client", w: 360 },
    { key: "type", label: "Type", w: 140 },
    { key: "prob", label: "Probability", w: 140 },
    { key: "crm", label: "CRM Link", w: 200 },
    { key: "na", label: "N/A Reason", w: 560 },
  ];
  const rows = D.sales_plan.map((e) => ({
    client: (
      <span>
        {e.client}
        {e.type === "Corporate" ? <Demo /> : null}
      </span>
    ),
    type: e.type,
    prob: e.probability,
    crm: e.crm_link ?? <span style={{ color: C.faint }}>—</span>,
    na: e.na_reason ?? <span style={{ color: C.faint }}>—</span>,
  }));
  const panels: [string, string][] = [
    ["Plan summary", "Total Entries 3 · Est. Total AUM · Total NAV Target"],
    ["Sales Plan Progress", "Client funnel · NAV progress · activity"],
    ["Entries Requiring Attention", "1 entry"],
    ["Forecasted NAV", "Synthetic"],
    ["Plan vs reality · month 1", "Synthetic"],
    ["Plan history", "Revision 1 · Day 1 · Alex Morgan"],
  ];
  return (
    <AppShell page="Pipeline" title="Pipeline">
      <div style={{ fontFamily, display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tabs items={["New Business", "Client Growth", "Sales plan"]} active={2} style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 10, marginLeft: 16 }}>
            <Button primary style={ring("add")}>+ Add entry</Button>
            <Button style={ring("create")}>Create Contact</Button>
            <Button style={ring("link")}>Link CRM</Button>
            <Button style={ring("na")}>Not Available</Button>
          </div>
        </div>
        <Panel style={{ padding: 18, ...reveal(prog(f, 0, 12)) }}>
          <Label>Strategy</Label>
          <div style={{ fontSize: 16, color: C.text, marginTop: 8 }}>Synthetic: tier 1, training firms ready to fund this month; tier 2, demo family offices for next quarter.</div>
        </Panel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {panels.map(([t, s], i) => (
            <Panel key={t} style={{ padding: 16, ...reveal(stagger(f, i, 4, 2)), ...(hi === "panels" ? { borderColor: C.bright } : {}) }}>
              <Label>{t}</Label>
              <div style={{ fontSize: 15, color: C.muted, marginTop: 6 }}>{s}</div>
            </Panel>
          ))}
        </div>
        <Panel style={{ overflow: "hidden", ...reveal(prog(f, 10, 12)) }}>
          <div style={{ padding: "12px 20px 0" }}>
            <Label>Sales Plan Entries</Label>
          </div>
          <Table cols={cols} rows={rows} rowH={60} reveal={(i) => reveal(stagger(f, i, 14, 3))} />
        </Panel>
      </div>
    </AppShell>
  );
};

// S31 · Simulated Google permission screen. Generic: no logo, no real UI copy.
export const GooglePermission: React.FC<{ start?: number; step?: number }> = ({ start = 0, step = 0 }) => {
  const f = useCurrentFrame() - start;
  const steps = ["Connect", "Pick your work account", "Continue", "Select all", "Continue"];
  return (
    <AbsoluteFill style={{ background: "#0F1416", alignItems: "center", justifyContent: "center", fontFamily }}>
      <Panel style={{ width: 760, padding: 40, display: "flex", flexDirection: "column", gap: 20, ...reveal(prog(f, 0, 14)) }}>
        <Label color={C.gold}>Simulated permissions screen · no live connection</Label>
        <div style={{ fontSize: 28, fontWeight: 600, color: C.off }}>Connect Google</div>
        <div style={{ fontSize: 17, color: C.muted, lineHeight: 1.5 }}>SalesMind asks for three scopes:</div>
        {[
          ["Calendar", "show your real day and write task blocks"],
          ["Gmail, read and modify", "starred messages only"],
          ["Contacts", "autocomplete guests"],
        ].map(([k, v], i) => (
          <div key={k} style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 18, ...reveal(stagger(f, i, 8, 4)) }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: step >= 3 ? C.bright : "transparent", border: `2px solid ${C.bright}` }} />
            <span style={{ color: C.off, width: 260 }}>{k}</span>
            <span style={{ color: C.muted, fontSize: 16 }}>{v}</span>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
          {steps.map((s, i) => (
            <Chip key={i} active={i === step} style={{ opacity: i <= step ? 1 : 0.45 }}>
              {i + 1}. {s}
            </Chip>
          ))}
        </div>
      </Panel>
    </AbsoluteFill>
  );
};

// S33 · Guidebook index.
const GUIDE: [string, string[]][] = [
  ["Getting started", ["The new pipeline in one minute", "Your first week and routine"]],
  ["1 · The pipeline board", ["Find your way around the Pipeline", "Know each stage", "Read a deal card and its alerts", "Find the deals that need you today", "Contact new leads on time", "Win back clients going quiet"]],
  ["2 · Working a deal", ["Use the deal page", "Work the next action", "Move a deal", "Keep About this deal, notes and blockers current", "Put a deal on hold or close it"]],
  ["3 · Client Growth, new deals and housekeeping", ["Grow funded clients and create deals", "Clean up duplicates and use your sales plan"]],
  ["Task management", ["Plan your day in Task management"]],
  ["Reference", ["Cheat sheet", "Glossary", "Questions and answers"]],
];
export const Guidebook: React.FC<{ start?: number }> = ({ start = 0 }) => {
  const f = useCurrentFrame() - start;
  return (
    <AppShell page="Guidebook" title="Guidebook">
      <div style={{ fontFamily, columns: 2, columnGap: 40 }}>
        <div style={{ fontSize: 30, fontWeight: 600, color: C.off, marginBottom: 6 }}>How to work your deals in SalesMind</div>
        <div style={{ fontSize: 16, color: C.muted, marginBottom: 20 }}>A practical guide to the deal framework and the RM Workspace.</div>
        {GUIDE.map(([g, items], gi) => (
          <div key={g} style={{ breakInside: "avoid", marginBottom: 18, ...reveal(stagger(f, gi, 4, 3)) }}>
            <Label color={C.bright}>{g}</Label>
            {items.map((it) => (
              <div key={it} style={{ fontSize: 18, color: C.text, padding: "7px 0", borderBottom: `1px solid ${C.line}` }}>
                {it}
              </div>
            ))}
          </div>
        ))}
      </div>
    </AppShell>
  );
};

// S34 · Sales materials: eleven card titles, no links.
const MATERIALS = [
  "Jira ticket Links",
  "EXANTE Help Center — Article Index",
  "Sales Plan",
  "EXANTE — Registrant-to-Client Conversion Funnel",
  "SalesMind Booklet",
  "Objection Handling playbook",
  "FAQ by RMs",
  "Relationship Manager Daily Power Schedule",
  "Ultra-High Net Worth Battle Card",
  "Brokerage Firm Battle Card",
  "Asset Managers Battle Card",
];
export const Materials: React.FC<{ start?: number }> = ({ start = 0 }) => {
  const f = useCurrentFrame() - start;
  return (
    <AppShell page="Sales materials" title="Sales materials">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, fontFamily }}>
        {MATERIALS.map((m, i) => (
          <Panel key={m} style={{ padding: 18, minHeight: 150, display: "flex", flexDirection: "column", gap: 10, ...reveal(stagger(f, i, 4, 2)) }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.off, lineHeight: 1.3 }}>{m}</div>
            <div style={{ marginTop: "auto", fontSize: 15, color: C.bright, fontWeight: 600 }}>Open link →</div>
          </Panel>
        ))}
      </div>
    </AppShell>
  );
};

// S35 · Changelog.
export const Changelog: React.FC<{ start?: number }> = ({ start = 0 }) => {
  const f = useCurrentFrame() - start;
  return (
    <AppShell page="Changelog" title="Changelog">
      <Panel style={{ padding: 32, width: 1100, fontFamily, ...reveal(prog(f, 0, 14)) }}>
        <Label color={C.bright}>v0.6.1</Label>
        <div style={{ fontSize: 32, fontWeight: 600, color: C.off, marginTop: 10 }}>The new RM Workspace</div>
        <div style={{ fontSize: 20, color: C.muted, marginTop: 8 }}>Your book, your pipeline and your day in one place.</div>
        <div style={{ fontSize: 18, color: C.text, marginTop: 20, lineHeight: 1.6 }}>
          Workspace · Book · Results · Support. Check Ownership lives on the Clients page.
        </div>
      </Panel>
    </AppShell>
  );
};

// S36 · Internal requests.
export const Requests: React.FC<{ start?: number; tab?: number }> = ({ start = 0, tab = 0 }) => {
  const f = useCurrentFrame() - start;
  const cols = [
    { key: "key", label: "Key", w: 150 },
    { key: "summary", label: "Summary", w: 600 },
    { key: "project", label: "Project", w: 180 },
    { key: "priority", label: "Priority", w: 150 },
    { key: "status", label: "Status", w: 170 },
    { key: "updated", label: "Updated", w: 160 },
  ];
  const rows = D.requests.map((r) => ({ key: r.key, summary: r.summary, project: "Training", priority: "Medium", status: r.status, updated: "Day 1" }));
  return (
    <AppShell page="Internal requests" title="Internal requests">
      <div style={{ fontFamily, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tabs items={["Jira", "Onboarding", "KYC", "Intercom"]} active={tab} counts={[1, 1, 1, 1]} style={{ flex: 1 }} />
          <Button primary style={{ marginLeft: 16 }}>Raise a request</Button>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            ["Open requests", "4"],
            ["Resolved this month", "2"],
            ["Raised by me", "3"],
          ].map(([t, v], i) => (
            <Panel key={t} style={{ flex: 1, padding: 20, ...reveal(stagger(f, i, 2, 3)) }}>
              <Label>{t}</Label>
              <div style={{ fontSize: 30, fontWeight: 600, color: C.off, marginTop: 8 }}>{v}</div>
            </Panel>
          ))}
        </div>
        <Panel style={{ overflow: "hidden", ...reveal(prog(f, 8, 12)) }}>
          <Table cols={cols} rows={rows} rowH={58} reveal={(i) => reveal(stagger(f, i, 10, 2))} />
        </Panel>
      </div>
    </AppShell>
  );
};
