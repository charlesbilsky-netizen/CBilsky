import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AppShell } from "../ui/AppShell";
import { Button, Chip, Demo, Icon, Label, Panel, Table, Tabs } from "../ui/primitives";
import { C, eur, fontFamily } from "../theme";
import { D, clientName, company } from "../data";
import { prog, reveal, stagger } from "../ui/anim";

// S25 · Clients.
export const Clients: React.FC<{ start?: number; detailed?: boolean; hi?: string | null }> = ({ start = 0, detailed = false, hi = null }) => {
  const f = useCurrentFrame() - start;
  const ring = (k: string) => (hi === k ? { boxShadow: `0 0 0 2px ${C.bright}`, borderRadius: 10 } : {});
  const cols = [
    { key: "name", label: "Name", w: 230 },
    { key: "id", label: "Client ID", w: 160 },
    { key: "deal", label: "Deal", w: 200 },
    { key: "company", label: "Company", w: 300 },
    { key: "nav", label: "NAV", w: 160, align: "right" as const },
    { key: "pad", label: "", w: 24 },
    { key: "status", label: "Status", w: 150 },
    { key: "phone", label: "Phone", w: 210 },
  ];
  const rows = D.people.map((p) => {
    const dl = D.deals.find((d) => d.person === p.id);
    const co = company(p.company);
    return {
      name: p.name,
      id: p.crm,
      deal: dl ? dl.stage : "—",
      company: co ? (
        <span>
          {co.name}
          <Demo />
        </span>
      ) : (
        "Individual"
      ),
      nav: p.id === "p2" ? eur(1000000) : "—",
      pad: "",
      status: dl && "status" in dl ? (dl as { status?: string }).status : "Funded",
      phone: p.phone,
    };
  });
  return (
    <AppShell page="Clients" title="Clients">
      <div style={{ fontFamily, display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tabs items={["All", "Clients", "Contacts"]} active={0} style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 10, marginLeft: 16 }}>
            <Button primary style={ring("ownership")}>Check ownership</Button>
            <Button style={ring("create")}>Create contact</Button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Chip style={ring("chips")}>High value</Chip>
          <Chip style={ring("chips")}>High risk</Chip>
          <Chip style={ring("chips")}>Not funded</Chip>
          <span style={{ marginLeft: "auto" }} />
          <Chip active={!detailed} style={ring("density")}>Compact</Chip>
          <Chip active={detailed} style={ring("density")}>Detailed</Chip>
          <Chip style={ring("tools")}><Icon name="filter" size={15} /> Filters</Chip>
          <Chip style={ring("tools")}>Columns</Chip>
          <Chip style={ring("tools")}>Views</Chip>
          <Chip style={ring("tools")}>⤢</Chip>
        </div>
        <Panel style={{ overflow: "hidden", ...reveal(prog(f, 0, 12)) }}>
          <Table cols={cols} rows={rows} rowH={detailed ? 74 : 56} reveal={(i) => reveal(stagger(f, i, 4, 2))} footer={{ name: "Totals", nav: eur(1000000) }} />
        </Panel>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", color: C.muted, fontSize: 14 }}>
          First · Previous · Page 1 of 1 · Next · Last
        </div>
      </div>
    </AppShell>
  );
};

const VERDICT: Record<string, { col: string; meaning: string; action?: string }> = {
  Available: { col: C.bright, meaning: "Free to approach" },
  Claimed: { col: C.warning, meaning: "Another RM owns the person or company", action: "Request reassignment" },
  Restricted: { col: C.critical, meaning: "Funded client or protected company. Do not approach" },
  "Needs narrowing": { col: C.info, meaning: "Several matches. Add the domain or a full email" },
  "Not found": { col: C.slate, meaning: "Nothing in the CRM", action: "Add contact to CRM" },
};

