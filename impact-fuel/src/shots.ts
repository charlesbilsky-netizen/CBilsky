// Audio-locked shot map. The soundtrack is the timing authority: slot
// boundaries are word onsets in the track, converted to 24 fps frames.
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

// Boundaries snap to word onsets from a word-timestamped transcription of the
// soundtrack (transcript kept local, not committed). Cue = the lyric beat.
const raw: [string, string, number, number, string][] = [
  ["01", "opening", 0, 10.5, "Intro: black to aerial rooftops"],
  ["02", "descent", 10.5, 21.1, "Intro: descend to street, Guide appears"],
  ["03", "dade_welcome", 21.1, 24.5, "Welcome to Dade County: Guide walks the block"],
  ["04", "rocks", 24.5, 29.2, "Rocks, blocks, red and blue lights: hand-to-hand"],
  ["05", "ride_along", 29.2, 32.75, "Ride with me: Guide enters sedan"],
  ["06", "south_beach", 32.75, 37.6, "Don't be fooled by South Beach"],
  ["07", "jewels", 37.6, 42.25, "Jewels like a menu: Visitor is marked"],
  ["08", "i395", 42.25, 46.7, "Cross I-395, dead-end streets"],
  ["09", "street_crew", 46.7, 51.75, "White beaters, bare feet, goon style"],
  ["10", "little_havana", 51.75, 54.58, "Entering Little Havana"],
  ["11", "tony_montana", 54.58, 61.9, "Studio gangsters, meet the real one"],
  ["12", "palm_graveyard", 61.9, 65.9, "Palm trees out, graveyard in"],
  ["13", "brownsville", 65.9, 70.4, "Brownsville graveyard, generations deep"],
  ["14", "generations", 70.4, 74.9, "Grandfather to grandmother, stacked"],
  ["15", "little_haiti", 74.9, 81.4, "Little Haiti connection, the real one"],
  ["16", "door_kick", 81.4, 85.0, "Kick in your door, face down on the floor"],
  ["17", "chicago", 85.0, 87.8, "Family wires money from Chicago"],
  ["18", "decision", 87.8, 91.2, "Real G, tell your car where to go"],
  ["19", "opa_locka", 91.2, 95.75, "Opa-locka, helicopters, choppers"],
  ["20", "carol_city", 95.75, 99.35, "Carol City, holes doctors can't plug"],
  ["21", "birth_to_hearse", 99.35, 103.5, "Soldiers from birth to the hearse"],
  ["22", "vest_pyrex", 103.5, 106.6, "Bulletproof vest and a pyrex"],
  ["23", "real_miami", 106.6, 109.1, "Haven't seen the real Miami yet"],
  ["24", "welcome_real", 109.1, 112.0, "Welcome to the real Miami"],
  ["25", "live_to_die", 112.0, AUDIO_SECONDS, "Live to die, die, die: final eyes"],
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
