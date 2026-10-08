import React from "react";
import { AbsoluteFill } from "remotion";
import { Cam, CAM_HOME } from "../ui/Stage";
import { Plate } from "../ui/TitleCard";
import { Cursor } from "../ui/Cursor";
import { prog } from "../ui/anim";
import { C } from "../theme";
import { chapter, lineFrom, phraseAt, lineEnd, camPath, step } from "./tl";
import { cue, SfxKind } from "./cues";
import { Shot, Scr, Callouts, Principle, Keys, Note, Box, Spot, press } from "./kit";
import { Signals, Hub, CrmSync, Ladder, AlertsMap, SlaClock, Cadence, StageFlow, Checklist, Link2, TenDays } from "../mg/MG";
import { SignIn, NavTour } from "../screens/Nav";
import { Dashboard } from "../screens/Dashboard";
import { TasksInbox, TasksToday, PlanTheDay, Planning } from "../screens/Tasks";
import { PipelineBoard, ClientGrowthBoard, FiltersPanel, PipelineMenus, PipelineTable, NB_STAGES } from "../screens/Pipeline";
import { DealPage, CompleteDialog, MoveDialog, HoldCloseDialogs, CreateDeal } from "../screens/DealPage";
import { Clients, Ownership, Activity, ActivityItem } from "../screens/Book";
import { Performance, SalesPlan, GooglePermission, Guidebook, Materials, Changelog, Requests } from "../screens/Rest";

// The edit. Every time below is a frame in the chapter body, taken from the
// narration timeline: L = line start, P = the moment a phrase is spoken,
// E = end of the spoken line. Boxes are [x, y, w, h] in screen pixels.

const H = CAM_HOME;
const cam = (cx: number, cy: number, zoom: number): Cam => ({ cx, cy, zoom });
const SETTLED = -240; // screen already on: skip its entry animation
// Plates behind graphics sit back: dimmer and softly out of focus.
const plate = (n: string, dim = 0.8) => <Plate src={`fal/loop/${n}.mp4`} dim={Math.max(dim, 0.8)} blur={7} />;

const mk = (n: number) => ({
  L: (id: string) => lineFrom(n, id),
  P: (id: string, ph: string, lead?: number) => phraseAt(n, id, ph, lead),
  E: (id: string) => lineEnd(n, id),
  S: (kind: SfxKind, f: number, gain = 0) => cue(n, f, kind, gain),
});

const bodyLen = (n: number) => {
  const c = chapter(n);
  return c.len - c.title_len;
};

// ---------------------------------------------------------------------------
const ch1 = (): Shot[] => {
  const { P } = mk(1);
  const mt = chapter(1).main_title!.from;
  const at = ["A first contact", "A next action", "A follow-up", "A deal with no", "An internal request", "And a calendar"].map((x) => P("c01p01", x));
  const { S } = mk(1);
  at.forEach((t) => S("drop", t, -4));
  S("swipe", P("c01p02", "The work is knowing"), -6);
  S("shimmer", P("c01p02", "The work is knowing") + 30, -6);
  S("riser", mt - 75, -4);
  S("impact", mt + 6, -4);
  return [
    {
      at: 0,
      node: (bf) => (
        <>
          <Plate src="fal/loop/f01.mp4" dim={0.32} scaleFrom={1.02} scaleTo={1.16} />
          <Signals f={bf} at={at} orderAt={P("c01p02", "The work is knowing")} out={mt - 30} />
        </>
      ),
    },
  ];
};

// ---------------------------------------------------------------------------
const ch2 = (): Shot[] => {
  const { L, P } = mk(2);
  const items = ["Your deals", "Your tasks", "What your clients", "How you are", "Your sales plan", "Your requests", "The guidebook", "The sales materials", "your calendar"].map((x) => P("c02p01", x));
  const { S } = mk(2);
  items.forEach((t) => S("chip", t, -8));
  S("swipe", P("c02p02", "Qualification"), -8);
  S("swipe", P("c02p02", "loss reasons"), -8);
  S("shimmer", P("c02p02", "So treat"), -4);
  return [
    {
      at: 0,
      node: (bf) => (
        <>
          {plate("f02", 0.66)}
          <Hub f={bf} a={L("c02p00") + 4} trio={[P("c02p00", "your book"), P("c02p00", "your pipeline"), P("c02p00", "your day")]} items={items} />
        </>
      ),
    },
    {
      at: L("c02p02") - 8,
      node: (bf) => (
        <>
          {plate("f02", 0.72)}
          <CrmSync
            f={bf}
            a={L("c02p02") - 4}
            reads={P("c02p02", "It reads")}
            writes={P("c02p02", "writes back")}
            chips={[
              ["Qualification", P("c02p02", "Qualification")],
              ["Loss reason", P("c02p02", "loss reasons")],
            ]}
          />
          <Principle f={bf} a={P("c02p02", "So treat")} b={P("c02p02", "Qualification")} text="Treat every click as real." y={830} />
        </>
      ),
    },
  ];
};

// ---------------------------------------------------------------------------
const ch3 = (): Shot[] => {
  const { L, P } = mk(3);
  const click = P("c03p01", "You sign in") + 16;
  const g = (bf: number, a: number, b: number) => (bf < a ? 0 : bf < b ? 1 : 0.18);
  const tour = P("c03p01", "and your workspace") - 6;
  const { S } = mk(3);
  S("click", click);
  return [
    {
      at: 0,
      node: (bf) => (
        <Scr
          cam={camPath(bf, [
            [0, cam(960, 540, 1.3)],
            [click, cam(960, 600, 1.45)],
          ])}
          over={<Cursor f={bf} path={[[L("c03p01") - 10, 1200, 820], [click - 4, 960, 696]]} clicks={[click]} />}
        >
          <SignIn press={press(bf, click)} />
        </Scr>
      ),
    },
    {
      at: tour,
      node: (bf) => {
        const top = step<"search" | "theme" | "account" | "collapse" | null>(bf, [
          [0, null],
          [P("c03p06", "Search"), "search"],
          [P("c03p06", "Change theme"), "theme"],
          [P("c03p06", "your account menu"), "account"],
          [P("c03p06", "The menu collapses"), "collapse"],
          [L("c03p07"), null],
        ]);
        const all = bf >= L("c03p07") ? 0.35 : 0;
        const glow = {
          Workspace: Math.max(all, g(bf, L("c03p02"), L("c03p03"))),
          Book: Math.max(all, g(bf, L("c03p03"), L("c03p04"))),
          Results: Math.max(all, g(bf, L("c03p04"), L("c03p05"))),
          Support: Math.max(all, g(bf, L("c03p05"), L("c03p06"))),
        };
        return (
          <>
            <Scr
              cam={camPath(bf, [
                [tour, H],
                [L("c03p02") - 12, cam(470, 300, 1.42)],
                [L("c03p04") - 12, cam(470, 420, 1.42)],
                [L("c03p05") + 10, cam(470, 560, 1.42)],
                [P("c03p06", "Search") - 14, cam(1480, 170, 1.75)],
                [P("c03p06", "The menu collapses") - 14, cam(1480, 170, 1.75)],
                [P("c03p06", "The menu collapses") + 6, cam(420, 880, 1.6)],
                [L("c03p07"), H],
              ])}
              over={
                <Callouts
                  f={bf}
                  items={[
                    { a: P("c03p06", "Search"), b: P("c03p06", "Change theme"), box: [1243, 15, 420, 42], label: "Pages and clients", side: "bottom" },
                    { a: P("c03p06", "Change theme"), b: P("c03p06", "your account menu"), box: [1686, 20, 32, 32], label: "Theme", side: "bottom" },
                    { a: P("c03p06", "your account menu"), b: P("c03p06", "The menu collapses"), box: [1748, 15, 142, 42], label: "Account menu", side: "bottom" },
                    { a: P("c03p06", "The menu collapses") + 6, b: L("c03p07"), box: [20, 1020, 240, 36], label: "Collapse", side: "top" },
                  ]}
                />
              }
            >
              <NavTour glow={glow} top={top} />
            </Scr>
            <Note f={bf} a={P("c03p07", "Eleven pages")} x={1140} y={470} text="Eleven pages" sub="Most days, a handful of them" w={420} />
          </>
        );
      },
    },
  ];
};

