import React from "react";
import { useCurrentFrame } from "remotion";
import { AppShell } from "../ui/AppShell";
import { Button, Chip, Demo, Icon, Label, Panel, Tabs } from "../ui/primitives";
import { C, fontFamily } from "../theme";
import { D, clientName } from "../data";
import { prog, reveal, stagger } from "../ui/anim";

type Task = (typeof D.tasks)[number];
const spine = (t: Task) => (t.priority === "High" ? C.rose : t.priority === "Medium" ? C.warning : C.slate);

const TaskRow: React.FC<{ t: Task; age?: string; chips?: boolean; selected?: boolean; style?: React.CSSProperties; done?: boolean }> = ({
  t,
  age,
  chips,
  selected,
  style,
  done,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 16px",
      borderRadius: 10,
      background: selected ? "rgba(38,191,107,0.08)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${selected ? C.bright + "88" : C.line}`,
      boxShadow: `inset 4px 0 0 ${spine(t)}`,
      ...style,
    }}
  >
    <span style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${done ? C.bright : C.faint}`, background: done ? C.bright : undefined, flexShrink: 0 }} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 18, color: done ? C.muted : C.off, fontWeight: 500, textDecoration: done ? "line-through" : undefined }}>{t.title}</div>
      <div style={{ display: "flex", gap: 10, marginTop: 4, fontSize: 14, color: C.muted, alignItems: "center" }}>
        {t.client ? (
          <span style={{ color: C.text }}>
            {clientName(t.client)}
            <Demo />
          </span>
        ) : null}
        {age ? <span>{age}</span> : null}
        {t.time ? <span>· {t.time}</span> : null}
        <span>· {t.duration}</span>
      </div>
    </div>
    {chips ? (
      <div style={{ display: "flex", gap: 6 }}>
        {["Today", "Week", "Month", "Later"].map((c) => (
          <Chip key={c} style={{ fontSize: 14, padding: "4px 10px" }}>
            {c}
          </Chip>
        ))}
      </div>
    ) : null}
  </div>
);

const Header: React.FC<{ active: number }> = ({ active }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
    <Tabs items={["Inbox", "Today", "Planning"]} active={active} counts={[3, 3, 8]} style={{ flex: 1 }} />
    <span style={{ color: C.muted, fontSize: 20 }}>↶ ↷</span>
    <span style={{ color: C.bright, fontSize: 15, fontWeight: 600 }}>Guide</span>
  </div>
);

const Capture: React.FC<{ typed?: string; caret?: boolean; dest?: string }> = ({ typed = "", caret, dest = "Inbox" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, height: 52, padding: "0 16px", borderRadius: 10, border: `1px solid ${typed ? C.bright : C.line}`, background: "rgba(255,255,255,0.03)" }}>
    <Icon name="plus" size={18} color={C.muted} />
    <span style={{ flex: 1, fontSize: 18, color: typed ? C.off : C.faint }}>
      {typed || "Add new task"}
      {caret ? <span style={{ color: C.bright }}>|</span> : null}
    </span>
    <Chip style={{ fontSize: 14 }}>{dest} ▾</Chip>
  </div>
);

// S07 / S08 · Inbox with reading pane; optional capture typing.
export const TasksInbox: React.FC<{ typed?: string; selected?: number; triaged?: number; start?: number }> = ({ typed, selected = 0, triaged = 0, start = 0 }) => {
  const f = useCurrentFrame() - start;
  const inbox = [
    D.tasks[2],
    { title: "Starred email: synthetic question about onboarding documents", client: "p3", horizon: "Inbox", time: null, duration: "10m", priority: "Normal" } as Task,
    { title: "Read Atlas Quant Partners demo checklist notes", client: "p3", horizon: "Inbox", time: null, duration: "15m", priority: "Normal" } as Task,
  ];
  const sel = inbox[selected];
  return (
    <AppShell page="Task management" title="Task management">
      <div style={{ fontFamily, display: "flex", flexDirection: "column", gap: 18, height: "100%" }}>
        <Header active={0} />
        <div style={{ display: "flex", gap: 20, flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1.25, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 16, color: C.muted }}>Give each a when.</div>
            <Capture typed={typed} caret={!!typed} />
            {inbox.map((t, i) => (
              <TaskRow
                key={i}
                t={t}
                age={i === 1 ? "starred" : "1d ago"}
                chips
                selected={i === selected}
                style={{ ...reveal(stagger(f, i, 4, 3)), opacity: i < triaged ? 0.25 : stagger(f, i, 4, 3) }}
              />
            ))}
            <div style={{ marginTop: "auto" }}>
              <Button primary>Plan the day</Button>
            </div>
          </div>
          <Panel style={{ flex: 1, padding: 26, ...reveal(prog(f, 8, 14)) }}>
            <Label>Reading pane</Label>
            <div style={{ fontSize: 22, fontWeight: 600, color: C.off, marginTop: 14 }}>{sel.title}</div>
            <div style={{ fontSize: 16, color: C.muted, marginTop: 8 }}>
              {clientName(sel.client!)} · synthetic training item
            </div>
            <div style={{ height: 1, background: C.line, margin: "20px 0" }} />
            <div style={{ fontSize: 17, color: C.text, lineHeight: 1.6 }}>
              Fictional text written for this film. Check the checklist, note what is missing, and decide when to work on it.
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
              {[
                ["T", "Today"],
                ["W", "Week"],
                ["M", "Month"],
                ["L", "Later"],
              ].map(([k, l]) => (
                <Chip key={k}>
                  <b style={{ color: C.bright }}>{k}</b> {l}
                </Chip>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
};

// S09 / S32 · Today: list beside the calendar.
export const TasksToday: React.FC<{ start?: number; showCalendar?: boolean; highlight?: number | null; synthCal?: boolean }> = ({
  start = 0,
  showCalendar = true,
  highlight = null,
  synthCal = true,
}) => {
  const f = useCurrentFrame() - start;
  const today = D.tasks.filter((t) => t.horizon === "Today");
  const hours = Array.from({ length: 11 }, (_, i) => 8 + i);
  const top = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    return (h - 8 + m / 60) * 72;
  };
  const len = (a: string, b: string) => top(b) - top(a);
  const blocks = [
    ...D.calendar.map((c) => ({ title: c.title, s: c.start, e: c.end, kind: c.kind })),
    ...today.filter((t) => t.time).map((t) => ({ title: t.title, s: t.time!, e: addMin(t.time!, parseInt(t.duration)), kind: "task" })),
  ];
  return (
    <AppShell page="Task management" title="Task management">
      <div style={{ fontFamily, display: "flex", flexDirection: "column", gap: 18, height: "100%" }}>
        <Header active={1} />
        <div style={{ display: "flex", gap: 22, flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: C.off }}>Day 1 (Mon)</div>
              <div style={{ fontSize: 16, color: C.muted }}>3h 20m planned · 4h 40m free</div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <Chip>My order ▾</Chip>
                <Chip>All clients ▾</Chip>
              </div>
            </div>
            <Capture dest="Today" />
            {today.map((t, i) => (
              <TaskRow key={i} t={t} age={i === 0 ? "1d ago" : "today"} selected={highlight === i} style={reveal(stagger(f, i, 4, 3))} />
            ))}
            <div style={{ marginTop: "auto" }}>
              <Button>Plan the day</Button>
            </div>
          </div>
          {showCalendar ? (
            <Panel style={{ width: 560, padding: "16px 18px", position: "relative", overflow: "hidden", ...reveal(prog(f, 6, 14)) }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <Label>Calendar · {synthCal ? "synthetic" : ""}</Label>
                <span style={{ fontSize: 13, color: C.muted }}>■ meeting   ▭ task block (SalesMind Tasks)</span>
              </div>
              <div style={{ position: "relative", height: 11 * 72 }}>
                {hours.map((h, i) => (
                  <div key={h} style={{ position: "absolute", top: i * 72, left: 0, right: 0, borderTop: `1px solid ${C.line}`, fontSize: 12, color: C.faint, paddingTop: 2 }}>
                    {String(h).padStart(2, "0")}:00
                  </div>
                ))}
                {blocks.map((b, i) => {
                  const meeting = b.kind === "meeting";
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: 60,
                        right: 6,
                        top: top(b.s),
                        height: Math.max(30, len(b.s, b.e) - 4),
                        borderRadius: 8,
                        padding: "6px 10px",
                        fontSize: 14,
                        color: meeting ? "#04160C" : C.off,
                        background: meeting ? C.info : "rgba(38,191,107,0.14)",
                        border: meeting ? "none" : `1.5px dashed ${C.bright}`,
                        overflow: "hidden",
                        ...reveal(stagger(f, i, 10, 3)),
                      }}
                    >
                      {meeting ? "" : "☐ "}
                      {b.title}
                    </div>
                  );
                })}
              </div>
            </Panel>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
};

function addMin(hhmm: string, m: number) {
  const [h, mm] = hhmm.split(":").map(Number);
  const t = h * 60 + mm + (isNaN(m) ? 30 : m);
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

// S10 · Plan the day: recap, then the day's arithmetic.
export const PlanTheDay: React.FC<{ step: 0 | 1; start?: number; startPressed?: number }> = ({ step, start = 0, startPressed = 0 }) => {
  const f = useCurrentFrame() - start;
  const parts = [
    { l: "Tasks", v: 3.3, c: C.bright },
    { l: "Meetings", v: 0.5, c: C.info },
    { l: "Solo Events", v: 0.5, c: C.slate },
  ];
  const total = 8;
  const fill = prog(f, 6, 30);
  let acc = 0;
  const r = 110;
  const circ = 2 * Math.PI * r;
  return (
    <AppShell page="Task management" title="Plan the day">
      <div style={{ fontFamily, display: "flex", gap: 24, height: "100%" }}>
        <Panel style={{ width: 460, flexShrink: 0, padding: 30, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Label>{step === 0 ? "Step 1 · Recap" : "Step 2 · Plan"}</Label>
          {step === 0 ? (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
              <div style={{ fontSize: 22, color: C.off, fontWeight: 600 }}>Yesterday, as it really went</div>
              <TaskRow t={D.tasks[7]} done />
              <TaskRow t={D.tasks[2]} age="1d ago · carried over" />
            </div>
          ) : (
            <>
              <div style={{ fontSize: 20, color: C.off, fontWeight: 600 }}>Today's Schedule</div>
              <svg width={280} height={280}>
                <circle cx={140} cy={140} r={r} stroke={C.line} strokeWidth={26} fill="none" />
                {parts.map((p) => {
                  const seg = (p.v / total) * circ * fill;
                  const el = (
                    <circle key={p.l} cx={140} cy={140} r={r} stroke={p.c} strokeWidth={26} fill="none" strokeDasharray={`${seg} ${circ}`} strokeDashoffset={-acc} transform="rotate(-90 140 140)" />
                  );
                  acc += seg;
                  return el;
                })}
                <text x="140" y="138" textAnchor="middle" fill={C.off} fontFamily={fontFamily} fontWeight={600} fontSize={40}>
                  {(4.3 * fill).toFixed(1)}h
                </text>
                <text x="140" y="166" textAnchor="middle" fill={C.muted} fontFamily={fontFamily} fontSize={15}>
                  of {total}h
                </text>
                <text x="140" y="186" textAnchor="middle" fill={C.muted} fontFamily={fontFamily} fontSize={15}>
                  already spoken for
                </text>
              </svg>
              <div style={{ display: "flex", gap: 16 }}>
                {parts.map((p) => (
                  <span key={p.l} style={{ fontSize: 15, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: p.c }} />
                    {p.l}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: "auto" }}>
                <Button primary pressed={startPressed} style={{ fontSize: 20, padding: "14px 26px" }}>
                  Start my day!
                </Button>
              </div>
            </>
          )}
        </Panel>
        <div style={{ flex: 1, display: "flex", gap: 16 }}>
          {["Inbox", "Today", "Coming week", "Later"].map((col, ci) => (
            <Panel key={col} style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <Label>{col}</Label>
              {D.tasks
                .filter((t) => (col === "Inbox" ? step === 0 && t.horizon === "Inbox" : t.horizon === col))
                .map((t, i) => (
                  <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.line}`, boxShadow: `inset 4px 0 0 ${spine(t)}`, ...reveal(stagger(f, i + ci, 4, 3)) }}>
                    <div style={{ fontSize: 16, color: C.off, fontWeight: 500, lineHeight: 1.3 }}>{t.title}</div>
                    <div style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>{[t.time, t.duration].filter(Boolean).join(" · ")}</div>
                  </div>
                ))}
            </Panel>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