// S26 · Check ownership with the five synthetic verdicts.
export const Ownership: React.FC<{ start?: number; shown?: number; focus?: number | null }> = ({ start = 0, shown = 5, focus = null }) => {
  const f = useCurrentFrame() - start;
  const q = D.ownership_checks.map((o) => o.query).join(", ");
  return (
    <AppShell page="Clients" title="Check ownership">
      <div style={{ fontFamily, display: "flex", flexDirection: "column", gap: 18, height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tabs items={["Search", "Bulk"]} active={0} style={{ flex: 1 }} />
          <span style={{ color: C.muted, fontSize: 15, marginLeft: 16 }}>100 searches a day</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, height: 52, display: "flex", alignItems: "center", gap: 10, padding: "0 16px", borderRadius: 10, border: `1px solid ${C.bright}`, background: "rgba(255,255,255,0.03)", fontSize: 17, color: C.off, overflow: "hidden", whiteSpace: "nowrap" }}>
            <Icon name="search" size={18} color={C.muted} /> {q}
          </div>
          <Button primary>Check</Button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.keys(VERDICT).map((v) => (
            <Chip key={v}>{v}</Chip>
          ))}
          <span style={{ marginLeft: "auto" }} />
          <Chip>Export CSV</Chip>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {D.ownership_checks.slice(0, shown).map((o, i) => {
            const v = VERDICT[o.verdict];
            const dim = focus != null && focus !== i;
            return (
              <Panel
                key={o.query}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "18px 22px",
                  borderColor: focus === i ? v.col : C.line,
                  boxShadow: focus === i ? `0 0 0 2px ${v.col}55, 0 0 30px ${v.col}33` : undefined,
                  ...reveal(stagger(f, i, 6, 6)),
                  opacity: stagger(f, i, 6, 6) * (dim ? 0.35 : 1),
                }}
              >
                <span style={{ width: 190, fontSize: 18, fontWeight: 700, color: v.col }}>{o.verdict}</span>
                <span style={{ width: 470, fontSize: 17, color: C.off }}>{o.query}</span>
                <span style={{ flex: 1, fontSize: 16, color: C.muted }}>{v.meaning}</span>
                {v.action ? <Button>{v.action}</Button> : null}
              </Panel>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
};

const TYPES = ["All activity", "Emails", "Calls", "Meetings", "Deposits", "Withdrawals", "Registered", "KYC started", "KYC passed", "Funded", "First trade", "Requests"];

// S27 · Activity log.
export const Activity: React.FC<{ start?: number; hiRow?: number | null; typesOpen?: boolean }> = ({ start = 0, hiRow = null, typesOpen = false }) => {
  const f = useCurrentFrame() - start;
  const cols = [
    { key: "date", label: "Date", w: 190 },
    { key: "client", label: "Client", w: 360 },
    { key: "type", label: "Type", w: 170 },
    { key: "details", label: "Details", w: 560 },
    { key: "flags", label: "Flags", w: 100 },
  ];
  const rows = D.activities.map((a) => ({
    date: a.day,
    client: (
      <span>
        {clientName(a.client)}
        {company(D.people.find((p) => p.id === a.client)!.company) ? <Demo /> : null}
      </span>
    ),
    type: a.type,
    details: (
      <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {a.details}
        {a.tags.map((t) => (
          <span key={t} style={{ fontSize: 12, color: C.text, background: "rgba(255,255,255,0.06)", border: `1px solid ${C.line}`, borderRadius: 999, padding: "2px 8px" }}>
            {t}
          </span>
        ))}
      </span>
    ),
    flags: "",
  }));
  return (
    <AppShell page="Activity" title="Activity">
      <div style={{ fontFamily, display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Chip active={typesOpen}>Activity type: All activity ▾</Chip>
          <div style={{ width: 300, height: 38, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", borderRadius: 8, border: `1px solid ${C.line}`, color: C.faint, fontSize: 15 }}>
            <Icon name="search" size={16} /> Client or subject
          </div>
          <Chip>From – To</Chip>
          <Chip>Red flags only ○</Chip>
          <span style={{ marginLeft: "auto" }} />
          <Chip>Newest first ▾</Chip>
          <Chip>Columns</Chip>
          <Chip>⤢</Chip>
        </div>
        <Panel style={{ overflow: "hidden", ...reveal(prog(f, 0, 12)) }}>
          <Table cols={cols} rows={rows} rowH={60} highlight={hiRow} reveal={(i) => reveal(stagger(f, i, 4, 2))} />
        </Panel>
      </div>
      {typesOpen ? (
        <Panel style={{ position: "absolute", left: 28, top: 82, width: 300, padding: 8, fontFamily, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", ...reveal(prog(f, 2, 10)) }}>
          {TYPES.map((t, i) => (
            <div key={t} style={{ padding: "8px 12px", fontSize: 16, color: i === 0 ? C.off : C.text, ...reveal(stagger(f, i, 4, 1)) }}>
              {t}
            </div>
          ))}
        </Panel>
      ) : null}
    </AppShell>
  );
};

// S28 · Opening an item, then Raise an issue.
export const ActivityItem: React.FC<{ start?: number; issue?: boolean }> = ({ start = 0, issue = false }) => {
  const f = useCurrentFrame() - start;
  const p = D.people.find((x) => x.id === "p1")!;
  return (
    <AbsoluteFill>
      <Activity hiRow={0} />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 30, fontFamily }}>
        <Panel style={{ width: 720, padding: 28, background: "#192124", display: "flex", flexDirection: "column", gap: 14, ...reveal(prog(f, 0, 12), 20) }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: C.off }}>Synthetic introduction email</div>
          <Label>Details</Label>
          {[
            ["Direction", "Outbound"],
            ["From", "alex.morgan@example.com"],
            ["To", p.email],
            ["Client", "Northstar Capital Training"],
            ["Date", "Day 1 (Mon)"],
            ["Outcome", "Sent"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", fontSize: 16 }}>
              <span style={{ width: 130, color: C.muted }}>{k}</span>
              <span style={{ color: C.text }}>{v}</span>
            </div>
          ))}
          <Label>Message</Label>
          <div style={{ fontSize: 16, color: C.text, lineHeight: 1.55 }}>Fictional message written for this film. Proposes a short call on Day 3 to walk through the demo.</div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button>Raise an issue</Button>
          </div>
        </Panel>
        {issue ? (
          <Panel style={{ width: 560, padding: 28, background: "#192124", display: "flex", flexDirection: "column", gap: 14, ...reveal(prog(f, 6, 12), 20) }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: C.off }}>Raise an issue</div>
            {[
              ["Category", "Choose a category ▾"],
              ["Meeting type", "Offline meeting ▾"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 15, color: C.muted }}>{k}</span>
                <div style={{ padding: "12px 14px", borderRadius: 8, border: `1px solid ${C.line}`, fontSize: 16, color: C.text }}>{v}</div>
              </div>
            ))}
            <span style={{ fontSize: 15, color: C.muted }}>Comment</span>
            <div style={{ padding: "12px 14px", borderRadius: 8, border: `1px solid ${C.bright}`, fontSize: 16, color: C.off, minHeight: 80, lineHeight: 1.5 }}>
              Synthetic: post-meeting email sent to the client on Day 1. Please review the record.
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button primary>Submit issue</Button>
            </div>
          </Panel>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
