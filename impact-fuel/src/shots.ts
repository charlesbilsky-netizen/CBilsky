// Audio-locked shot map. The soundtrack is the timing authority: slot
// boundaries come from the brief's timecode map, converted to 24 fps frames.
// The picture runs 2808 frames (117.000 s). The final 7.5 ms of audio plays
// over black, which is the frame-accurate cut to black at the audio endpoint.

export const FPS = 24;
export const AUDIO_SECONDS = 117.0075;
export const TOTAL_FRAMES = 2808;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export type Shot = {
  id: string;
  file: string;
  startSec: number;
  endSec: number;
  label: string;
  // Source frames to skip at the head of the generated clip.
  trimBefore: number;
};

const raw: [string, string, number, number, string][] = [
  ["01", "opening", 0, 13, "Opening, rooftops descend to street"],
  ["02", "dade_welcome", 13, 23, "Guide walks the block"],
  ["03", "handoff", 23, 29, "Hands, wrapped package, red-blue sweep"],
  ["04", "ride_along", 29, 32, "Guide enters sedan, car moves"],
  ["05", "south_beach", 32, 37, "South Beach contrast, vehicle wipe"],
  ["06", "jewelry", 37, 41, "Watch and chain, Visitor is measured"],
  ["07", "i395", 41, 46, "Under the highway, dead-end gate"],
  ["08", "street_crew", 46, 50, "Street Crew on stoop"],
  ["09", "little_havana", 50, 54, "Ventanita, coffee steam, reflection"],
  ["10", "intermediary", 54, 62, "TV watcher, intermediary behind him"],
  ["11", "cemetery_entry", 62, 69, "Brownsville cemetery entrance"],
  ["12", "generations", 69, 76, "Family markers, hand clears rain"],
  ["13", "little_haiti", 76, 80, "Enforcer approaches apartment entry"],
  ["14", "door_chicago", 80, 87, "Door impact, phone, Chicago call"],
  ["15", "decision", 87, 91, "Visitor decides, enters, turns wheel"],
  ["16", "opa_locka", 91, 95, "Opa-locka, searchlights hit windshield"],
  ["17", "carol_city", 95, 99, "Windshield fractures, sedan stops"],
  ["18", "real_dade", 99, 103, "Photos, black coat, procession, hearse lane"],
  ["19", "vest_pyrex", 103, 106, "Vest strap, Pyrex dish, flicker"],
  ["20", "predawn", 106, 109, "Guide exits into pre-dawn, crane up"],
  ["21", "consequences", 109, 114, "Consequence montage"],
  ["22", "final_eyes", 114, AUDIO_SECONDS, "Guide's eyes in rain-streaked window"],
];

export const SHOTS: Shot[] = raw.map(([id, slug, startSec, endSec, label]) => ({
  id,
  file: `shot_${id}_${slug}.mp4`,
  startSec,
  endSec,
  label,
  trimBefore: 0,
}));

export const startFrame = (s: Shot) => Math.round(s.startSec * FPS);
export const endFrame = (s: Shot) =>
  Math.min(TOTAL_FRAMES, Math.round(s.endSec * FPS));
export const slotFrames = (s: Shot) => endFrame(s) - startFrame(s);
