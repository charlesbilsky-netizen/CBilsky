import React from "react";
import { useCurrentFrame } from "remotion";
import { AppShell } from "../ui/AppShell";
import { AlertBadge, Chip, Demo, Label, Panel, Suggested, Table, Tabs, Icon } from "../ui/primitives";
import { C, eur, fontFamily } from "../theme";
import { D, deals, openDealsSorted, person } from "../data";
import { prog, reveal, stagger } from "../ui/anim";

const since = (d?: number | null) => (d == null ? "No contact yet" : d === 0 ? "Today" : `${d}d ago`);

const Ring: React.FC<{ pct: number; size?: number }> = ({ pct, size = 120 }) => {
  const r = size / 2 - 9;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={C.line} strokeWidth={10} fill="none" />
      <circle cx={size / 2} cy={size / 2} r={r} stroke={C.bright} strokeWidth={10} fill="none" strokeDasharray={`${c * pct} ${c}`} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="54%" textAnchor="middle" fill={C.off} fontFamily={fontFamily} fontWeight={600} fontSize={26}>
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
};

const Spark: React.FC<{ w?: number; h?: number; pts?: number[] }> = ({ w = 220, h = 44, pts = [2, 3, 3, 4, 3, 5, 6, 6, 7, 8] }) => {
  const max = Math.max(...pts);
  const d = pts.map((v, i) => `${i === 0 ? "M" : "L"}${(i / (pts.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width={w} height={h}>
      <path d={d} stroke={C.bright} strokeWidth={2.5} fill="none" />
    </svg>
  );
};

export type DashProps = { tab?: number; highlightRow?: number | null; period?: 0 | 1; start?: number; glow?: Record<string, number>; top?: "search" | "theme" | "account" | "collapse" | null; dim?: number };

export const Dashboard: React.FC<DashProps> = ({ tab = 2, highlightRow = null, period = 1, start = 0, glow, top = null, dim = 1 }) => {
  const f = useCurrentFrame() - start;
  const m = D.dashboard;
  const tiles = [
    { label: "My clients", value: String(m.my_clients.count), sub: `${m.my_clients.contacted_30d} contacted in 30 days · ${m.my_clients.high_value} high value` },
    { label: "Total NAV", value: eur(m.total_nav), sub: "Synthetic", spark: true },
    { label: "Open deal value", value: eur(m.open_deal_value.value), sub: `${m.open_deal_value.deals} open deals · opens Pipeline →` },
  ];
  const listTabs = ["Going quiet", "New opportunities", "Open deals", "Open requests"];
  const goingQuiet = deals.filter((d) => d.status === "Inactive" || d.stage === "Funding Pending");
  const newOpps = deals.filter((d) => d.stage === "New Opportunity");
  let cols, rows;
  if (tab === 0) {
    cols = [
      { key: "client", label: "Client", w: 420 },
      { key: "stage", label: "Stage", w: 240 },
      { key: "last", label: "Last contact", w: 200 },
      { key: "status", label: "In status", w: 200 },
    ];
    rows = goingQuiet.map((d) => ({ client: <span>{d.co?.name}<Demo /></span>, stage: d.stage, last: since(d.days_since_contact), status: d.status === "Inactive" ? "Inactive" : "KYC passed, funds not in" }));
  } else if (tab === 1) {
    cols = [
      { key: "client", label: "Client", w: 420 },
      { key: "lead", label: "Lead", w: 160 },
      { key: "first", label: "First contact", w: 300 },
      { key: "assigned", label: "Assigned", w: 200 },
    ];
    rows = newOpps.map((d) => ({ client: <span>{d.co?.name ?? d.p.name}{d.co ? <Demo /> : null}</span>, lead: d.lead, first: d.first_contact_sla, assigned: "assigned" in d ? (d as { assigned?: string }).assigned : "Training week" }));
  } else if (tab === 3) {
    cols = [
      { key: "client", label: "Client", w: 300 },
      { key: "req", label: "Request", w: 150 },
      { key: "sum", label: "Summary", w: 420 },
      { key: "status", label: "Status", w: 150 },
    ];
    rows = D.requests.slice(0, 2).map((r, i) => ({ client: <span>{person(i === 0 ? "p3" : "p5").company === "co3" ? "Atlas Quant Partners" : "Horizon Asset Practice"}<Demo /></span>, req: r.key, sum: r.summary, status: r.status }));
  } else {
    cols = [
      { key: "client", label: "Client", w: 238 },
      { key: "stage", label: "Stage", w: 164 },
      { key: "dep", label: "Expected deposit", w: 150, align: "right" as const },
      { key: "gap", label: "", w: 14 },
      { key: "next", label: "Next stage action", w: 258 },
      { key: "last", label: "Last contact", w: 100 },
      { key: "alert", label: "Alerts", w: 262 },
    ];
    rows = openDealsSorted.map((d, i) => ({
      client: <span>{d.co?.name ?? d.p.name}{d.co ? <Demo /> : null}</span>,
      stage: d.stage,
      dep: d.expected_deposit ? eur(d.expected_deposit) : <span style={{ color: C.faint }}>No amount</span>,
      gap: "",
      next: <Suggested text={d.next_action.text} due={d.next_action.due} accepted={d.next_action.state === "Accepted"} />,
      last: since(d.days_since_contact),
      alert: d.alert ? <AlertBadge alert={d.alert} glow={highlightRow === i ? 1 : 0} /> : null,
    }));
  }
  const p0 = prog(f, 0, 14);
  return (
    <AppShell page="Dashboard" title="Dashboard" groupGlow={glow} highlightTop={top}>
      <div style={{ fontFamily, display: "flex", flexDirection: "column", gap: 20, height: "100%", opacity: dim }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, ...reveal(p0) }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: C.off }}>Good morning, Alex</div>
          <div style={{ fontSize: 17, color: C.muted }}>{D.rm.role} · {D.rm.region} · {D.rm.dataset}</div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <Panel style={{ flex: 1.3, padding: 24, display: "flex", gap: 26, alignItems: "center", ...reveal(stagger(f, 0, 4, 3)) }}>
            <Ring pct={m.active_milestone.percent / 100} />
            <div>
              <Label>Active milestone · {m.active_milestone.label}</Label>
              <div style={{ fontSize: 34, fontWeight: 600, color: C.off, marginTop: 8 }}>{eur(m.active_milestone.liquid_nav)}</div>
              <div style={{ fontSize: 17, color: C.muted, marginTop: 4 }}>
                liquid NAV of {eur(m.active_milestone.target)} · {eur(m.active_milestone.remaining)} remaining · checked {m.active_milestone.check_by}
              </div>
            </div>
          </Panel>
          <Panel style={{ flex: 1, padding: 24, ...reveal(stagger(f, 1, 4, 3)) }}>
            <Label>Net new money · {m.net_new_money.label}</Label>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 10 }}>
              <div>
                <div style={{ fontSize: 34, fontWeight: 600, color: C.off }}>{eur(m.net_new_money.value)}</div>
                <div style={{ fontSize: 17, color: C.muted, marginTop: 4 }}>of {eur(m.net_new_money.goal)} goal</div>
              </div>
              <Spark />
            </div>
          </Panel>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {tiles.map((t, i) => (
            <Panel key={t.label} style={{ flex: 1, padding: "20px 24px", ...reveal(stagger(f, i, 9, 3)) }}>
              <Label>{t.label}</Label>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div style={{ fontSize: 30, fontWeight: 600, color: C.off, marginTop: 8 }}>{t.value}</div>
                {t.spark ? <Spark w={140} h={34} /> : null}
              </div>
              <div style={{ fontSize: 15, color: C.muted, marginTop: 4 }}>{t.sub}</div>
            </Panel>
          ))}
        </div>
        <div style={{ display: "flex", gap: 20, flex: 1, minHeight: 0 }}>
          <Panel style={{ flex: 1, minWidth: 0, padding: "8px 8px 0", overflow: "hidden", ...reveal(stagger(f, 0, 16, 3)) }}>
            <div style={{ display: "flex", alignItems: "center", padding: "6px 16px 0" }}>
              <Tabs items={listTabs} active={tab} counts={[goingQuiet.length, newOpps.length, deals.length, D.requests.length]} style={{ flex: 1 }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, width: 260, height: 36, padding: "0 12px", borderRadius: 8, border: `1px solid ${C.line}`, color: C.faint, fontSize: 15 }}>
                <Icon name="search" size={16} /> Search clients
              </div>
              {tab === 0 ? <Chip>Sorted by: Last contacted</Chip> : tab === 2 ? <Chip>Most urgent first</Chip> : null}
              {tab === 0 ? <span style={{ marginLeft: "auto", color: C.bright, fontSize: 15, fontWeight: 600 }}>All going quiet →</span> : null}
            </div>
            <Table cols={cols} rows={rows} rowH={54} highlight={highlightRow} reveal={(i) => reveal(stagger(f, i, 20, 2))} />
          </Panel>
          <Panel style={{ width: 360, flexShrink: 0, padding: 22, ...reveal(stagger(f, 1, 16, 3)) }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Label>Recent activity</Label>
              <span style={{ color: C.bright, fontSize: 14, fontWeight: 600 }}>View all →</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <Chip active={period === 0}>Last 7 days</Chip>
              <Chip active={period === 1}>Last 30 days</Chip>
            </div>
            <div style={{ display: "flex", gap: 26, margin: "18px 0 12px" }}>
              <div><div style={{ fontSize: 24, fontWeight: 600, color: C.off }}>1</div><div style={{ fontSize: 13, color: C.muted }}>deposit · {eur(250000)}</div></div>
              <div><div style={{ fontSize: 24, fontWeight: 600, color: C.off }}>1</div><div style={{ fontSize: 13, color: C.muted }}>KYC passed</div></div>
            </div>
            {D.activities.slice(0, 5).map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderTop: `1px solid ${C.line}`, fontSize: 15, ...reveal(stagger(f, i, 24, 2)) }}>
                <span style={{ color: C.faint, width: 92, flexShrink: 0 }}>{a.day.replace(/ \(.*\)/, "")}</span>
                <span style={{ color: C.text }}>{a.details}</span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
};