// ---------------------------------------------------------------------------
const ch4 = (): Shot[] => {
  const { L, P, E } = mk(4);
  const odv = P("c04p01", "Click Open deal") + 14;
  const tabs: [number, number][] = [
    [0, 2],
    [P("c04p02", "Going quiet"), 0],
    [P("c04p02", "New opportunities"), 1],
    [P("c04p02", "Open deals"), 2],
    [P("c04p02", "Open requests"), 3],
    [L("c04p03") - 6, 2],
  ];
  const tabX = [396, 585, 773, 945];
  const listCam = cam(900, 770, 1.3);
  const { S } = mk(4);
  S("click", odv);
  tabs.slice(1, 5).forEach(([t]) => S("chip", t - 2));
  ["Critical alerts", "Then overdue", "Then deals with no", "Then deals past", "Then blocked", "Then everything"].forEach((x, i) => S(i === 0 ? "alert" : "drop", P("c04p04", x), i === 0 ? -2 : -4));
  S("shimmer", L("c04p05") + 2, -2);
  S("chip", P("c04p06", "the last seven"));
  S("chip", P("c04p06", "and the last thirty"));
  return [
    {
      at: 0,
      node: (bf) => (
        <Scr
          cam={camPath(bf, [
            [0, cam(960, 540, 0.98)],
            [L("c04p01") - 6, cam(1100, 330, 1.22)],
            [P("c04p01", "Then three tiles") - 8, cam(1100, 400, 1.15)],
            [odv - 12, cam(1450, 420, 1.45)],
            [L("c04p02") - 10, listCam],
          ])}
          over={
            <>
              <Callouts
                f={bf}
                items={[
                  { a: P("c04p01", "your active milestone"), b: P("c04p01", "Beside it"), box: [308, 157, 876, 168], label: "Liquid NAV · target · remaining · check date", side: "bottom" },
                  { a: P("c04p01", "Beside it"), b: P("c04p01", "Then three tiles"), box: [1205, 157, 686, 168], label: "Net new money · year vs goal", side: "bottom" },
                  { a: P("c04p01", "Then three tiles"), b: P("c04p01", "Click Open deal"), box: [308, 347, 1582, 123], label: "My clients · Total NAV · Open deal value", side: "bottom" },
                  { a: odv + 6, b: L("c04p02") - 4, box: [1378, 347, 512, 123], label: "Opens the Pipeline", side: "bottom" },
                  { a: P("c04p03", "already sorted"), box: [605, 565, 157, 32], label: "Most urgent first", side: "right" },
                ]}
              />
              <Cursor
                f={bf}
                path={[
                  [P("c04p01", "Click Open deal") - 24, 1500, 640],
                  [odv - 3, 1640, 418],
                  [P("c04p02", "Going quiet") - 6, tabX[0], 532],
                  [P("c04p02", "New opportunities") - 6, tabX[1], 532],
                  [P("c04p02", "Open deals") - 6, tabX[2], 532],
                  [P("c04p02", "Open requests") - 6, tabX[3], 532],
                  [L("c04p03") - 8, tabX[2], 532],
                ]}
                clicks={[odv, ...tabs.slice(1).map(([t]) => t - 2)]}
                show={[P("c04p01", "Click Open deal") - 26, L("c04p03") + 20]}
              />
            </>
          }
        >
          <Dashboard tab={step(bf, tabs)} />
        </Scr>
      ),
    },
    {
      at: L("c04p04") - 8,
      node: (bf) => (
        <>
          {plate("f04", 0.74)}
          <Ladder
            f={bf}
            a={L("c04p04") - 4}
            at={["Critical alerts", "Then overdue", "Then deals with no", "Then deals past", "Then blocked", "Then everything"].map((x) => P("c04p04", x))}
          />
        </>
      ),
    },
    {
      at: L("c04p05") - 10,
      node: (bf) => {
        const s7 = P("c04p06", "the last seven");
        const s30 = P("c04p06", "and the last thirty");
        return (
          <>
            <Scr
              cam={camPath(bf, [
                [L("c04p05") - 10, listCam],
                [E("c04p05") + 10, cam(880, 690, 1.6)],
                [L("c04p06") + 4, cam(1700, 720, 1.42)],
              ])}
              over={
                <>
                  <Spot f={bf} a={L("c04p05") + 4} b={L("c04p06") + 2} box={[317, 655, 1190, 54]} />
                  <Callouts f={bf} items={[{ a: P("c04p06", "View all"), box: [1795, 512, 75, 24], label: "The full log", side: "bottom" }]} />
                  <Cursor f={bf} path={[[s7 - 20, 1700, 760], [s7 - 3, 1612, 563], [s30 - 3, 1742, 563]]} clicks={[s7, s30]} show={[s7 - 22, E("c04p06") + 30]} />
                </>
              }
            >
              <Dashboard start={SETTLED} tab={2} highlightRow={0} period={bf >= s7 && bf < s30 ? 0 : 1} />
            </Scr>
            <Principle f={bf} a={L("c04p05") + 2} b={L("c04p06") - 2} text="Sort by urgency. Work from the top." gold />
          </>
        );
      },
    },
  ];
};

