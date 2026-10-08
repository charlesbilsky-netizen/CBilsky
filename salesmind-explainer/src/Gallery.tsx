import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SignIn, NavTour } from "./screens/Nav";
import { Dashboard } from "./screens/Dashboard";
import { TasksInbox, TasksToday, PlanTheDay, Planning } from "./screens/Tasks";
import { PipelineBoard, ClientGrowthBoard, FiltersPanel, PipelineMenus, PipelineTable } from "./screens/Pipeline";
import { DealPage, CompleteDialog, MoveDialog, HoldCloseDialogs, CreateDeal } from "./screens/DealPage";
import { Clients, Ownership, Activity, ActivityItem } from "./screens/Book";
import { Performance, SalesPlan, GooglePermission, Guidebook, Materials, Changelog, Requests } from "./screens/Rest";

// QC sheet: one frame per screen state, entry animations already settled.
const S = -120;
export const GALLERY: [string, React.ReactNode][] = [
  ["signin", <SignIn />],
  ["navtour", <NavTour glow={{ Book: 1 }} top="search" />],
  ["dash", <Dashboard start={S} />],
  ["dash-hi", <Dashboard start={S} highlightRow={0} />],
  ["inbox", <TasksInbox start={S} typed="Call Meridian re funding @Meridian 15:00 !week" selected={1} />],
  ["today", <TasksToday start={S} />],
  ["plan0", <PlanTheDay step={0} start={S} />],
  ["plan1", <PlanTheDay step={1} start={S} />],
  ["planning", <Planning start={S} />],
  ["board", <PipelineBoard start={S} />],
  ["board-menu", <PipelineBoard start={S} menuId="d6" />],
  ["cg-board", <ClientGrowthBoard start={S} />],
  ["filters", <FiltersPanel start={S} focusGroup="Alert" pick="Has alert" />],
  ["menus", <PipelineMenus start={S} />],
  ["table", <PipelineTable start={S} hiCol="next" />],
  ["deal", <DealPage start={S} />],
  ["deal-acc", <DealPage start={S} na="accepted" />],
  ["complete", <CompleteDialog start={S} />],
  ["move", <MoveDialog start={S} />],
  ["holdclose", <HoldCloseDialogs start={S} />],
  ["createdeal", <CreateDeal start={S} />],
  ["clients", <Clients start={S} />],
  ["ownership", <Ownership start={S} focus={1} />],
  ["activity", <Activity start={S} typesOpen />],
  ["actitem", <ActivityItem start={S} issue />],
  ["perf", <Performance start={S} />],
  ["salesplan", <SalesPlan start={S} />],
  ["google", <GooglePermission start={S} step={2} />],
  ["guide", <Guidebook start={S} />],
  ["materials", <Materials start={S} />],
  ["changelog", <Changelog start={S} />],
  ["requests", <Requests start={S} />],
];

export const Gallery: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {GALLERY.map(([k, node], i) => (
      <Sequence key={k} from={i} durationInFrames={1}>
        {node}
      </Sequence>
    ))}
  </AbsoluteFill>
);
