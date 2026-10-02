import { Composition } from "remotion";
import { MiamiUnfiltered } from "./MiamiUnfiltered";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./shots";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MiamiUnfiltered"
        component={MiamiUnfiltered}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ draft: true }}
      />
    </>
  );
};