// ---------------------------------------------------------------------------
const ch5 = (): Shot[] => {
  const { L, P, E } = mk(5);
  const pick = P("c05p02", "Pick one") + 8;
  const typedFull = "Call Meridian re funding @Meridian 15:00 !week";
  const t0 = P("c05p03", "type one line");
  const t1 = P("c05p03", "and press Enter") - 4;
  const dayClick = P("c05p04", "Give the task") + 18;
  const startDay = P("c05p06", "Start my day") + 6;
  const cols = [308, 536, 764, 992, 1220, 1448, 1676];
  const colWords = ["Inbox,", "Today,", "Coming week", "Coming month", "Later,", "Blocked", "and Done"];
  const { S } = mk(5);
  S("click", pick);
  ["Today.", "Week.", "Month.", "Or Later"].forEach((x) => S("keys", P("c05p02", x), -6));
  S("keys", P("c05p03", "press C"), -6);
  S("typing", t0 + 2, -8);
  S("keys", t1, -6);
  S("chip", dayClick);
  S("keys", P("c05p05", "Control"), -6);
  S("click", startDay);
  S("confirm", startDay + 3, -4);
  S("tick", E("c05p07") + 12, -4);
  return [
    {
      at: 0,
      node: (bf) => {
        const n = Math.max(0, Math.min(typedFull.length, Math.round(((bf - t0) / Math.max(1, t1 - t0)) * typedFull.length)));
        const typed = bf >= t0 && bf < L("c05p04") ? typedFull.slice(0, n) : undefined;
        return (
          <>
            <Scr
              cam={camPath(bf, [
                [0, H],
                [L("c05p01"), cam(700, 260, 1.5)],
                [L("c05p02") - 6, cam(1000, 420, 1.15)],
                [P("c05p02", "read it in the pane") - 6, cam(1250, 380, 1.2)],
                [L("c05p03") - 6, cam(740, 300, 1.5)],
                [P("c05p03", "An at sign") - 10, cam(760, 470, 1.22)],
                [L("c05p04") - 4, cam(900, 400, 1.4)],
              ])}
              over={
                <>
                  <Callouts
                    f={bf}
                    items={[
                      { a: P("c05p02", "Tasks you captured"), b: P("c05p02", "and the emails"), box: [308, 260, 838, 70], label: "Captured", side: "top" },
                      { a: P("c05p02", "and the emails"), b: pick, box: [308, 344, 838, 91], label: "Starred email", side: "top" },
                      { a: P("c05p02", "read it in the pane"), b: P("c05p02", "give it a day"), box: [1167, 163, 723, 280], label: "Reading pane", side: "bottom" },
                    ]}
                  />
                  <Box f={bf} a={P("c05p01", "Inbox")} b={P("c05p01", "Today")} box={[308, 105, 80, 40]} />
                  <Box f={bf} a={P("c05p01", "Today")} b={P("c05p01", "Planning")} box={[416, 105, 86, 40]} />
                  <Box f={bf} a={P("c05p01", "Planning")} b={L("c05p02")} box={[528, 105, 108, 40]} />
                  <Note f={bf} a={P("c05p03", "An at sign")} b={L("c05p04")} x={308} y={560} w={640} text="@ links a client" />
                  <Note f={bf} a={P("c05p03", "A time makes")} b={L("c05p04")} x={308} y={650} w={640} text="15:00 makes a calendar block" />
                  <Note f={bf} a={P("c05p03", "An exclamation")} b={L("c05p04")} x={308} y={740} w={640} text="! sets the horizon or priority" />
                  <Cursor
                    f={bf}
                    path={[
                      [pick - 22, 1000, 600],
                      [pick - 3, 600, 380],
                      [dayClick - 16, 760, 470],
                      [dayClick - 3, 899, 392],
                    ]}
                    clicks={[pick, dayClick]}
                    show={[pick - 24, dayClick + 30]}
                  />
                </>
              }
            >
              <TasksInbox selected={bf >= pick ? 1 : 0} typed={typed} gone={bf >= dayClick + 4 ? 1 : null} />
            </Scr>
            <Keys
              f={bf}
              a={P("c05p02", "give it a day")}
              b={L("c05p03") - 2}
              keys={["T", "W", "M", "L"]}
              at={[P("c05p02", "Today."), P("c05p02", "Week."), P("c05p02", "Month."), P("c05p02", "Or Later")]}
            />
            <Keys f={bf} a={P("c05p03", "To capture") - 4} b={t0 + 20} keys={["C"]} at={[P("c05p03", "press C")]} />
            <Keys f={bf} a={t1 - 14} b={t1 + 30} keys={["Enter"]} at={[t1]} />
          </>
        );
      },
    },
    {
      at: L("c05p05") - 8,
      node: (bf) => (
        <>
          <Scr
            cam={camPath(bf, [
              [L("c05p05"), cam(960, 540, 0.98)],
              [P("c05p05", "Each task carries") - 6, cam(700, 330, 1.45)],
              [P("c05p05", "Filter by client") - 8, cam(1180, 260, 1.4)],
              [E("c05p05"), cam(960, 540, 1)],
            ])}
            over={
              <Callouts
                f={bf}
                items={[
                  { a: P("c05p05", "beside your calendar"), b: P("c05p05", "Each task carries"), box: [1333, 163, 557, 887], label: "Your calendar", side: "left" },
                  { a: P("c05p05", "Each task carries"), b: P("c05p05", "Filter by client"), box: [359, 311, 384, 22], label: "Age · time · how long", side: "bottom" },
                  { a: P("c05p05", "Filter by client"), b: E("c05p05") + 20, box: [1194, 163, 114, 34], label: "Filter by client", side: "bottom" },
                ]}
              />
            }
          >
            <TasksToday />
          </Scr>
          <Keys f={bf} a={P("c05p05", "Undo with") - 4} b={E("c05p05") + 24} keys={["Ctrl", "Z"]} at={[P("c05p05", "Control"), P("c05p05", "Control") + 6]} />
        </>
      ),
    },
    {
      at: L("c05p06") - 8,
      node: (bf) => (
        <Scr
          cam={camPath(bf, [
            [L("c05p06"), cam(1000, 540, 1.02)],
            [P("c05p06", "Then today") - 4, cam(800, 520, 1.1)],
            [startDay - 20, cam(700, 760, 1.3)],
          ])}
          over={
            <>
              <Callouts
                f={bf}
                items={[
                  { a: P("c05p06", "First, yesterday"), b: P("c05p06", "Then today"), box: [330, 160, 420, 240], label: "Yesterday, as it went", side: "right" },
                  { a: P("c05p06", "with a ring"), b: P("c05p06", "Clear the Inbox"), box: [398, 205, 280, 280], label: "Already spoken for", side: "right" },
                  { a: P("c05p06", "Clear the Inbox"), b: startDay - 4, box: [852, 100, 222, 950], label: "Inbox clear", side: "right" },
                ]}
              />
              <Cursor f={bf} path={[[startDay - 30, 900, 900], [startDay - 3, 540, 1012]]} clicks={[startDay]} show={[startDay - 32, startDay + 40]} />
            </>
          }
        >
          <PlanTheDay step={bf >= P("c05p06", "Then today") ? 1 : 0} startPressed={press(bf, startDay)} />
        </Scr>
      ),
    },
    {
      at: L("c05p07") - 8,
      node: (bf) => (
        <Scr
          cam={camPath(bf, [
            [L("c05p07"), cam(1100, 560, 1.0)],
            [E("c05p07") + 10, cam(1000, 520, 1.06)],
          ])}
          over={
            <>
              <Box f={bf} a={P("c05p07", "as a board")} b={P("c05p07", "Inbox,")} box={[308, 163, 142, 34]} />
              {colWords.map((w, i) => (
                <Box key={w} f={bf} a={P("c05p07", w)} b={i < 6 ? P("c05p07", colWords[i + 1]) + 4 : E("c05p07") + 8} box={[cols[i], 215, 216, 835]} />
              ))}
              <Box f={bf} a={E("c05p07") + 12} box={[536, 215, 216, 835]} gold />
            </>
          }
        >
          <Planning />
        </Scr>
      ),
    },
  ];
};

// ---------------------------------------------------------------------------
const ch6 = (): Shot[] => {
  const { L, P, E } = mk(6);
  const openF = P("c06p03", "open Filters");
  const alertG = P("c06p03", "then Alert");
  const hasA = P("c06p03", "then Has alert");
  const { S } = mk(6);
  S("click", openF);
  S("chip", hasA);
  S("alert", P("c06p04", "SLA breach") - 6, -6);
  S("tick", P("c06p04", "Alerts clear by themselves") + 4, -4);
  S("stamp", P("c06p05", "Contact late"), -4);
  ["Day zero", "Day one", "Day three", "Day seven", "Day twelve"].forEach((x) => S("tick", P("c06p06", x), -8));
  return [
    {
      at: 0,
      node: (bf) => {
        const hi = step<string | null>(bf, [
          [0, null],
          [P("c06p01", "Search client"), "search"],
          [P("c06p01", "Filters."), "filters"],
          [P("c06p01", "Closed window"), null],
        ]);
        return (
          <Scr
            cam={camPath(bf, [
              [0, cam(960, 540, 0.98)],
              [L("c06p00") + 8, cam(760, 240, 1.4)],
              [L("c06p01") - 6, cam(760, 200, 1.6)],
            ])}
            over={
              <Callouts
                f={bf}
                items={[
                  { a: P("c06p00", "New Business"), b: P("c06p00", "Client Growth"), box: [308, 105, 123, 40], label: "Clients not funded yet", side: "bottom" },
                  { a: P("c06p00", "Client Growth"), b: P("c06p00", "And your Sales plan"), box: [458, 105, 118, 40], label: "New money, funded clients", side: "bottom" },
                  { a: P("c06p00", "And your Sales plan"), b: L("c06p01"), box: [604, 105, 88, 40], label: "Your plan", side: "bottom" },
                ]}
              />
            }
          >
            <PipelineBoard hi={hi} />
          </Scr>
        );
      },
    },
    {
      at: P("c06p01", "Closed window") - 6,
      node: (bf) => (
        <Scr
          cam={camPath(bf, [
            [P("c06p01", "Closed window"), cam(1140, 330, 1.25)],
            [P("c06p01", "And Board or Table") - 8, cam(1140, 330, 1.25)],
          ])}
          over={
            <Callouts
              f={bf}
              items={[
                { a: P("c06p01", "Closed window") + 4, b: P("c06p01", "Views."), box: [580, 212, 360, 276], label: "How far back closed deals stay", side: "bottom" },
                { a: P("c06p01", "Views."), b: P("c06p01", "Sort."), box: [1348, 212, 360, 276], label: "Saved views", side: "bottom" },
                { a: P("c06p01", "Sort."), b: P("c06p01", "And Board or Table") + 8, box: [964, 212, 360, 276], label: "Sort", side: "bottom" },
              ]}
            />
          }
        >
          <PipelineMenus />
        </Scr>
      ),
    },
    {
      at: P("c06p01", "And Board or Table") - 4,
      node: (bf) => (
        <Scr cam={camPath(bf, [[P("c06p01", "And Board or Table"), cam(1480, 230, 1.6)]])} over={<Box f={bf} a={P("c06p01", "And Board or Table") + 4} box={[1735, 160, 156, 36]} />}>
          <PipelineBoard start={SETTLED} />
        </Scr>
      ),
    },
    {
      at: L("c06p02") - 8,
      node: (bf) => {
        const pick = step<string | null>(bf, [
          [0, null],
          [P("c06p02", "Overdue."), "Overdue"],
          [P("c06p02", "Due this week"), "Due this week"],
          [P("c06p02", "No contact in thirty"), "No contact 30d+"],
          [P("c06p02", "With amount"), "With amount"],
          [L("c06p03"), null],
          [hasA, "Has alert"],
        ]);
        const fg = step<string | null>(bf, [
          [0, "Focus"],
          [L("c06p03"), null],
          [alertG, "Alert"],
        ]);
        return (
          <Scr
            cam={camPath(bf, [
              [L("c06p02"), cam(1080, 280, 1.5)],
              [L("c06p03") - 6, cam(1050, 330, 1.25)],
              [P("c06p03", "Save it under Views") - 8, cam(980, 300, 1.3)],
            ])}
            over={
              <>
                <Callouts
                  f={bf}
                  items={[
                    { a: P("c06p02", "The fastest filters"), b: L("c06p03"), box: [793, 218, 488, 32], label: "Focus chips", side: "bottom" },
                    { a: P("c06p03", "Overdue actions are included"), b: P("c06p03", "Save it under Views"), box: [935, 351, 128, 28], label: "Included", side: "bottom" },
                    { a: P("c06p03", "Save it under Views"), box: [876, 160, 88, 36], label: "Save it as a view", side: "left", gold: true },
                  ]}
                />
                <Cursor
                  f={bf}
                  path={[
                    [openF - 22, 760, 560],
                    [openF - 3, 607, 178],
                    [alertG - 3, 632, 330],
                    [hasA - 3, 929, 330],
                    [P("c06p03", "Save it under Views") + 4, 920, 180],
                  ]}
                  clicks={[openF, hasA]}
                  show={[openF - 24, E("c06p03") + 20]}
                />
              </>
            }
          >
            <FiltersPanel pick={pick} focusGroup={fg} />
          </Scr>
        );
      },
    },
    {
      at: L("c06p04") - 8,
      node: (bf) => {
        const p = (x: string) => P("c06p04", x);
        return (
          <>
            {plate("f06", 0.76)}
            <AlertsMap
              f={bf}
              a={L("c06p04")}
              at={[
                [p("SLA breach"), p("Stopped responding"), p("Funding not arriving"), p("and Qualification missing")],
                [p("Lead untouched"), p("Action overdue"), p("Rescheduled repeatedly"), p("Check contact details"), p("and Back from Lost")],
                [p("Suspected duplicate")],
              ]}
              clearAt={p("Alerts clear by themselves")}
              stayAt={p("Back from Lost stays")}
            />
          </>
        );
      },
    },
    {
      at: L("c06p05") - 8,
      node: (bf) => (
        <>
          {plate("f06", 0.78)}
          <SlaClock f={bf} a={L("c06p05")} inbound={P("c06p05", "Inbound leads")} example={P("c06p05", "Assigned Friday")} outbound={P("c06p05", "Outbound:")} late={P("c06p05", "Contact late")} />
        </>
      ),
    },
    {
      at: L("c06p06") - 8,
      node: (bf) => (
        <>
          {plate("f06", 0.78)}
          <Cadence f={bf} a={L("c06p06")} at={["Day zero", "Day one", "Day three", "Day seven", "Day twelve"].map((x) => P("c06p06", x))} decide={P("c06p06", "Then decide")} />
        </>
      ),
    },
  ];
};

