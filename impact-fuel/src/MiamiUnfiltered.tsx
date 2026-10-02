import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import available from "./available-shots.json";
import { SHOTS, Shot, slotFrames, startFrame } from "./shots";

export type MiamiUnfilteredProps = {
  // Draft mode labels empty slots so gaps are obvious. Final mode keeps them black.
  draft: boolean;
};

const present = new Set<string>(available.files);

const EmptySlot: React.FC<{ shot: Shot; draft: boolean }> = ({
  shot,
  draft,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: "#000",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {draft ? (
      <div
        style={{
          color: "#8a8f98",
          fontFamily: "Helvetica, Arial, sans-serif",
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700, color: "#d0d4da" }}>
          SHOT {shot.id}
        </div>
        <div style={{ fontSize: 40 }}>{shot.label}</div>
        <div style={{ fontSize: 32, marginTop: 24 }}>
          {shot.startSec.toFixed(3)}s to {shot.endSec.toFixed(3)}s · missing{" "}
          {shot.file}
        </div>
      </div>
    ) : null}
  </AbsoluteFill>
);

export const MiamiUnfiltered: React.FC<MiamiUnfilteredProps> = ({ draft }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SHOTS.map((shot) => (
        <Sequence
          key={shot.id}
          name={`Shot ${shot.id}`}
          from={startFrame(shot)}
          durationInFrames={slotFrames(shot)}
          premountFor={fps}
        >
          {present.has(shot.file) ? (
            <Video
              src={staticFile(`shots/${shot.file}`)}
              trimBefore={shot.trimBefore}
              muted
              objectFit="cover"
            />
          ) : (
            <EmptySlot shot={shot} draft={draft} />
          )}
        </Sequence>
      ))}
      {available.audio ? (
        <Audio src={staticFile("audio/Pitbull-Intro.opus")} />
      ) : null}
    </AbsoluteFill>
  );
};
