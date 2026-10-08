import React from "react";
import { useCurrentFrame } from "remotion";
import { AppShell } from "../ui/AppShell";
import { AlertBadge, Button, Chip, Demo, Icon, Label, Panel, Suggested, Table, Tabs } from "../ui/primitives";
import { C, eur, fontFamily } from "../theme";
import { deals } from "../data";
import { prog, reveal, stagger } from "../ui/anim";

export const NB_STAGES = ["New Opportunity", "Contact Established", "Qualified", "Solution Presented", "Onboarding", "Funding Pending", "Funded", "Won", "Lost", "On Hold"];
export const CG_STAGES = ["Discovery", "Validation", "Negotiation", "Approval", "In Progress", "Funded", "Won", "Lost", "On Hold"];
const LIMIT: Record<string, number> = { "Contact Established": 2, Qualified: 5, "Solution Presented": 5, Onboarding: 7, "Funding Pending": 3 };

type DealX = (typeof deals)[number];
const since = (d?: number | null) => (d == null ? "No contact yet" : `${d}d since contact`);

export const DealCard: React.FC<{ d: DealX; style?: React.CSSProperties; focus?: boolean; menu?: boolean }> = ({ d, style, focus, menu }) => {
  const late = LIMIT[d.stage] != null && (d.days_in_stage ?? 0) > LIMIT[d.stage];
  return (
    <div
      style={{
        position: "relative",
        padding: "14px 14px 12px",
        borderRadius: 10,
        background: C.panel2,
        border: `1px solid ${focus ? C.bright : C.line}`,
        boxShadow: focus ? `0 0 0 3px ${C.bright}33` : undefined,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        fontFamily,
        ...style,
      }}
    >
      <div style={{ fontSize: 17, fontWeight: 600, color: C.off, display: "flex", alignItems: "center" }}>
        {d.co?.name ?? d.p.name}
        {d.co ? <Demo /> : null}
        {menu ? <span style={{ marginLeft: "auto", color: C.muted }}><Icon name="dots" size={20} /></span> : null}
      </div>
      <div style={{ display: "flex", gap: 10, fontSize: 14, color: C.muted }}>
        <span style={{ fontWeight: late ? 700 : 400, color: late ? C.off : C.muted }}>{d.days_in_stage ?? 0}d in stage</span>
        <span>·</span>
        <span style={{ fontWeight: (d.days_since_contact ?? 99) > 14 ? 600 : 400 }}>{since(d.days_since_contact)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
        <span style={{ color: d.expected_deposit ? C.text : C.faint }}>{d.expected_deposit ? eur(d.expected_deposit) : "No amount"}</span>
        <span style={{ color: C.muted }}>{"status" in d ? (d as { status?: string }).status : ""}</span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {d.alert ? <AlertBadge alert={d.alert} wrap /> : null}
        {d.blocker ? <span style={{ fontSize: 13, color: C.warning, border: `1px solid ${C.warning}66`, borderRadius: 6, padding: "3px 8px" }}>Blocked</span> : null}
      </div>
    </div>
  );
};

const Toolbar: React.FC<{ tab: number; table?: boolean; filtersOn?: boolean; createDeal?: boolean; hi?: string | null }> = ({ tab, table, filtersOn, createDeal, hi }) => {
  const ring = (k: string) => (hi === k ? { boxShadow: `0 0 0 2px ${C.bright}`, borderRadius: 999 } : {});
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Tabs items={["New Business", "Client Growth", "Sales plan"]} active={tab} style={{ flex: 1 }} />
        {createDeal ? <Button primary style={{ marginLeft: 16, ...ring("create") }}>+ Create deal</Button> : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, width: 240, height: 38, padding: "0 12px", borderRadius: 8, border: `1px solid ${C.line}`, color: C.faint, fontSize: 15, ...ring("search") }}>
          <Icon name="search" size={16} /> Search client
        </div>
        <Chip active={filtersOn} style={ring("filters")}>
          <Icon name="filter" size={15} /> Filters{filtersOn ? " · 1" : ""}
        </Chip>
        <Chip style={ring("closed")}>Closed: last 90 days ▾</Chip>
        <Chip style={ring("views")}>Views ▾</Chip>
        <Chip style={ring("sort")}>Sort: My order ▾</Chip>
        <span style={{ marginLeft: "auto" }} />
        {table ? <Chip style={ring("columns")}>Columns ▾</Chip> : null}
        <Chip active={!table} style={ring("board")}>Board</Chip>
        <Chip active={!!table} style={ring("table")}>Table</Chip>
      </div>
    </div>
  );
};