// ---------------------------------------------------------------------------
const ch7 = (): Shot[] => {
  const { L, P, E } = mk(7);
  const nb = NB_STAGES.slice(0, 8);
  const nbAt = ["New Opportunity,", "Contact Established,", "Qualified,", "Solution Presented,", "Onboarding,", "Funding Pending,", "Funded and", "Won."].map((x) => P("c07p01", x));
  const mv = (x: string) => P("c07p02", x);
  const { S } = mk(7);
  ["A reply", "A submitted application", "a passed KYC", "and arriving money", "You move the stages"].forEach((x) => S("chip", mv(x), -8));
  return [
    {
      at: 0,
      node: (bf) => (
        <Scr
          cam={camPath(bf, [
            [0, cam(960, 540, 0.98)],
            [P("c07p00", "with its count") - 10, cam(640, 330, 1.55)],
          ])}
          over={<Callouts f={bf} items={[{ a: P("c07p00", "with its count"), box: [308, 215, 252, 58], label: "Count · total expected deposit", side: "right" }]} />}
        >
          <PipelineBoard />
        </Scr>
      ),
    },
    {
      at: L("c07p01") - 8,
      node: (bf) => (
        <>
          {plate("f07", 0.78)}
          <StageFlow
            f={bf}
            a={L("c07p01")}
            title="New Business · who moves each stage"
            stages={nb}
            at={nbAt}
            side={{ labels: ["Lost", "On Hold"], at: P("c07p01", "Lost and On Hold") }}
            movers={[
              null,
              { kind: "auto", how: "Reply · call over 10 s · accepted invite" },
              { kind: "you", how: "Your judgement" },
              { kind: "you", how: "Your judgement" },
              { kind: "auto", how: "Application submitted" },
              { kind: "auto", how: "KYC passed" },
              { kind: "auto", how: "Money arrives", lock: true },
              { kind: "auto", how: "Deposits reach the expected deposit", lock: true },
            ]}
            moverAt={[0, mv("A reply"), mv("You move the stages"), mv("You move the stages") + 6, mv("A submitted application"), mv("a passed KYC"), mv("and arriving money"), mv("every Won")]}
          />
        </>
      ),
    },
    {
      at: L("c07p03") - 8,
      node: (bf) => (
        <Scr
          cam={camPath(bf, [
            [L("c07p03"), cam(960, 420, 1.3)],
            [P("c07p03", "How long in this stage") - 6, cam(960, 360, 2.0)],
          ])}
          over={
            <Callouts
              f={bf}
              items={[
                { a: P("c07p03", "How long in this stage"), b: P("c07p03", "How much money") + 30, box: [848, 344, 80, 20], label: "In this stage", side: "left" },
                { a: P("c07p03", "How long since contact"), b: P("c07p03", "How much money") + 30, box: [946, 344, 116, 20], label: "Since contact", side: "right" },
                { a: P("c07p03", "How much money"), b: P("c07p03", "Days in stage turns"), box: [848, 368, 98, 20], label: "Expected deposit", side: "left" },
                { a: P("c07p03", "turns bold"), box: [848, 344, 80, 20], label: "Bold = late", side: "left", gold: true },
              ]}
            />
          }
        >
          <PipelineBoard start={SETTLED} focusId="d6" />
        </Scr>
      ),
    },
    {
      at: L("c07p04") - 8,
      node: (bf) => (
        <Scr
          cam={camPath(bf, [
            [L("c07p04"), cam(1100, 440, 1.15)],
            [P("c07p04", "The next stage action") - 6, cam(1300, 420, 1.45)],
            [P("c07p04", "The first contact column") - 6, cam(1450, 470, 1.35)],
          ])}
          over={
            <Callouts
              f={bf}
              items={[
                { a: P("c07p04", "in violet"), b: P("c07p04", "The first contact column"), box: [1170, 270, 278, 44], label: "Violet = still a suggestion", side: "bottom" },
                { a: P("c07p04", "The first contact column"), box: [1449, 228, 190, 427], label: "Met · Late · Overdue · due date", side: "bottom" },
              ]}
            />
          }
        >
          <PipelineTable hiCol={bf >= P("c07p04", "The first contact column") ? "sla" : "next"} />
        </Scr>
      ),
    },
    {
      at: L("c07p05") - 8,
      node: (bf) => {
        const yu = P("c07p05", "You move every one");
        return (
          <>
            {plate("f07", 0.78)}
            <StageFlow
              f={bf}
              a={L("c07p05")}
              title="Client Growth · its own stages"
              stages={["Discovery", "Validation", "Negotiation", "Approval", "In Progress", "Funded", "Won"]}
              at={["Discovery,", "Validation,", "Negotiation,", "Approval,", "In Progress,", "Funded and", "Won."].map((x) => P("c07p05", x))}
              movers={[{ kind: "you" }, { kind: "you" }, { kind: "you" }, { kind: "you" }, { kind: "you" }, { kind: "you" }, null]}
              moverAt={[yu, yu + 4, yu + 8, yu + 12, yu + 16, yu + 20, 0]}
            />
          </>
        );
      },
    },
  ];
};

