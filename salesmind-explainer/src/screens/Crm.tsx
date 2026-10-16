import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, fontFamily } from "../theme";
import { prog, reveal, stagger } from "../ui/anim";

// Ch10 · The CRM side, drawn in code as a simulated neutral system: slate
// steel, not SalesMind green, so the two systems read as two places.
// All records synthetic; the film layer adds the SIMULATED badge.

const BG = "#141A1E";
const PANEL = "#1B2328";
const LINE2 = "#2E3A41";
const ACC = "#6FA8DC"; // the CRM's own accent: steel blue (the film's info tone)

const Shell: React.FC<{ tab: string; children: React.ReactNode }> = ({ tab, children }) => {
  const tabs = ["Contacts", "All Applications", "Registrants", "Qualified", "Waiting for Review", "Pending", "KYC passed", "Funded"];
  return (
    <AbsoluteFill style={{ background: BG, fontFamily }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 30px", borderBottom: `1px solid ${LINE2}` }}>
        <span style={{ width: 30, height: 30, borderRadius: 7, background: ACC, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#0C1216", fontWeight: 800, fontSize: 15 }}>C</span>
        <span style={{ fontSize: 20, fontWeight: 650, color: "#E9EEF2" }}>CRM · Training build</span>
        <span style={{ marginLeft: "auto", fontSize: 14, color: "#7C8B95" }}>Synthetic dataset · Day 45</span>
      </div>
      <div style={{ display: "flex", gap: 6, padding: "12px 30px", borderBottom: `1px solid ${LINE2}` }}>
        {tabs.map((t) => (
          <span key={t} style={{ padding: "8px 14px", borderRadius: 8, fontSize: 15.5, fontWeight: 600, color: t === tab ? "#0C1216" : "#9AA9B2", background: t === tab ? ACC : "transparent" }}>
            {t}
          </span>
        ))}
      </div>
      <div style={{ flex: 1, position: "relative" }}>{children}</div>
    </AbsoluteFill>
  );
};

const Field: React.FC<{ label: string; value: string; hint?: string; ok?: boolean }> = ({ label, value, hint, ok }) => (
  <div>
    <div style={{ fontSize: 14, color: "#7C8B95", marginBottom: 6 }}>{label}</div>
    <div style={{ padding: "11px 14px", borderRadius: 8, border: `1px solid ${ok ? ACC : LINE2}`, background: "#10161A", fontSize: 18, color: "#E9EEF2", display: "flex", justifyContent: "space-between" }}>
      {value}
      {hint ? <span style={{ fontSize: 14, color: "#7C8B95", alignSelf: "center" }}>{hint}</span> : null}
    </div>
  </div>
);

// S44 · Add contact, and the refusal that means "not your lead".
export const CrmAddContact: React.FC<{ start?: number; refuse?: number }> = ({ start = 0, refuse = 10000 }) => {
  const f = useCurrentFrame() - start;
  const refused = f >= refuse;
  return (
    <Shell tab="Contacts">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 640, borderRadius: 14, background: PANEL, border: `1px solid ${LINE2}`, padding: 28, display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 40px 100px rgba(0,0,0,0.6)", ...reveal(prog(f, 0, 12), 20) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 24, fontWeight: 650, color: "#E9EEF2" }}>Add contact</span>
            <span style={{ fontSize: 20, color: "#7C8B95" }}>×</span>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1, ...reveal(stagger(f, 0, 8, 4)) }}><Field label="First name" value="Jordan" /></div>
            <div style={{ flex: 1, ...reveal(stagger(f, 1, 8, 4)) }}><Field label="Last name" value="Keel (Demo)" /></div>
          </div>
          <div style={{ ...reveal(stagger(f, 2, 8, 4)) }}>
            <Field label="Email address" value="jordan.keel@example.com" hint="email or phone — one is required" ok />
          </div>
          <div style={{ ...reveal(stagger(f, 3, 8, 4)) }}>
            <Field label="Phone" value="442079460123" hint="digits only" ok />
          </div>
          <div style={{ ...reveal(stagger(f, 4, 8, 4)) }}>
            <Field label="Type" value="Individual ▾" hint="or Corporate" />
          </div>
          {refused ? (
            <div style={{ padding: "14px 16px", borderRadius: 10, border: `1px solid ${C.critical}`, background: "rgba(226,109,90,0.10)", opacity: prog(f, refuse, 12) }}>
              <div style={{ fontSize: 17, fontWeight: 650, color: C.critical }}>Cannot add this contact</div>
              <div style={{ fontSize: 15.5, color: "#D8C9C5", marginTop: 6, lineHeight: 1.45 }}>
                The email, phone or domain is already registered — this lead is assigned to another RM. Edits and corporate lists go through a request.
              </div>
            </div>
          ) : null}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <span style={{ padding: "10px 26px", borderRadius: 8, background: refused ? "#3A4750" : ACC, color: refused ? "#8C9BA5" : "#0C1216", fontSize: 17, fontWeight: 700 }}>Add</span>
          </div>
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

// S45 · The bulk template: one plain-text spreadsheet.
export const CrmBulkTemplate: React.FC<{ start?: number }> = ({ start = 0 }) => {
  const f = useCurrentFrame() - start;
  const cols = ["First name", "Last name", "Email", "Phone", "Corporate / Individual", "Manager"];
  const rows: string[][] = [
    ["Jordan", "Keel (Demo)", "jordan.keel@example.com", "442079460123", "", "alex.morgan@example.com"],
    ["Rae", "Singer (Demo)", "rae.singer@example.com", "442079460124", "", "alex.morgan@example.com"],
    ["Marlo", "Veit (Demo)", "marlo.veit@example.com", "442079460125", "", "alex.morgan@example.com"],
  ];
  const rules = ["Plain text, every column", "Keep every column · leave Corporate/Individual empty", "Emails exact, no spaces", "Phones digits only", "Your email in Manager = assigned to you", "Save as XLSX, submit on the CRM page"];
  return (
    <Shell tab="Contacts">
      <div style={{ padding: "30px 40px", fontFamily }}>
        <div style={{ fontSize: 15, color: "#7C8B95", marginBottom: 12, ...reveal(prog(f, 0, 10)) }}>Bulk contact import · template (synthetic)</div>
        <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${LINE2}`, ...reveal(prog(f, 4, 12)) }}>
          <div style={{ display: "flex", background: "#232D34" }}>
            {cols.map((c0, i) => (
              <div key={c0} style={{ flex: i === 2 || i === 5 ? 1.5 : 1, padding: "12px 14px", fontSize: 14.5, fontWeight: 700, color: "#C7D3DA", borderRight: `1px solid ${LINE2}` }}>{c0}</div>
            ))}
          </div>
          {rows.map((r, ri) => (
            <div key={ri} style={{ display: "flex", background: ri % 2 ? "#161D22" : "#121920", ...reveal(stagger(f, ri, 10, 5)) }}>
              {r.map((v, i) => (
                <div key={i} style={{ flex: i === 2 || i === 5 ? 1.5 : 1, padding: "12px 14px", fontSize: 14.5, color: i === 5 ? ACC : "#B9C6CE", borderRight: `1px solid ${LINE2}`, fontVariantNumeric: "tabular-nums" }}>{v}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
          {rules.map((r, i) => (
            <span key={r} style={{ padding: "9px 16px", borderRadius: 999, border: `1px solid ${ACC}66`, background: `${ACC}10`, color: "#C7D8E6", fontSize: 15.5, fontWeight: 600, ...reveal(stagger(f, i, 26, 4)) }}>
              {r}
            </span>
          ))}
        </div>
      </div>
    </Shell>
  );
};
