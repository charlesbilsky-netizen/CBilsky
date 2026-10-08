import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { FPS, W, H } from "./theme";
import { Ground, Stage } from "./ui/Stage";
import { TrainingBadge } from "./ui/TrainingBadge";
import { Dashboard } from "./screens/Dashboard";
import { TitleCard } from "./ui/TitleCard";
import { Gallery, GALLERY } from "./Gallery";
import { Film } from "./film/Film";
import { TL } from "./film/tl";
import { Samples } from "./Samples";
import samples from "./generated/samples.json";

const DashTest: React.FC = () => (
  <AbsoluteFill>
    <Ground />
    <Stage>
      <Dashboard tab={2} highlightRow={0} />
    </Stage>
    <TrainingBadge />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Samples" component={Samples} durationInFrames={samples.length} fps={FPS} width={W} height={H} />
    <Composition id="Film" component={Film} durationInFrames={TL.total} fps={FPS} width={W} height={H} />
    <Composition id="Gallery" component={Gallery} durationInFrames={GALLERY.length} fps={FPS} width={W} height={H} />
    <Composition id="DashTest" component={DashTest} durationInFrames={150} fps={FPS} width={W} height={H} />
    <Composition
      id="TitleTest"
      component={() => <TitleCard num="04" title="The Dashboard" kicker="Start here. This is the control surface." plate="tests/f01_pro.mp4" />}
      durationInFrames={120}
      fps={FPS}
      width={W}
      height={H}
    />
  </>
);