// ---------------------------------------------------------------------------
const ch8 = (): Shot[] => {
  const { L, P, E } = mk(8);
  const acc = P("c08p04", "Accept the next action") + 10;
  const lp = (x: string) => P("c08p02", x);
  const nextPanel = cam(1570, 510, 1.7);
  const done = P("c08p05", "Complete and move") + 14;
  const addTask = P("c08p07", "Add an ordinary task") + 6;
  const { S } = mk(8);
  S("click", acc);
  S("confirm", acc + 3, -2);
  S("shimmer", acc + 12, -4);
  S("click", done);
  S("confirm", done + 3, -6);
  S("click", addTask);
  S("shimmer", L("c08p09") + 2, -4);
  return [
    {
      at: 0,
      node: (bf) => {
        const na = step<"suggested" | "editing" | "accepted">(bf, [
          [0, "suggested"],
          [P("c08p03", "Change the words"), "editing"],
          [P("c08p03", "Then accept it"), "suggested"],
          [acc + 3, "accepted"],
        ]);
        return (
          <>
            <Scr
              cam={camPath(bf, [
                [0, cam(960, 540, 0.98)],
                [L("c08p01") - 4, cam(800, 230, 1.35)],
                [L("c08p02") - 6, cam(820, 540, 1.1)],
                [lp("On the right") - 6, cam(1150, 560, 1.1)],
                [L("c08p03") - 6, nextPanel],
                [acc + 20, nextPanel],
                [E("c08p04") + 20, cam(1450, 520, 1.35)],
              ])}
              over={
                <>
                  <Callouts
                    f={bf}
                    items={[
                      { a: P("c08p01", "Northstar"), b: L("c08p02"), box: [308, 100, 450, 42], label: "A training deal", side: "bottom" },
                      { a: P("c08p01", "at Contact Established"), b: L("c08p02"), box: [507, 158, 192, 39], label: "Stage", side: "bottom" },
                      { a: P("c08p01", "with an expected deposit"), b: L("c08p02"), box: [331, 333, 140, 50], label: "Expected deposit", side: "bottom" },
                      { a: lp("the stage"), b: lp("On the right"), box: [308, 158, 1583, 39], label: "1 Stage", side: "bottom" },
                      { a: lp("the money"), b: lp("On the right"), box: [308, 279, 923, 174], label: "2 Money", side: "left" },
                      { a: lp("the account lifecycle"), b: lp("On the right"), box: [308, 471, 923, 107], label: "3 Lifecycle", side: "left" },
                      { a: lp("and qualification"), b: lp("On the right"), box: [308, 596, 923, 163], label: "4 Qualification", side: "left" },
                      { a: lp("About this deal"), b: L("c08p03"), box: [1252, 279, 639, 121], label: "5 About this deal", side: "left" },
                      { a: lp("the next stage action"), b: L("c08p03"), box: [1252, 418, 639, 179], label: "6 Next stage action", side: "left" },
                      { a: lp("the blocker"), b: L("c08p03"), box: [1252, 615, 639, 88], label: "7 Blocker", side: "left" },
                      { a: lp("and the latest notes"), b: L("c08p03"), box: [1252, 721, 639, 329], label: "8 Latest notes", side: "left" },
                      { a: P("c08p03", "SalesMind suggests it"), b: P("c08p03", "Change the words"), box: [1275, 466, 340, 32], label: "Suggested · violet", side: "bottom" },
                    ]}
                  />
                  <Note f={bf} a={acc + 10} b={L("c08p05")} x={1275} y={612} w={420} text="Now your task" sub="Due Day 3 (Wed)" gold />
                  <Cursor f={bf} path={[[P("c08p03", "Then accept it") - 30, 1500, 700], [acc - 3, 1319, 556]]} clicks={[acc]} show={[P("c08p03", "Then accept it") - 32, acc + 40]} />
                </>
              }
            >
              <DealPage na={na} acceptPress={press(bf, acc)} />
            </Scr>
            <Principle f={bf} a={acc + 12} b={L("c08p05") - 2} text="Every active deal has exactly one next action." gold />
          </>
        );
      },
    },
    {
      at: L("c08p05") - 8,
      node: (bf) => (
        <Scr
          cam={camPath(bf, [
            [L("c08p05"), cam(960, 540, 1.12)],
            [done - 20, cam(1100, 680, 1.35)],
          ])}
          over={
            <>
              <Callouts
                f={bf}
                items={[
                  { a: P("c08p05", "Say what happened"), b: P("c08p05", "Add a note"), box: [611, 360, 698, 84], label: "What happened", side: "left" },
                  { a: P("c08p05", "Add a note"), b: P("c08p05", "Set the next action"), box: [611, 584, 698, 50], label: "Note · optional", side: "left" },
                  { a: P("c08p05", "Set the next action"), box: [611, 680, 698, 50], label: "Never without one", side: "left", gold: true },
                ]}
              />
              <Cursor f={bf} path={[[done - 30, 1300, 900], [done - 3, 1177, 774]]} clicks={[done]} show={[done - 32, done + 30]} />
            </>
          }
        >
          <CompleteDialog press={press(bf, done)} />
        </Scr>
      ),
    },
    {
      at: L("c08p06") - 8,
      node: (bf) => (
        <Scr
          cam={camPath(bf, [[L("c08p06"), cam(960, 520, 1.25)]])}
          over={<Callouts f={bf} items={[{ a: P("c08p06", "It is a reminder"), box: [611, 380, 698, 78], label: "A reminder, not a wall", side: "left", gold: true }]} />}
        >
          <MoveDialog />
        </Scr>
      ),
    },
    {
      at: L("c08p07") - 8,
      node: (bf) => (
        <Scr
          cam={camPath(bf, [[L("c08p07"), cam(1500, 520, 1.5)]])}
          over={
            <>
              <Cursor f={bf} path={[[addTask - 26, 1500, 760], [addTask - 3, 1810, 556]]} clicks={[addTask]} show={[addTask - 28, E("c08p07") + 20]} />
              <Note f={bf} a={addTask + 6} x={1300} y={640} w={420} text="An ordinary task" sub="Not the deal's next step" />
            </>
          }
        >
          <DealPage start={SETTLED} na="accepted" />
        </Scr>
      ),
    },
    {
      at: L("c08p08") - 8,
      node: (bf) => {
        const over = P("c08p08", "It is over");
        return (
          <Scr
            cam={camPath(bf, [
              [L("c08p08"), cam(660, 540, 1.3)],
              [over - 6, cam(1270, 540, 1.3)],
            ])}
            over={
              <>
                <Spot f={bf} a={L("c08p08")} b={over} box={[342, 337, 600, 405]} />
                <Spot f={bf} a={over} box={[978, 358, 600, 363]} />
                <Callouts
                  f={bf}
                  items={[
                    { a: P("c08p08", "with a reason"), b: over, box: [371, 446, 500, 118], label: "A reason", side: "top" },
                    { a: P("c08p08", "if you can"), b: over, box: [371, 607, 542, 50], label: "Follow-up date · optional", side: "bottom" },
                    { a: P("c08p08", "pick the loss reason"), box: [1007, 459, 542, 50], label: "Pick with care", side: "top", gold: true },
                    { a: P("c08p08", "and write why"), box: [1007, 553, 542, 84], label: "Write why", side: "bottom" },
                  ]}
                />
                <Note f={bf} a={P("c08p08", "The reason goes")} x={1240} y={800} w={330} text="Goes to the CRM" />
              </>
            }
          >
            <HoldCloseDialogs />
          </Scr>
        );
      },
    },
    {
      at: L("c08p09") - 8,
      node: (bf) => (
        <>
          <Scr cam={camPath(bf, [[L("c08p09"), cam(1450, 520, 1.3)], [E("c08p09") + 30, nextPanel]])}>
            <DealPage start={SETTLED} na="accepted" />
          </Scr>
          <Principle f={bf} a={L("c08p09") + 2} text="Never leave an important deal without a next move." />
        </>
      ),
    },
  ];
};