// S11 · Planning board / list.
export const Planning: React.FC<{ start?: number; list?: boolean }> = ({ start = 0, list = false }) => {
  const f = useCurrentFrame() - start;
  const cols = ["Inbox", "Today", "Coming week", "Coming month", "Later", "Blocked", "Done"];
  return (
    <AppShell page="Task management" title="Task management">
      <div style={{ fontFamily, display: "flex", flexDirection: "column", gap: 18, height: "100%" }}>
        <Header active={2} />
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Chip active={!list}>Board</Chip>
          <Chip active={list}>List</Chip>
          <span style={{ marginLeft: "auto" }} />
          <Chip>Sort: Smart</Chip>
          <Chip>Show done ●</Chip>
        </div>
        <div style={{ display: "flex", gap: 12, flex: 1, minHeight: 0 }}>
          {cols.map((c, ci) => (
            <Panel key={c} style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 10, ...reveal(stagger(f, ci, 2, 2)) }}>
              <Label style={{ fontSize: 12 }}>{c}</Label>
              <div style={{ fontSize: 13, color: C.faint, padding: "6px 8px", border: `1px dashed ${C.line}`, borderRadius: 8 }}>+ Add new task</div>
              {D.tasks
                .filter((t) => t.horizon === c)
                .map((t, i) => (
                  <div key={i} style={{ padding: "10px 10px", borderRadius: 8, background: "rgba(255,255,255,0.03)", boxShadow: `inset 3px 0 0 ${spine(t)}`, border: `1px solid ${C.line}`, ...reveal(stagger(f, ci + i, 8, 2)) }}>
                    <div style={{ fontSize: 14, color: c === "Done" ? C.muted : C.off, textDecoration: c === "Done" ? "line-through" : undefined }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{t.duration}</div>
                  </div>
                ))}
            </Panel>
          ))}
        </div>
      </div>
    </AppShell>
  );
};
