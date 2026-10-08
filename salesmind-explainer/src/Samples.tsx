import React from "react";
import { AbsoluteFill, Freeze, Sequence } from "remotion";
import { Film } from "./film/Film";
import samples from "./generated/samples.json";

// QC: one frame per narration line, frozen from the full film.
export const Samples: React.FC = () => (
  <AbsoluteFill>
    {samples.map((s, i) => (
      <Sequence key={i} from={i} durationInFrames={1}>
        <Freeze frame={s.f}>
          <Film />
        </Freeze>
      </Sequence>
    ))}
  </AbsoluteFill>
);