// ---------------------------------------------------------------------------
const ch9 = (): Shot[] => {
  const { L, P, E } = mk(9);
  const create = P("c09p01", "click Create deal") + 10;
  const ty = P("c09p01", "Type three");
  const pickM = P("c09p01", "Pick Meridian");
  const submit = E("c09p01") - 2;
  const { S } = mk(9);
  S("click", create);
  S("click", pickM);
  S("click", submit);
  S("confirm", submit + 3, -6);
  S("alert", P("c09p03", "If the client already") + 20, -8);
  return [
    {
      at: 0,
      node: (bf) => (
        <Scr
          cam={camPath(bf, [
            [0, cam(960, 540, 0.98)],
            [create - 20, cam(1600, 200, 1.5)],
          ])}
          over={<Cursor f={bf} path={[[create - 26, 1500, 420], [create - 3, 1823, 123]]} clicks={[create]} show={[create - 28, create + 20]} />}
        >
          <ClientGrowthBoard hi={bf >= create - 10 ? "create" : null} />
        </Scr>
      ),
    },
    {
      at: create + 8,
      node: (bf) => {
        const typed = bf < ty + 6 ? "" : bf < ty + 12 ? "M" : bf < ty + 18 ? "Me" : "Mer";
        return (
          <Scr
            cam={camPath(bf, [
              [create + 8, cam(960, 420, 1.3)],
              [P("c09p01", "Brokerage, or White") - 8, cam(960, 600, 1.3)],
            ])}
            over={
              <>
                <Callouts
                  f={bf}
                  items={[
                    { a: ty + 4, b: pickM, box: [611, 351, 698, 50], label: "Three letters or more", side: "left" },
                    { a: pickM, b: P("c09p01", "Brokerage, or White"), box: [611, 419, 698, 45], label: "Pick the client", side: "left" },
                    { a: P("c09p01", "Brokerage, or White"), b: P("c09p01", "Add the expected"), box: [611, 520, 234, 34], label: "Brokerage · White label", side: "left" },
                    { a: P("c09p01", "Add the expected"), box: [611, 600, 340, 50], label: "If you know it", side: "left" },
                  ]}
                />
                <Cursor f={bf} path={[[pickM - 20, 1100, 560], [pickM - 3, 760, 442], [submit - 3, 1247, 783]]} clicks={[pickM, submit]} show={[pickM - 22, submit + 20]} />
              </>
            }
          >
            <CreateDeal typed={typed} picked={bf >= pickM} />
          </Scr>
        );
      },
    },
    {
      at: L("c09p02") - 8,
      node: (bf) => {
        const dup = P("c09p03", "If the client already");
        const g = prog(bf, dup, 14);
        const gOut = prog(bf, dup + 50, 14);
        return (
          <Scr
            cam={camPath(bf, [[L("c09p02"), cam(960, 420, 1.15)]])}
            over={
              <>
                <Callouts f={bf} items={[{ a: P("c09p02", "A funded client gets"), b: dup, box: [308, 337, 1135, 100], label: "Discovery · suggested next action", side: "bottom" }]} />
                {g > 0 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: 308,
                      top: 452,
                      width: 1135,
                      height: 90,
                      borderRadius: 10,
                      border: `2px dashed ${C.gold}`,
                      background: "rgba(217,178,106,0.06)",
                      opacity: g * (1 - gOut * 0.85),
                      transform: `translateX(${Math.sin(Math.min(1, gOut * 3) * Math.PI * 3) * 10}px)`,
                      display: "flex",
                      alignItems: "center",
                      padding: "0 22px",
                      fontFamily: "Inter",
                      fontSize: 19,
                      color: C.muted,
                    }}
                  >
                    Meridian Family Office Demo · a second deal
                  </div>
                ) : null}
                <Note f={bf} a={dup + 40} x={708} y={570} w={520} text="One open deal per client" sub="Edit the existing deal instead" gold />
              </>
            }
          >
            <ClientGrowthBoard start={SETTLED} />
          </Scr>
        );
      },
    },
    {
      at: L("c09p04") - 8,
      node: (bf) => {
        const st = ["Discovery.", "Validation.", "Negotiation.", "Approval.", "In Progress.", "Funded."].map((x) => P("c09p04", x));
        return (
          <>
            {plate("f09", 0.78)}
            <StageFlow
              f={bf}
              a={L("c09p04")}
              title="Client Growth · you move it, Won follows"
              stages={["Discovery", "Validation", "Negotiation", "Approval", "In Progress", "Funded", "Won"]}
              at={[...st, P("c09p04", "Once deposits")]}
              movers={[null, { kind: "you" }, { kind: "you" }, { kind: "you" }, { kind: "you" }, { kind: "you" }, { kind: "auto", how: "Deposits reach the expected deposit" }]}
              moverAt={[0, st[1], st[2], st[3], st[4], st[5], P("c09p04", "Won is set")]}
            />
          </>
        );
      },
    },
  ];
};

// ---------------------------------------------------------------------------
const ch10 = (): Shot[] => {
  const { L, P, E } = mk(10);
  const own = P("c10p02", "check ownership") + 6;
  const v = (x: string) => P("c10p04", x);
  const { S } = mk(10);
  S("click", own);
  ["Available.", "Claimed.", "Restricted.", "Needs narrowing.", "Not found."].forEach((x) => S("drop", v(x), -6));
  S("alert", v("Do not approach"), -6);
  S("shimmer", L("c10p06") + 2, -4);
  return [
    {
      at: 0,
      node: (bf) => {
        const hi = step<string | null>(bf, [
          [0, null],
          [P("c10p01", "Quick filters"), "chips"],
          [P("c10p01", "Compact or detailed"), "density"],
          [P("c10p01", "Filters, columns"), "tools"],
          [L("c10p02"), "ownership"],
        ]);
        return (
          <Scr
            cam={camPath(bf, [
              [0, cam(960, 540, 0.98)],
              [L("c10p01") - 6, cam(1000, 300, 1.15)],
              [L("c10p02") - 6, cam(1560, 200, 1.6)],
            ])}
            over={
              <>
                <Callouts f={bf} items={[{ a: P("c10p01", "All, Clients"), b: P("c10p01", "Quick filters"), box: [308, 105, 215, 40], label: "All · Clients · Contacts", side: "bottom" }]} />
                <Cursor f={bf} path={[[own - 24, 1500, 400], [own - 3, 1649, 123]]} clicks={[own]} show={[own - 26, own + 20]} />
              </>
            }
          >
            <Clients hi={hi} />
          </Scr>
        );
      },
    },
    {
      at: L("c10p03") - 8,
      node: (bf) => {
        const shown = step<number>(bf, [
          [0, 0],
          [v("Available."), 1],
          [v("Claimed."), 2],
          [v("Restricted."), 3],
          [v("Needs narrowing."), 4],
          [v("Not found."), 5],
        ]);
        const focus = step<number | null>(bf, [
          [0, null],
          [v("Available."), 0],
          [v("Claimed."), 1],
          [v("Restricted."), 2],
          [v("Needs narrowing."), 3],
          [v("Not found."), 4],
          [L("c10p05"), null],
        ]);
        return (
          <>
            <Scr
              cam={camPath(bf, [
                [L("c10p03"), cam(1100, 260, 1.3)],
                [v("Available.") - 8, cam(1000, 470, 1.12)],
                [L("c10p05") - 6, cam(1600, 250, 1.6)],
                [L("c10p06"), cam(1100, 470, 1.08)],
              ])}
              over={
                <Callouts
                  f={bf}
                  items={[
                    { a: P("c10p03", "Search by full name"), b: P("c10p03", "One search returns"), box: [308, 163, 1489, 51], label: "Full name · exact email or phone · company domain", side: "bottom" },
                    { a: P("c10p03", "One search returns"), b: v("Available."), box: [1809, 163, 82, 51], label: "One verdict", side: "bottom" },
                    { a: v("Request reassignment"), b: v("Restricted."), box: [1662, 375, 206, 40], label: "If you have a case", side: "bottom" },
                    { a: v("Add the contact"), b: L("c10p05"), box: [1681, 608, 187, 38], label: "Assigned to you", side: "top" },
                    { a: L("c10p05"), box: [1750, 110, 145, 26], label: "100 a day", side: "bottom" },
                  ]}
                />
              }
            >
              <Ownership start={0} shown={shown} focus={focus} />
            </Scr>
            <Principle f={bf} a={v("Do not approach")} b={v("Needs narrowing.")} text="Restricted: do not approach." gold />
            <Principle f={bf} a={L("c10p06") + 2} text="Check ownership before approaching the contact." />
          </>
        );
      },
    },
  ];
};

