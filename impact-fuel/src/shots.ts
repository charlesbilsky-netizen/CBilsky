// Audio-locked shot map. The soundtrack is the timing authority: slot
// boundaries are word onsets in the track, converted to 24 fps frames.
// The picture runs 2808 frames (117.000 s). The final 7.5 ms of audio plays
// over black, which is the frame-accurate cut to black at the audio endpoint.

export const FPS = 24;
export const AUDIO_SECONDS = 117.0075;
export const TOTAL_FRAMES = 2808;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Hybrid cut: most beats are a single generated still brought to life in the
// edit; the seven beats where motion is the point are generated video.
export type Kind = "still" | "video";
export type Move = "push" | "pull" | "panL" | "panR" | "rise" | "drift";
export type Sweep = "redblue" | "amber" | "search" | "green" | null;

export type Motion = {
  move: Move;
  rain: boolean;
  sweep: Sweep;
  flicker: boolean;
};

export type Shot = {
  id: string;
  kind: Kind;
  motion: Motion;
  file: string;
  startSec: number;
  endSec: number;
  label: string;
  // Source frames to skip at the head of the generated clip.
  trimBefore: number;
};

// Boundaries snap to word onsets from a word-timestamped transcription of the
// soundtrack (transcript kept local, not committed). Cue = the lyric beat.
const V = null; // video shot: motion comes from the clip itself
const m = (move: Move, rain = false, sweep: Sweep = null, flicker = false): Motion => ({
  move,
  rain,
  sweep,
  flicker,
});

const raw: [string, string, number, number, string, Motion | null][] = [
  ["01", "opening", 0, 10.5, "Intro: black to aerial rooftops", m("pull", true)],
  ["02", "descent", 10.5, 21.1, "Intro: descend to street, Guide appears", m("rise", true, "amber")],
  ["03", "dade_welcome", 21.1, 24.5, "Welcome to Dade County: Guide walks the block", V],
  ["04", "rocks", 24.5, 29.2, "Rocks, blocks, red and blue lights: hand-to-hand", m("push", false, "redblue")],
  ["05", "ride_along", 29.2, 32.75, "Ride with me: Guide enters sedan", V],
  ["06", "south_beach", 32.75, 37.6, "Don't be fooled by South Beach", m("panR")],
  ["07", "jewels", 37.6, 42.25, "Jewels like a menu: Visitor is marked", m("push", false, "amber")],
  ["08", "i395", 42.25, 46.7, "Cross I-395, dead-end streets", m("drift", true, "redblue")],
  ["09", "street_crew", 46.7, 51.75, "White beaters, bare feet, goon style", m("push")],
  ["10", "little_havana", 51.75, 54.58, "Entering Little Havana", m("panL", false, "amber")],
  ["11", "tony_montana", 54.58, 61.9, "Studio gangsters, meet the real one", m("push", false, "green", true)],
  ["12", "palm_graveyard", 61.9, 65.9, "Palm trees out, graveyard in", m("panR", true)],
  ["13", "brownsville", 65.9, 70.4, "Brownsville graveyard, generations deep", m("pull", true)],
  ["14", "generations", 70.4, 74.9, "Grandfather to grandmother, stacked", m("panL", true)],
  ["15", "little_haiti", 74.9, 81.4, "Little Haiti connection, the real one", m("push", true, "amber")],
  ["16", "door_kick", 81.4, 85.0, "Kick in your door, face down on the floor", V],
  ["17", "chicago", 85.0, 87.8, "Family wires money from Chicago", m("push", false, null, true)],
  ["18", "decision", 87.8, 91.2, "Real G, tell your car where to go", m("drift", true)],
  ["19", "opa_locka", 91.2, 95.75, "Opa-locka, helicopters, choppers", V],
  ["20", "carol_city", 95.75, 99.35, "Carol City, holes doctors can't plug", V],
  ["21", "birth_to_hearse", 99.35, 103.5, "Soldiers from birth to the hearse", m("pull", true)],
  ["22", "vest_pyrex", 103.5, 106.6, "Bulletproof vest and a pyrex", V],
  ["23", "real_miami", 106.6, 109.1, "Haven't seen the real Miami yet", m("rise")],
  ["24", "welcome_real", 109.1, 112.0, "Welcome to the real Miami", m("push", false, "redblue")],
  ["25", "live_to_die", 112.0, AUDIO_SECONDS, "Live to die, die, die: final eyes", V],
];

export const SHOTS: Shot[] = raw.map(([id, slug, startSec, endSec, label, motion]) => ({
  id,
  kind: motion ? "still" : "video",
  motion: motion ?? m("drift"),
  file: `shot_${id}_${slug}.${motion ? "png" : "mp4"}`,
  startSec,
  endSec,
  label,
  trimBefore: 0,
}));

export const startFrame = (s: Shot) => Math.round(s.startSec * FPS);
export const endFrame = (s: Shot) =>
  Math.min(TOTAL_FRAMES, Math.round(s.endSec * FPS));
export const slotFrames = (s: Shot) => endFrame(s) - startFrame(s);