const Board: React.FC<{ stages: string[]; list: DealX[]; f: number; focusId?: string | null; menuId?: string | null }> = ({ stages, list, f, focusId, menuId }) => (
  <div style={{ display: "flex", gap: 10, flex: 1, minHeight: 0 }}>
    {stages.map((s, si) => {
      const inCol = list.filter((d) => d.stage === s);
      const total = inCol.reduce((a, d) => a + (d.expected_deposit ?? 0), 0);
      if (!inCol.length)
        return (
          <div key={s} style={{ width: 46, flexShrink: 0, borderRadius: 10, background: "rgba(255,255,255,0.025)", border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", ...reveal(stagger(f, si, 2, 1.5)) }}>
            <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 14, color: C.muted, fontFamily, whiteSpace: "nowrap" }}>{s} · 0</div>
          </div>
        );
      return (
        <div key={s} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10, ...reveal(stagger(f, si, 2, 1.5)) }}>
          <div style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.line}`, fontFamily }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.off }}>{s}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>
              {inCol.length} · {total ? eur(total) : "No amount"}
            </div>
          </div>
          {inCol.map((d, i) => (
            <DealCard key={d.id} d={d} focus={focusId === d.id} menu={menuId === d.id} style={reveal(stagger(f, si + i, 8, 2))} />
          ))}
        </div>
      );
    })}
  </div>
);

// S12 · New Business board.
export const PipelineBoard: React.FC<{ start?: number; focusId?: string | null; menuId?: string | null; hi?: string | null; filtersOn?: boolean }> = ({
  start = 0,
  focusId,
  menuId,
  hi,
  filtersOn,
}) => {
  const f = useCurrentFrame() - start;
  const nb = deals.filter((d) => d.journey === "New Business");
  return (
    <AppShell page="Pipeline" title="Pipeline">
      <div style={{ display: "flex", flexDirection: "column", gap: 18, height: "100%" }}>
        <Toolbar tab={0} hi={hi} filtersOn={filtersOn} />
        <Board stages={NB_STAGES} list={filtersOn ? nb.filter((d) => d.alert) : nb} f={f} focusId={focusId} menuId={menuId} />
      </div>
      {menuId ? (
        <Panel style={{ position: "absolute", left: 555, top: 273, width: 240, boxShadow: "0 24px 60px rgba(0,0,0,0.6)", padding: 8, fontFamily, ...reveal(prog(f, 4, 10)) }}>
          {["Put on hold", "Close deal", "Add task", "Open in CRM"].map((x) => (
            <div key={x} style={{ padding: "10px 12px", fontSize: 16, color: C.text, borderRadius: 8 }}>
              {x}
            </div>
          ))}
        </Panel>
      ) : null}
    </AppShell>
  );
};

// S17 · Client Growth board.
export const ClientGrowthBoard: React.FC<{ start?: number; hi?: string | null }> = ({ start = 0, hi }) => {
  const f = useCurrentFrame() - start;
  const cg = deals.filter((d) => d.journey === "Client Growth");
  return (
    <AppShell page="Pipeline" title="Pipeline">
      <div style={{ display: "flex", flexDirection: "column", gap: 18, height: "100%" }}>
        <Toolbar tab={1} createDeal hi={hi} />
        <div style={{ display: "flex", gap: 8 }}>
          <Chip>Type: Any type ▾</Chip>
          <span style={{ fontSize: 15, color: C.muted, alignSelf: "center", fontFamily }}>Brokerage · White label</span>
        </div>
        <Board stages={CG_STAGES} list={cg} f={f} />
      </div>
    </AppShell>
  );
};

// S13 · Filters panel over the board.
const FILTERS: [string, string[]][] = [
  ["Focus", ["Overdue", "Due this week", "No contact 30d+", "With amount"]],
  ["Status", ["Any status", "Contact", "Inactive", "KYC Passed", "Registrants", "Rejected"]],
  ["Alert", ["Any alert", "Has alert", "SLA breach", "Stopped responding to onboarding", "Funding not arriving", "Lead untouched", "Action overdue", "Overdue task", "Rescheduled repeatedly", "Qualification missing", "Check contact details", "Back from Lost", "Suspected duplicate"]],
  ["Next stage action", ["Any", "Suggested", "Accepted", "Overdue", "None"]],
  ["Blocked", ["Any blocked", "Any blocker", "Blocked by the RM's note", "Blocked by an open request"]],
  ["Origin", ["Any origin", "Sales Plan"]],
];
export const FiltersPanel: React.FC<{ start?: number; pick?: string | null; focusGroup?: string | null }> = ({ start = 0, pick = null, focusGroup = null }) => {
  const f = useCurrentFrame() - start;
  return (
    <AppShell page="Pipeline" title="Pipeline">
      <div style={{ display: "flex", flexDirection: "column", gap: 18, height: "100%", opacity: 0.45 }}>
        <Toolbar tab={0} />
      </div>
      <Panel style={{ position: "absolute", left: 300, top: 120, width: 1060, padding: 26, display: "flex", flexDirection: "column", gap: 18, fontFamily, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", ...reveal(prog(f, 0, 12)) }}>
        {FILTERS.map(([g, opts], gi) => (
          <div key={g} style={{ display: "flex", gap: 16, alignItems: "flex-start", ...reveal(stagger(f, gi, 4, 3)), opacity: stagger(f, gi, 4, 3) * (focusGroup && focusGroup !== g ? 0.45 : 1) }}>
            <Label style={{ width: 170, paddingTop: 8, color: focusGroup === g ? C.bright : C.muted }}>{g}</Label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
              {opts.map((o) => (
                <Chip key={o} active={pick === o} style={{ fontSize: 14, padding: "5px 12px" }}>
                  {o}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </Panel>
    </AppShell>
  );
};

// S15 · Closed window, Sort and Views menus.
export const PipelineMenus: React.FC<{ start?: number }> = ({ start = 0 }) => {
  const f = useCurrentFrame() - start;
  const menus: [string, string[]][] = [
    ["Closed window", ["Any closed", "Closed: last 30 days", "Closed: last 90 days", "Closed: last 12 months"]],
    ["Sort", ["My order", "Expected deposit", "Next action due", "Longest since contact", "Newest first"]],
    ["Views", ["No saved views yet. Set up the filters you want, then save them here."]],
  ];
  return (
    <AppShell page="Pipeline" title="Pipeline">
      <div style={{ opacity: 0.45 }}>
        <Toolbar tab={0} />
      </div>
      <div style={{ position: "absolute", left: 300, top: 140, display: "flex", gap: 24, fontFamily }}>
        {menus.map(([t, opts], mi) => (
          <Panel key={t} style={{ width: 360, padding: 16, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", ...reveal(stagger(f, mi, 0, 8)) }}>
            <Label style={{ padding: "4px 8px 10px" }}>{t}</Label>
            {opts.map((o, i) => (
              <div key={o} style={{ padding: "10px 10px", fontSize: 16, color: o === "Closed: last 90 days" || o === "My order" ? C.off : C.text, background: o === "Closed: last 90 days" || o === "My order" ? "rgba(38,191,107,0.1)" : undefined, borderRadius: 8, lineHeight: 1.4, ...reveal(stagger(f, mi * 4 + i, 6, 1.5)) }}>
                {o}
                {o === "Closed: last 90 days" ? <span style={{ color: C.muted }}> · default</span> : null}
              </div>
            ))}
          </Panel>
        ))}
      </div>
    </AppShell>
  );
};

// S16 · Table view.
export const PipelineTable: React.FC<{ start?: number; hiCol?: "next" | "sla" | null }> = ({ start = 0, hiCol = null }) => {
  const f = useCurrentFrame() - start;
  const nb = deals.filter((d) => d.journey === "New Business");
  const hi = (k: string) => (hiCol === k ? { background: "rgba(38,191,107,0.07)" } : {});
  const cols = [
    { key: "client", label: "Client", w: 270 },
    { key: "stage", label: "Stage", w: 190 },
    { key: "status", label: "Status", w: 120 },
    { key: "dep", label: "Expected deposit", w: 160, align: "right" as const },
    { key: "pad", label: "", w: 20 },
    { key: "in", label: "In stage", w: 90 },
    { key: "next", label: "Next stage action", w: 270 },
    { key: "sla", label: "First contact SLA", w: 190 },
    { key: "last", label: "Last contact", w: 120 },
  ];
  const rows = nb.map((d) => ({
    client: (
      <span>
        {d.co?.name ?? d.p.name}
        {d.co ? <Demo /> : null}
      </span>
    ),
    stage: d.stage,
    status: d.status,
    dep: d.expected_deposit ? eur(d.expected_deposit) : <span style={{ color: C.faint }}>No amount</span>,
    pad: "",
    in: `${d.days_in_stage}d`,
    next: (
      <span style={{ display: "block", ...hi("next") }}>
        <Suggested text={d.next_action.text} due={d.next_action.due} accepted={d.next_action.state === "Accepted"} />
      </span>
    ),
    sla: <span style={{ display: "block", padding: "4px 0", ...hi("sla"), color: d.first_contact_sla === "Overdue" ? C.critical : C.text }}>{d.first_contact_sla}</span>,
    last: d.days_since_contact == null ? "No contact yet" : `${d.days_since_contact}d ago`,
  }));
  return (
    <AppShell page="Pipeline" title="Pipeline">
      <div style={{ display: "flex", flexDirection: "column", gap: 18, height: "100%" }}>
        <Toolbar tab={0} table />
        <Panel style={{ overflow: "hidden", ...reveal(prog(f, 0, 12)) }}>
          <Table
            cols={cols}
            rows={rows}
            rowH={66}
            reveal={(i) => reveal(stagger(f, i, 4, 2))}
            footer={{ client: "Totals", dep: eur(nb.reduce((a, d) => a + (d.expected_deposit ?? 0), 0)) }}
          />
        </Panel>
      </div>
    </AppShell>
  );
};