// ---------------------------------------------------------------------------
const ch11 = (): Shot[] => {
  const { L, P, E } = mk(11);
  const openRow = P("c11p01", "Open an item") + 10;
  const raise = P("c11p02", "raise an issue") + 6;
  const submit = E("c11p02") - 20;
  const { S } = mk(11);
  S("click", openRow);
  S("click", raise);
  S("click", submit);
  S("confirm", submit + 3, -6);
  S("shimmer", P("c11p03", "If it is not"), -6);
  return [
    {
      at: 0,
      node: (bf) => (
        <Scr
          cam={camPath(bf, [
            [0, cam(960, 540, 0.98)],
            [P("c11p00", "Emails") - 6, cam(760, 400, 1.25)],
            [P("c11p00", "Topic tags") - 6, cam(1200, 320, 1.45)],
          ])}
          over={
            <>
              <Callouts f={bf} items={[{ a: P("c11p00", "Topic tags"), box: [1281, 219, 131, 22], label: "Topic tag", side: "bottom" }]} />
              <Cursor f={bf} path={[[openRow - 24, 1100, 500], [openRow - 3, 1160, 230]]} clicks={[openRow]} show={[openRow - 26, openRow + 12]} />
            </>
          }
        >
          <Activity typesOpen={bf >= P("c11p00", "Emails") - 4 && bf < P("c11p00", "Topic tags") - 4} hiRow={bf >= openRow - 4 ? 0 : null} />
        </Scr>
      ),
    },
    {
      at: openRow + 6,
      node: (bf) => (
        <>
          <Scr
            cam={camPath(bf, [
              [openRow + 6, cam(860, 540, 1.15)],
              [raise - 6, cam(1200, 540, 1.2)],
            ])}
            over={
              <>
                <Callouts
                  f={bf}
                  items={[
                    { a: P("c11p02", "Choose the category"), b: P("c11p02", "the meeting type"), box: [1084, 418, 501, 44], label: "Category", side: "left" },
                    { a: P("c11p02", "the meeting type"), b: P("c11p02", "and write a short"), box: [1084, 503, 501, 44], label: "Meeting type", side: "left" },
                    { a: P("c11p02", "and write a short"), b: E("c11p02") + 10, box: [1084, 595, 501, 79], label: "Short and factual", side: "left" },
                  ]}
                />
                <Cursor f={bf} path={[[raise - 26, 700, 860], [raise - 3, 923, 725], [submit - 3, 1519, 709]]} clicks={[raise, submit]} show={[raise - 28, submit + 20]} />
              </>
            }
          >
            <ActivityItem issue={bf >= raise + 2} />
          </Scr>
          <Note f={bf} a={P("c11p02", "The team reviews")} x={1180} y={860} w={560} text="Reviewed within 1 to 3 business days" />
        </>
      ),
    },
    {
      at: L("c11p03") - 8,
      node: (bf) => (
        <>
          <Scr cam={camPath(bf, [[L("c11p03"), cam(960, 420, 1.05)], [E("c11p03") + 20, cam(960, 400, 1.1)]])}>
            <Activity start={SETTLED} />
          </Scr>
          <Principle f={bf} a={P("c11p03", "If it is not")} text="If it is not in the record, nobody else can see it." />
        </>
      ),
    },
  ];
};

// ---------------------------------------------------------------------------
const ch12 = (): Shot[] => {
  const { L, P, E } = mk(12);
  const tabs: [string, [number, number, number, number]][] = [
    ["NAV milestones", [308, 105, 138, 40]],
    ["Pipeline.", [474, 105, 68, 40]],
    ["Funding.", [570, 105, 69, 40]],
    ["Standing.", [667, 105, 77, 40]],
    ["Conversion.", [772, 105, 98, 40]],
    ["Communication.", [898, 105, 135, 40]],
  ];
  return [
    {
      at: 0,
      node: (bf) => (
        <Scr
          cam={camPath(bf, [
            [0, cam(960, 540, 0.98)],
            [P("c12p00", "six sections") - 6, cam(700, 220, 1.6)],
            [L("c12p01") - 6, cam(1500, 200, 1.5)],
            [P("c12p01", "NAV milestones follow") - 6, cam(1100, 640, 1.12)],
            [L("c12p02") - 6, cam(760, 260, 1.4)],
          ])}
          over={
            <>
              {tabs.map(([w, box], i) => (
                <Box key={w} f={bf} a={P("c12p00", w)} b={i < 5 ? P("c12p00", tabs[i + 1][0]) + 4 : L("c12p01")} box={box} />
              ))}
              <Callouts
                f={bf}
                items={[
                  { a: P("c12p01", "The period filter"), b: P("c12p01", "NAV milestones follow"), box: [1631, 106, 260, 34], label: "This month to all time", side: "bottom" },
                  { a: P("c12p01", "own liquid NAV"), b: L("c12p02"), box: [333, 360, 1534, 300], label: "Month 3 own · then total at 6, 12, 24, 36", side: "top" },
                  { a: L("c12p02"), box: [308, 163, 782, 138], label: "Synthetic figures", side: "bottom", gold: true },
                ]}
              />
            </>
          }
        >
          <Performance />
        </Scr>
      ),
    },
  ];
};

// ---------------------------------------------------------------------------
const ch13 = (): Shot[] => {
  const { L, P, E } = mk(13);
  const panels: [string, [number, number, number, number]][] = [
    ["Sales Plan Progress", [841, 260, 517, 73]],
    ["Entries Requiring", [1373, 260, 518, 73]],
    ["Forecasted NAV", [308, 349, 518, 73]],
    ["plan against reality", [841, 349, 517, 73]],
    ["and plan history", [1373, 349, 518, 73]],
  ];
  return [
    {
      at: 0,
      node: (bf) => (
        <>
          <Scr
            cam={camPath(bf, [
              [0, cam(960, 540, 0.98)],
              [L("c13p01") - 6, cam(760, 220, 1.5)],
              [L("c13p02") - 6, cam(1500, 220, 1.5)],
              [P("c13p02", "Be specific") - 10, cam(1300, 560, 1.3)],
            ])}
            over={
              <Callouts
                f={bf}
                items={[
                  { a: P("c13p01", "Your sales plan lives"), b: L("c13p02"), box: [602, 105, 90, 40], label: "Inside the Pipeline", side: "bottom" },
                  { a: P("c13p02", "Add an entry"), b: P("c13p02", "create the contact"), box: [1343, 103, 124, 40], label: "Add entry", side: "bottom" },
                  { a: P("c13p02", "create the contact"), b: P("c13p02", "or link the CRM"), box: [1478, 103, 150, 40], label: "Create the contact", side: "bottom" },
                  { a: P("c13p02", "or link the CRM"), b: P("c13p02", "or a written reason"), box: [1639, 103, 106, 40], label: "Link the CRM record", side: "bottom" },
                  { a: P("c13p02", "or a written reason"), b: P("c13p02", "Be specific"), box: [1756, 103, 135, 40], label: "A written reason", side: "bottom" },
                  { a: P("c13p02", "Be specific"), box: [1160, 518, 720, 46], label: "Specific", side: "bottom", gold: true },
                ]}
              />
            }
          >
            <SalesPlan />
          </Scr>
          <Note f={bf} a={P("c13p02", "N slash A")} x={1180} y={820} w={480} text={'"N/A" is not a reason'} gold />
        </>
      ),
    },
    {
      at: L("c13p03") - 8,
      node: (bf) => (
        <>
          {plate("f13", 0.78)}
          <TenDays f={bf} a={L("c13p03")} mark={P("c13p03", "It is a compliance")} />
        </>
      ),
    },
    {
      at: L("c13p04") - 8,
      node: (bf) => (
        <>
          {plate("f13", 0.8)}
          <Link2 f={bf} a={L("c13p04")} left={["Sales plan entry", "Linked to CRM-DEMO-001"]} right={["Deal on the board", "Origin: Sales Plan"]} label="appears at once" />
        </>
      ),
    },
    {
      at: P("c13p04", "Filter by origin") - 6,
      node: (bf) => (
        <Scr cam={camPath(bf, [[P("c13p04", "Filter by origin"), cam(960, 500, 1.4)]])}>
          <FiltersPanel focusGroup="Origin" pick={bf >= P("c13p04", "Filter by origin") + 10 ? "Sales Plan" : null} />
        </Scr>
      ),
    },
    {
      at: P("c13p04", "Sales Plan Progress") - 6,
      node: (bf) => (
        <Scr
          cam={camPath(bf, [[P("c13p04", "Sales Plan Progress"), cam(1100, 320, 1.3)]])}
          over={
            <>
              {panels.map(([w, box], i) => (
                <Box key={w} f={bf} a={P("c13p04", w)} b={i < 4 ? P("c13p04", panels[i + 1][0]) + 6 : undefined} box={box} />
              ))}
            </>
          }
        >
          <SalesPlan start={SETTLED} />
        </Scr>
      ),
    },
  ];
};

