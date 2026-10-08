import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { AppShell } from "../ui/AppShell";
import { Button, Chip, Demo, Label, Panel, Tabs } from "../ui/primitives";
import { C, eur, fontFamily } from "../theme";
import { deals, D } from "../data";
import { prog, reveal, stagger } from "../ui/anim";
import { NB_STAGES } from "./Pipeline";

const deal = deals.find((d) => d.id === "d1")!; // Northstar Capital Training, training deal

export type NAState = "suggested" | "editing" | "accepted" | "completed";

const Field: React.FC<{ k: string; v: React.ReactNode }> = ({ k, v }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ fontSize: 13, color: C.muted, letterSpacing: 0.6 }}>{k}</span>
    <span style={{ fontSize: 18, color: C.off, fontWeight: 500 }}>{v}</span>
  </div>
);

// S19 / S20 · The deal page.
export const DealPage: React.FC<{ na?: NAState; stage?: string; start?: number; acceptPress?: number }> = ({ na = "suggested", stage = deal.stage, start = 0, acceptPress = 0 }) => {
  const f = useCurrentFrame() - start;
  const nextText = na === "completed" ? "Present the solution & discuss terms" : deal.next_action.text;
  const due = na === "completed" ? "Day 8" : deal.next_action.due;
  const life = ["Contact", "Registrant", "KYC passed", "Funded"];
  return (
    <AppShell page="Pipeline" title="Deal">
      <div style={{ fontFamily, display: "flex", flexDirection: "column", gap: 18, height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, ...reveal(prog(f, 0, 12)) }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: C.off }}>{deal.co!.name}</div>
          <Demo />
          <span style={{ fontSize: 15, color: C.muted }}>{deal.p.name} · {deal.p.crm} · New Business</span>
          <span style={{ marginLeft: "auto" }} />
          <Button>Put on hold</Button>
          <Button>Close deal</Button>
        </div>
        <div style={{ display: "flex", gap: 6, ...reveal(prog(f, 3, 12)) }}>
          {NB_STAGES.slice(0, 8).map((s) => {
            const on = s === stage;
            const passed = NB_STAGES.indexOf(s) < NB_STAGES.indexOf(stage);
            return (
              <div key={s} style={{ flex: 1, padding: "10px 8px", textAlign: "center", fontSize: 14, fontWeight: on ? 700 : 500, borderRadius: 8, color: on ? "#04160C" : passed ? C.off : C.muted, background: on ? C.bright : passed ? "rgba(38,191,107,0.18)" : "rgba(255,255,255,0.04)", border: `1px solid ${on ? C.bright : C.line}` }}>
                {s}
              </div>
            );
          })}
        </div>
        <Tabs items={["Deal", "Activity", "Tasks & notes", "Requests"]} active={0} />
        <div style={{ display: "flex", gap: 20, flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            <Panel style={{ padding: 22, ...reveal(stagger(f, 0, 6, 3)) }}>
              <Label>Opportunity overview</Label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginTop: 14 }}>
                <Field k="Expected deposit" v={eur(deal.expected_deposit)} />
                <Field k="Potential AUM" v={eur(deal.potential_aum)} />
                <Field k="Expected close" v="Training week" />
                <Field k="Chance of closing" v="Medium" />
                <Field k="Deal age" v="3 days" />
                <Field k="Last contact" v="1 day ago" />
              </div>
            </Panel>
            <Panel style={{ padding: 22, ...reveal(stagger(f, 1, 6, 3)) }}>
              <Label>Account lifecycle</Label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
                {life.map((l, i) => (
                  <React.Fragment key={l}>
                    <span style={{ padding: "6px 12px", borderRadius: 999, fontSize: 15, color: i === 0 ? "#04160C" : C.muted, background: i === 0 ? C.bright : "rgba(255,255,255,0.04)", border: `1px solid ${i === 0 ? C.bright : C.line}` }}>{l}</span>
                    {i < life.length - 1 ? <span style={{ color: C.faint }}>→</span> : null}
                  </React.Fragment>
                ))}
              </div>
            </Panel>
            <Panel style={{ padding: 22, ...reveal(stagger(f, 2, 6, 3)) }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Label>Qualification</Label>
                <span style={{ fontSize: 14, color: C.muted }}>4 of 6 required</span>
              </div>
              <div style={{ height: 6, borderRadius: 6, background: C.line, marginTop: 12 }}>
                <div style={{ width: "66%", height: 6, borderRadius: 6, background: C.bright }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                {["Expected deposit ✓", "Potential AUM ✓", "Expected closing date ✓", "Chance of closing ✓", "Instruments", "Products"].map((x) => (
                  <Chip key={x} style={{ fontSize: 14, color: x.includes("✓") ? C.text : C.warning }}>{x}</Chip>
                ))}
              </div>
            </Panel>
          </div>
          <div style={{ width: 640, display: "flex", flexDirection: "column", gap: 16 }}>
            <Panel style={{ padding: 22, ...reveal(stagger(f, 0, 9, 3)) }}>
              <Label>About this deal</Label>
              <div style={{ fontSize: 17, color: C.text, marginTop: 10, lineHeight: 1.5 }}>{deal.about}</div>
            </Panel>
            <Panel style={{ padding: 22, border: `1px solid ${na === "accepted" || na === "completed" ? C.line : C.violet + "88"}`, ...reveal(stagger(f, 1, 9, 3)) }}>
              <Label>Next stage action</Label>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
                {na === "suggested" || na === "editing" ? <span style={{ fontSize: 13, fontWeight: 700, color: C.violet, border: `1px solid ${C.violet}`, borderRadius: 6, padding: "2px 8px" }}>Suggested</span> : null}
                <span style={{ fontSize: 21, fontWeight: 600, color: na === "accepted" || na === "completed" ? C.off : C.violet, borderBottom: na === "editing" ? `2px solid ${C.violet}` : undefined }}>{nextText}</span>
              </div>
              <div style={{ fontSize: 16, color: C.muted, marginTop: 6 }}>Due {due}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                {na === "suggested" || na === "editing" ? (
                  <>
                    <Button primary pressed={acceptPress}>Accept</Button>
                    <Button>Edit</Button>
                    <Button>+ Add task</Button>
                  </>
                ) : (
                  <>
                    <Button primary>Mark complete</Button>
                    <Button>Plan</Button>
                    <Button>Cancel action</Button>
                    <Button>+ Add task</Button>
                  </>
                )}
              </div>
            </Panel>
            <Panel style={{ padding: 22, ...reveal(stagger(f, 2, 9, 3)) }}>
              <Label>Blocker</Label>
              <div style={{ fontSize: 16, color: C.muted, marginTop: 8 }}>Nothing blocking this deal.</div>
            </Panel>
            <Panel style={{ padding: 22, flex: 1, ...reveal(stagger(f, 3, 9, 3)) }}>
              <Label>Latest notes</Label>
              <div style={{ fontSize: 16, color: C.text, marginTop: 8, lineHeight: 1.5 }}>Day 1 · Synthetic call. The client asked for a demo of multi-asset execution.</div>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

const Modal: React.FC<{ title: string; width?: number; children: React.ReactNode; p?: number; left?: number }> = ({ title, width = 760, children, p = 1, left }) => (
  <AbsoluteFill style={{ background: `rgba(0,0,0,${0.5 * p})`, alignItems: left == null ? "center" : undefined, justifyContent: "center" }}>
    <Panel style={{ width, padding: 30, display: "flex", flexDirection: "column", gap: 18, fontFamily, marginLeft: left, boxShadow: "0 40px 100px rgba(0,0,0,0.7)", background: "#192124", ...reveal(p, 24) }}>
      <div style={{ fontSize: 24, fontWeight: 600, color: C.off }}>{title}</div>
      {children}
    </Panel>
  </AbsoluteFill>
);

const Box: React.FC<{ label: string; value?: string; placeholder?: string; tall?: boolean; hint?: string }> = ({ label, value, placeholder, tall, hint }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <span style={{ fontSize: 15, color: C.muted }}>
      {label}
      {hint ? <span style={{ color: C.faint }}> · {hint}</span> : null}
    </span>
    <div style={{ minHeight: tall ? 84 : 46, padding: "12px 14px", borderRadius: 8, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.03)", fontSize: 17, color: value ? C.off : C.faint, lineHeight: 1.45 }}>
      {value ?? placeholder}
    </div>
  </div>
);

// S21 · Mark complete on Contact Established.
export const CompleteDialog: React.FC<{ start?: number; press?: number }> = ({ start = 0, press = 0 }) => {
  const f = useCurrentFrame() - start;
  return (
    <AbsoluteFill>
      <DealPage na="accepted" />
      <Modal title="Complete stage action · Qualify the opportunity" p={prog(f, 0, 12)}>
        <Box label="Outcome" value="Synthetic call. The client wants to see multi-asset execution and expects to start with EUR 500,000." tall />
        <Box label="How did you reach them?" hint="optional" placeholder="Outbound call, inbound call, meeting…" />
        <Box label="Note" hint="optional" placeholder="What was said and agreed" />
        <Box label="Next action" value="Present the solution & discuss terms · due in 5 days" />
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 6 }}>
          <Button>Keep in Contact Established</Button>
          <Button primary pressed={press}>Complete & move to Qualified</Button>
        </div>
      </Modal>
    </AbsoluteFill>
  );
};

// S22 · The move dialog: a reminder, not a wall.
export const MoveDialog: React.FC<{ start?: number }> = ({ start = 0 }) => {
  const f = useCurrentFrame() - start;
  return (
    <AbsoluteFill>
      <DealPage na="accepted" />
      <Modal title="Move to Qualified" p={prog(f, 0, 12)}>
        <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${C.warning}66`, background: `${C.warning}12` }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.warning }}>Something missing</div>
          <div style={{ fontSize: 16, color: C.text, marginTop: 6 }}>Instruments · Products</div>
        </div>
        <Box label="Outcome" value="Synthetic call. Demo agreed." />
        <Box label="Suggested next action" value="Present the solution & discuss terms" />
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, color: C.text }}>
          <span style={{ width: 20, height: 20, borderRadius: 5, background: C.bright, display: "inline-block" }} /> Add to my tasks
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button primary>Move anyway</Button>
        </div>
      </Modal>
    </AbsoluteFill>
  );
};

// S23 · Put on hold and Close deal, side by side.
export const HoldCloseDialogs: React.FC<{ start?: number; reason?: number }> = ({ start = 0, reason = 2 }) => {
  const f = useCurrentFrame() - start;
  const reasons = ["No Budget", "No Current Need", "Bad Timing", "Budget Pending", "Decision Pending", "Needs More Time", "Other"];
  return (
    <AbsoluteFill>
      <DealPage na="accepted" />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.5)", flexDirection: "row", gap: 36, alignItems: "center", justifyContent: "center", fontFamily }}>
        <Panel style={{ width: 600, padding: 28, display: "flex", flexDirection: "column", gap: 16, background: "#192124", ...reveal(prog(f, 0, 12), 24) }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: C.off }}>Put on hold</div>
          <span style={{ fontSize: 15, color: C.muted }}>Reason</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {reasons.map((r, i) => (
              <Chip key={r} active={i === reason}>{r}</Chip>
            ))}
          </div>
          <Box label="Follow-up date" hint="optional" value="Day 12" />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button primary>Put on hold</Button>
          </div>
        </Panel>
        <Panel style={{ width: 600, padding: 28, display: "flex", flexDirection: "column", gap: 16, background: "#192124", ...reveal(prog(f, 8, 12), 24) }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: C.off }}>Close deal</div>
          <Box label="Loss reason" placeholder="Pick the closest reason ▾" />
          <Box label="Notes" hint="required" value="Synthetic note: the training client chose to stay with its current provider for this year." tall />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button>Close deal</Button>
          </div>
        </Panel>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// S24 · Create deal on Client Growth.
export const CreateDeal: React.FC<{ start?: number; typed?: string; picked?: boolean }> = ({ start = 0, typed = "Mer", picked = true }) => {
  const f = useCurrentFrame() - start;
  const p = D.people.find((x) => x.id === "p2")!;
  return (
    <AbsoluteFill>
      <AppShell page="Pipeline" title="Pipeline">
        <div style={{ opacity: 0.35, fontFamily, fontSize: 18, color: C.muted }}>Client Growth</div>
      </AppShell>
      <Modal title="Create deal" p={prog(f, 0, 12)}>
        <Box label="Client" value={typed} />
        {picked ? (
          <div style={{ padding: "12px 14px", borderRadius: 8, border: `1px solid ${C.bright}`, background: "rgba(38,191,107,0.08)", fontSize: 17, color: C.off }}>
            Meridian Family Office Demo <Demo /> <span style={{ color: C.muted, fontSize: 15 }}> · {p.email}</span>
          </div>
        ) : null}
        <span style={{ fontSize: 15, color: C.muted }}>Type</span>
        <div style={{ display: "flex", gap: 10 }}>
          <Chip active>Brokerage</Chip>
          <Chip>White label</Chip>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Box label="Expected deposit" hint="optional" value={eur(1000000)} />
          </div>
          <div style={{ flex: 1 }}>
            <Box label="Chance of closing" hint="optional" value="Medium" />
          </div>
        </div>
        <Box label="Description" hint="optional" value="Synthetic: additional allocation from a funded demo family office." />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button primary>Create deal</Button>
        </div>
      </Modal>
    </AbsoluteFill>
  );
};