// ---------------------------------------------------------------------------
const ch14 = (): Shot[] => {
  const { L, P, E } = mk(14);
  const del = P("c14p03", "Deleting");
  const { S } = mk(14);
  S("swipe", del + 4, -6);
  return [
    {
      at: 0,
      node: (bf) => {
        const s = step<number>(bf, [
          [0, 0],
          [P("c14p01", "Pick your work"), 1],
          [P("c14p01", "continue, select"), 2],
          [P("c14p01", "select all"), 3],
          [P("c14p01", "continue."), 4],
        ]);
        return (
          <Scr cam={camPath(bf, [[0, cam(960, 540, 1.32)], [L("c14p01"), cam(960, 540, 1.5)]])}>
            <GooglePermission step={s} />
          </Scr>
        );
      },
    },
    {
      at: L("c14p02") - 8,
      node: (bf) => {
        const d = prog(bf, del + 6, 18);
        return (
          <>
            <Scr
              cam={camPath(bf, [
                [L("c14p02"), cam(1400, 520, 1.25)],
                [P("c14p02", "a separate calendar") - 6, cam(1550, 330, 1.5)],
                [P("c14p02", "Colleagues") - 6, cam(1450, 500, 1.2)],
                [del - 8, cam(1100, 480, 1.08)],
                [L("c14p04"), cam(960, 540, 1)],
              ])}
              over={
                <>
                  <Callouts
                    f={bf}
                    items={[
                      { a: P("c14p02", "your real meetings"), b: P("c14p02", "A task with a time"), box: [1411, 279, 456, 32], label: "Your meetings", side: "bottom" },
                      { a: P("c14p02", "A task with a time"), b: P("c14p02", "a separate calendar"), box: [1411, 351, 456, 32], label: "A timed task becomes a block", side: "bottom" },
                      { a: P("c14p02", "a separate calendar"), b: P("c14p02", "Colleagues"), box: [1612, 178, 262, 22], label: "SalesMind Tasks calendar", side: "bottom" },
                    ]}
                  />
                  {d > 0 ? (
                    <>
                      <div style={{ position: "absolute", left: 308, top: 441, width: 1002, height: 72, borderRadius: 10, background: C.panel, opacity: d * 0.85 }} />
                      <div style={{ position: "absolute", left: 1405, top: 455, width: 468, height: 40, borderRadius: 6, background: C.panel, opacity: d * 0.92 }} />
                      <div style={{ position: "absolute", left: 330, top: 476, width: 950 * prog(bf, del, 12), height: 2, background: C.gold }} />
                    </>
                  ) : null}
                </>
              }
            >
              <TasksToday />
            </Scr>
            <Note f={bf} a={P("c14p02", "Colleagues")} b={P("c14p02", "A meeting you create")} x={1160} y={820} w={560} text="Colleagues looking for a slot don't see it" />
            <Note f={bf} a={P("c14p02", "A meeting you create")} b={L("c14p03")} x={1160} y={820} w={560} text="A meeting you create goes to your main calendar" />
            <Note f={bf} a={del + 18} b={L("c14p04") + 10} x={700} y={820} w={520} text="Its calendar block goes too" />
          </>
        );
      },
    },
  ];
};

// ---------------------------------------------------------------------------
const ch15 = (): Shot[] => {
  const { L, P, E } = mk(15);
  const rq = (x: string) => P("c15p03", x);
  const { S } = mk(15);
  S("shimmer", P("c15p01", "Use the latest"), -6);
  S("swipe", rq("Open requests on a client") + 14, -8);
  return [
    {
      at: 0,
      node: (bf) => (
        <Scr
          cam={camPath(bf, [[0, cam(960, 540, 0.98)], [P("c15p00", "twenty short pages") - 6, cam(1000, 360, 1.18)]])}
          over={
            <>
              <Callouts f={bf} items={[{ a: P("c15p00", "twenty short pages"), box: [308, 100, 560, 64], label: "Twenty short pages", side: "bottom" }]} />
              <Box f={bf} a={P("c15p00", "from the new pipeline")} box={[308, 203, 772, 30]} />
              <Box f={bf} a={P("c15p00", "to the cheat sheet")} box={[1120, 511, 771, 30]} />
              <Box f={bf} a={P("c15p00", "and glossary")} box={[1120, 547, 771, 30]} />
            </>
          }
        >
          <Guidebook />
        </Scr>
      ),
    },
    {
      at: L("c15p01") - 8,
      node: (bf) => (
        <>
          <Scr
            cam={camPath(bf, [[L("c15p01"), cam(1100, 360, 1.15)]])}
            over={
              <Callouts
                f={bf}
                items={[
                  { a: P("c15p01", "the current playbooks"), b: P("c15p01", "battle cards"), box: [708, 267, 383, 148], label: "Playbook", side: "bottom" },
                  { a: P("c15p01", "battle cards"), box: [308, 433, 1183, 148], label: "Battle cards", side: "bottom" },
                ]}
              />
            }
          >
            <Materials />
          </Scr>
          <Principle f={bf} a={P("c15p01", "Use the latest")} text="Use the latest version in every client conversation." />
        </>
      ),
    },
    {
      at: L("c15p02") - 8,
      node: (bf) => (
        <Scr cam={camPath(bf, [[L("c15p02"), cam(900, 300, 1.35)]])} over={<Callouts f={bf} items={[{ a: L("c15p02") + 4, box: [308, 100, 1100, 211], label: "What changed", side: "bottom" }]} />}>
          <Changelog />
        </Scr>
      ),
    },
    {
      at: L("c15p03") - 8,
      node: (bf) => {
        const tab = step<number>(bf, [
          [0, 0],
          [rq("onboarding,"), 1],
          [rq("KYC"), 2],
          [rq("and Intercom"), 3],
          [rq("Raise a request"), 0],
        ]);
        return (
          <Scr
            cam={camPath(bf, [
              [L("c15p03"), cam(900, 300, 1.3)],
              [rq("Raise a request") - 6, cam(1500, 220, 1.5)],
            ])}
            over={<Callouts f={bf} items={[{ a: rq("Raise a request"), box: [1740, 103, 151, 40], label: "Raise a request", side: "bottom" }]} />}
          >
            <Requests tab={tab} />
          </Scr>
        );
      },
    },
    {
      at: rq("Open requests on a client") - 6,
      node: (bf) => (
        <>
          {plate("f15", 0.8)}
          <Link2 f={bf} a={rq("Open requests on a client")} left={["TRAIN-101 · open", "A request on a client"]} right={["Blocker", "On that client's deal"]} label="shows up under" />
        </>
      ),
    },
  ];
};

// ---------------------------------------------------------------------------
const ch16 = (): Shot[] => {
  const { L, P, E } = mk(16);
  const at = [
    "Critical alerts cleared",
    "First contact deadlines",
    "Overdue actions worked",
    "Inbox triaged",
    "Today planned",
    "Activity recorded",
    "Ownership checked",
    "Client Growth reviewed",
    "Sales Plan reviewed",
    "Requests reviewed",
    "Calendar capacity",
    "Tomorrow planned",
  ].map((x) => P("c16p01", x));
  const { S } = mk(16);
  at.forEach((t) => S("tick", t, -4));
  S("confirm", P("c16p02", "every important deal"), -2);
  S("shimmer", L("c16p04"), -2);
  return [
    {
      at: 0,
      node: (bf) => (
        <>
          {plate("f16", 0.8)}
          <Checklist f={bf} a={L("c16p00")} at={at} finalAt={P("c16p02", "every important deal")} />
        </>
      ),
    },
    {
      at: L("c16p03") - 8,
      node: (bf) => (
        <Scr cam={camPath(bf, [[L("c16p03"), cam(960, 560, 1.1)], [E("c16p03") + 20, cam(960, 540, 0.98)]])}>
          <Dashboard start={SETTLED} tab={2} />
        </Scr>
      ),
    },
    {
      at: L("c16p04") - 8,
      node: (bf) => (
        <>
          <Plate src="fal/loop/f16.mp4" dim={0.5} />
          <Principle f={bf} a={L("c16p04")} text="Your book is under control when the next action is clear." y={480} gold />
        </>
      ),
    },
  ];
};

const BUILDERS: Record<number, () => Shot[]> = { 1: ch1, 2: ch2, 3: ch3, 4: ch4, 5: ch5, 6: ch6, 7: ch7, 8: ch8, 9: ch9, 10: ch10, 11: ch11, 12: ch12, 13: ch13, 14: ch14, 15: ch15, 16: ch16 };

export const shotsFor = (n: number) => BUILDERS[n]();
export const bodyLength = bodyLen;
export const Blank: React.FC = () => <AbsoluteFill style={{ background: C.ground }} />;
