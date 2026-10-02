# Impact Fuel: Miami Unfiltered — Generation Prompts

Paste-ready prompts for an image-to-video or text-to-video generator (Seedance 2.0, Kling, Veo, Runway). Generate the reference images first. Then generate each of the 25 shots using its listed references. Save each clip as `public/shots/<filename>` and run `npm run scan`.

Sources: Super Meta-Prompt, One-Piece Integrated Prompt, Full Movie Continuation Prompt, Continuity Bible (knowledge 2). Where they conflict, the integrated prompt wins. Adopted from the bible: hex palette, Guide age 35, thin silver box chain, mid-2000s charcoal sedan with a rear-panel scratch. Timing comes from word onsets in the soundtrack, which override every brief.

**Conflict kept to the integrated brief:** the bible gives the Visitor a silk camp shirt and rope chain. The integrated brief says restrained gold and clean, overdressed clothes. I used the restrained version. If you want the louder look, swap it in REF-03 before generating anything.

## Global settings

- 16:9, 24 fps, 1920x1080 or 3840x2160, Rec.709 SDR.
- Palette: sodium amber `#E5A13B`, rain-washed navy `#1A2E3B`, dirty teal, concrete gray, tobacco brown, emergency red, occasional green fluorescent. Natural skin, controlled blacks.
- Generate each clip at least 0.5 s longer than its slot. The assembly trims. It never stretches.
- Every character is visibly 25 or older. Nobody's mouth moves to the track.
- Mute or discard generator audio. The assembly uses only the original Opus master.

**Universal negative prompt (append to every shot):**

Shots that call for guns, drugs or blood don't contradict it. It only excludes gore close-ups.

```
animation, anime, illustration, CGI, 3D render, videogame look, plastic skin, wax faces, deformed hands, extra fingers, duplicated people, face drift, age drift, wardrobe drift, object pop-in, readable signage, logos, watermarks, subtitles, captions, title cards, lip sync, mouths moving, minors, juvenile characters, stereotype, caricature, sexual content, gore, graphic wounds, wound close-ups, torture, instructional detail, floating camera, whip pan, teleporting, excessive lens flare, overexposed neon, crushed blacks, teal-orange grade
```

---

## Phase 2 — Reference images

Every reference prompt ends with: `no text, no watermarks, no logos, no labels, no annotations`

**REF-01 The Guide** (`ref_guide.png`)
```
Photorealistic 16:9 medium portrait, 85mm lens, night street in Miami-Dade, sodium amber streetlight and wet navy shadows. Adult Cuban-Haitian American man, 35, lean build, close buzz cut, tired observant dark eyes, charcoal work jacket over a white undershirt, dark jeans, scuffed brown leather boots, thin silver box chain. Neutral expression, mouth closed. Natural skin texture, pores, light sweat, humid air. no text, no watermarks, no logos, no labels, no annotations
```

**REF-02 Street Crew** (`ref_crew.png`)
```
Photorealistic 16:9 wide shot, 35mm lens, cramped concrete stoop of a faded stucco apartment building at night, sodium amber light. Three clearly adult men in their late 20s, Afro-Caribbean and Cuban/Haitian American, worn white tank tops and faded work shirts, loose dark trousers, sneakers, one barefoot on the step. Still, quiet, watchful posture. Respectful, specific, no caricature. no text, no watermarks, no logos, no labels, no annotations
```

**REF-03 Jewel-Wearing Visitor** (`ref_visitor.png`)
```
Photorealistic 16:9 medium shot, 50mm lens, night, neon spill on wet pavement. Clearly adult man, late 20s, clean but overdressed pressed shirt and tailored trousers, restrained gold chain, expensive gold watch. Slightly anxious eyes, vulnerable rather than glamorous. no text, no watermarks, no logos, no labels, no annotations
```

**REF-04 Little Havana Intermediary** (`ref_intermediary.png`)
```
Photorealistic 16:9 medium portrait, 85mm lens, warm ventanita counter light. Adult Cuban woman in her 40s, weathered face, faded red blouse, dark hair pulled back, calm watchful expression, mouth closed. no text, no watermarks, no logos, no labels, no annotations
```

**REF-05 Little Haiti Enforcer** (`ref_enforcer.png`)
```
Photorealistic 16:9 medium shot, 50mm lens, humid night street. Adult Haitian man in his 30s, broad shoulders, navy chore jacket, dark trousers, calm controlled expression, still posture. Dignified, specific, no stereotype. no text, no watermarks, no logos, no labels, no annotations
```

**REF-06 Sedan** (`ref_sedan_ext.png`, `ref_sedan_int.png`)
```
Photorealistic 16:9 three-quarter exterior, 35mm lens, mid-2000s charcoal four-door rental sedan, plain unbadged, rain beads on glass, small scratch on rear quarter panel, parked on wet asphalt under a sodium streetlight. no text, no watermarks, no logos, no labels, no annotations
```
```
Photorealistic 16:9 interior of the same mid-2000s charcoal sedan from the passenger seat, worn gray cloth seats, amber dashboard glow, rain-streaked windshield, city lights bokeh beyond. no text, no watermarks, no logos, no labels, no annotations
```

**REF-07 to REF-14 Locations**, one prompt each, same suffix:
```
Photorealistic 16:9 wide establishing frame, 24mm lens, night, humid haze, Rec.709 natural grade.
07 ref_rooftops.png: Miami-Dade low-rise rooftops, scattered lit windows, wet streets, sagging power lines, distant skyline glow.
08 ref_south_beach.png: art-deco facades with soft neon, valet stand, adult tourists, wet sidewalk.
09 ref_overpass.png: elevated concrete highway, rhythmic columns, narrowing side street ending at a chain-link gate.
10 ref_little_havana.png: ventanita window, checkered tile, coffee steam, adult domino players under an awning, older cars, a natural Cuban flag.
11 ref_cemetery.png: Brownsville cemetery entrance, cracked mausoleums, overgrown grass, rain-dark limestone headstones, chain-link, distant amber lamp.
12 ref_little_haiti.png: worn colorful storefronts, metal roll gates, church facade, multi-family house with a wooden porch.
13 ref_opa_locka.png: Moorish-influenced domes and arches at an industrial edge, broad empty road, haze for searchlights.
14 ref_carol_city.png: residential block, low ranch houses, chain-link, single streetlight, wet road shoulder.
no text, no watermarks, no logos, no labels, no annotations
```

---

## Phase 3 — Shot prompts (lyric-locked, R-rated)

Slot times come from word onsets in the soundtrack itself, not the older briefs' approximate map. Each shot carries the lyric beat it plays under. Intensity is R-rated: guns, drugs on screen, the raid and the shooting are shown, not implied.

Hard lines, unchanged: every person visibly 25 or older, no wound anatomy or gore close-ups, no drug-making process, no readable account details, nobody lip-syncs.

**If a model refuses a shot:** run the same prompt on another official video model on fal. Only if every model refuses, use that shot's fallback line. Never reword a prompt to slip past a filter.

Format: slot · generate · references.

**01 · 0.00–10.50 · Intro · `shot_01_opening.mp4`** · 10.5 s · generate 10–11 s · REF-07
```
Opens on near-black. Slow 24mm aerial push over humid Miami-Dade rooftops at night: scattered lit windows, wet streets, dripping power lines, distant skyline glow through haze. One continuous physically plausible drone move, no people in focus.
```

**02 · 10.50–21.10 · Intro · `shot_02_descent.mp4`** · 10.6 s · generate 11 s · REF-07, REF-01
```
Continuous 24mm crane descent from roof height to a sodium-lit wet street. As the camera reaches eye level, the Guide (REF-01) steps into frame from a side street and starts walking toward camera.
```

**03 · 21.10–24.50 · "welcome to Dade County" · `shot_03_dade_welcome.mp4`** · 3.4 s · generate 5 s · REF-01
```
35mm tracking shot moving backward in front of the Guide (REF-01) walking a narrow lived-in block. Adult residents watch silently from stoops. A city bus passes behind him. He looks straight into the lens, mouth closed.
```

**04 · 24.50–29.20 · "rocks … red and blue lights" · `shot_04_rocks.mp4`** · 4.7 s · generate 5 s
```
85mm insert, corner of a concrete block at night. An adult hand opens to show a small clear baggie of off-white crack rocks; another adult hand pays with a folded wad of cash. Red-blue police light sweeps across both hands and wet concrete. Both freeze, then the baggie vanishes into a jacket pocket.
```
*Fallback:* `85mm insert, two adult hands swap a small wrapped package for folded cash as red-blue police light sweeps across them.`

**05 · 29.20–32.75 · "ride with me" · `shot_05_ride_along.mp4`** · 3.55 s · generate 5 s · REF-01, REF-06
```
Low tracking shot alongside the charcoal sedan (REF-06) in the rain. The Guide (REF-01) drops into the driver's seat, door slams, rain beads on the glass, amber dash glow on his face, and the car pulls out into the night.
```

**06 · 32.75–37.60 · "don't be fooled by South Beach" · `shot_06_south_beach.mp4`** · 4.85 s · generate 5 s · REF-03, REF-08
```
50mm, South Beach at night: neon on art-deco facades, valet line, adult tourists. The Visitor (REF-03) steps out of a valet car, gold watch and chain catching the light. A dark van passes close in the foreground left to right, wiping the frame to black.
```

**07 · 37.60–42.25 · "your jewels are like a menu … we intend to eat" · `shot_07_jewels.mp4`** · 4.65 s · generate 5 s · REF-03
```
85mm close-up of the Visitor's gold watch and chain. Focus racks to two adult men across the street watching him; one lifts his shirt just enough to show a pistol grip in his waistband. Focus racks back: the Visitor pulls his sleeve over the watch and his face drops.
```

**08 · 42.25–46.70 · "cross that I-395 … dead-end streets" · `shot_08_i395.mp4`** · 4.45 s · generate 5 s · REF-06, REF-09
```
Low-angle 24mm tracking shot following the charcoal sedan (REF-06) under an elevated concrete highway at night. Columns pass in rhythm. The sedan turns into a narrowing side street and brakes hard at a locked chain-link gate, brake lights red on wet asphalt.
```

**09 · 46.70–51.75 · "white beaters and bare feet … goon style" · `shot_09_street_crew.mp4`** · 5.05 s · generate 5–6 s · REF-02
```
Slow 50mm dolly-in on the three adult Street Crew members (REF-02) on a cramped stoop: white beaters, one barefoot. One slides a metal security gate shut, one stares down the road, one sets a coffee cup next to a handgun resting on the step. Total stillness and menace.
```

**10 · 51.75–54.58 · "entering the infamous Little Havana" · `shot_10_little_havana.mp4`** · 2.83 s · generate 5 s · REF-10, REF-06
```
35mm tracking from the street to a Little Havana ventanita at night: warm light, coffee steam, checkered tile, adult domino players under the awning, a Cuban flag. The charcoal sedan's reflection slides across the storefront glass.
```

**11 · 54.58–61.90 · "studio gangsters … meet the real Tony Montana" · `shot_11_tony_montana.mp4`** · 7.32 s · generate 8 s · REF-04
```
Dim apartment. An adult man in a flashy shirt watches an unbranded 1980s-style crime film on a small CRT, mimicking a tough-guy pose. He turns. The intermediary (REF-04) stands in the hallway behind him, calm, a revolver held low at her side. She takes one step forward. Warm lamp light gives way to hard green fluorescent. No speech.
```

**12 · 61.90–65.90 · "fuck them palm trees" · `shot_12_palm_graveyard.mp4`** · 4.0 s · generate 5 s · REF-11
```
A palm tree silhouette fills the frame, then the camera tracks past it to reveal a cemetery entrance at night: cracked mausoleums, chain-link, rain-dark headstones, distant amber lamp.
```

**13 · 65.90–70.40 · "graveyard in Brownsville … four generations deep" · `shot_13_brownsville.mp4`** · 4.5 s · generate 5 s · REF-01, REF-11
```
The Guide (REF-01) walks a gravel path between rows of old weathered headstones and family mausoleums. Slow 24mm crane down toward a wet stone.
```

**14 · 70.40–74.90 · "granddaddy to grandmother, piled up" · `shot_14_generations.mp4`** · 4.5 s · generate 5 s · REF-11
```
Slow lateral 50mm dolly across stacked family crypt markers in a wall, names and dates too soft to read, several generations side by side. An adult hand brushes rainwater off one. A single adult mourner stands still in the background.
```

**15 · 74.90–81.40 · "your Little Haiti connections … a real one" · `shot_15_little_haiti.mp4`** · 6.5 s · generate 7 s · REF-05, REF-12
```
35mm follow shot behind the Little Haiti enforcer (REF-05) walking a lived-in Little Haiti street at night (worn colorful storefronts, metal roll gates, a church facade) and climbing the wooden porch steps of a multi-family house. He stops at the door and looks back over his shoulder at camera.
```

**16 · 81.40–85.00 · "kick in your door, put you face down on the floor" · `shot_16_door_kick.mp4`** · 3.6 s · generate 5 s · REF-05
```
Interior apartment, 35mm. The front door bursts inward off its frame, splinters and paint dust in the air. The enforcer (REF-05) steps through and pins an adult man face down on the floor with a knee in his back, a pistol held at his side. No beating.
```
*Fallback:* `The front door bursts inward in a cloud of dust; an adult man drops face down on the floor, hands behind his head, as a figure steps through.`

**17 · 85.00–87.80 · "your whole family wire money from Chicago" · `shot_17_chicago.mp4`** · 2.8 s · generate 5 s
```
85mm insert: a phone on tile buzzing with an incoming call labeled only "Chicago". Cut within the clip to an anxious adult couple at a money-transfer counter sliding cash under the glass. No readable numbers or account details.
```

**18 · 87.80–91.20 · "if you're a real G, tell your car where to go" · `shot_18_decision.mp4`** · 3.4 s · generate 5 s · REF-03, REF-06
```
50mm, empty alley. The Visitor (REF-03) tucks his chain inside his shirt, gets into the charcoal sedan, grips the wheel with white knuckles, and pulls out fast.
```

**19 · 91.20–95.75 · "Opa-locka … spotlight helicopters, a triangle full of choppers" · `shot_19_opa_locka.mp4`** · 4.55 s · generate 5 s · REF-13, REF-06
```
24mm crane rise over Opa-locka at night: Moorish domes and arches at an industrial edge, haze. Two police helicopters sweep searchlights in a shifting triangle. On the road below, three adult men stand beside a car holding automatic rifles; a searchlight beam lands on the charcoal sedan's windshield.
```
*Fallback:* `Opa-locka at night, Moorish domes, two helicopters sweep searchlights through haze; the final beam lands on a sedan's windshield.`

**20 · 95.75–99.35 · "Carol City makes holes … can't be plugged by doctors" · `shot_20_carol_city.mp4`** · 3.6 s · generate 5 s · REF-06, REF-14
```
Interior of the charcoal sedan, Carol City at night. Muzzle flashes outside, bullet holes punch through the windshield, glass sprays, the car jolts to a stop. The adult driver slumps over the wheel, blood soaking his shirt; the adult passenger ducks under the dash screaming. No wound close-ups.
```
*Fallback:* `Interior of a sedan at night; the windshield shatters under sudden impacts, the car jolts to a stop, the driver slumps forward, an adult passenger ducks in terror.`

**21 · 99.35–103.50 · "soldiers from birth to the hearse" · `shot_21_birth_to_hearse.mp4`** · 4.15 s · generate 5 s
```
Match-cut sequence: an adult hand rests on a wall of family photos; an adult buttons a black wool coat; a hearse rolls slowly past a chain-link fence with adult mourners behind it in rain.
```

**22 · 103.50–106.60 · "a bulletproof vest and a pyrex" · `shot_22_vest_pyrex.mp4`** · 3.1 s · generate 5 s
```
85mm macro under a flickering fluorescent tube. Adult hands cinch the strap of a worn bulletproof vest. On a grimy stovetop beside it, a scratched Pyrex measuring cup with a dried white residue ring. One hand trembles once.
```
Adult hands only, even though the lyric says "childhood". No children anywhere in the film.

**23 · 106.60–109.10 · "you ain't even seen the real Miami yet" · `shot_23_real_miami.mp4`** · 2.5 s · generate 5 s · REF-01, REF-07
```
Blue pre-dawn. The Guide (REF-01) steps out of a dark doorway. Fast 24mm crane from his boots up to a wide view of low-rise blocks, a canal, utility wires, distant highway lights.
```

**24 · 109.10–112.00 · "welcome to the real Miami" · `shot_24_welcome_real.mp4`** · 2.9 s · generate 5 s
```
Fast montage of established places in their aftermath at dawn: the ventanita shutter slams down; police tape across the Little Haiti porch; the shot-up charcoal sedan on a Carol City shoulder; first light on the cemetery stones.
```

**25 · 112.00–117.0075 · "where we live to die, die, die" · `shot_25_live_to_die.mp4`** · 5.0 s · generate 5–6 s · REF-01
```
85mm close-up of the Guide's (REF-01) eyes reflected in a rain-streaked car side window. Streetlights and one helicopter searchlight sweep across the glass in a steady pulse. He doesn't move or blink. Mouth closed.
```
The cut to black at the audio end comes from the edit. Don't ask the generator for a fade.

---

## Phase 3 audit checklist (per clip)

Face, age, wardrobe, chain, sedan scratch, screen direction, hands, fake text, logos, lip movement, stereotype, physics. If a clip fails, regenerate only that shot with the same references. Record the generator, generation ID and regeneration count in `impact_fuel_production_manifest.json`. When a clip passes, set `"qc_passed": true` on it (status moves RENDERED → QC_PASSED). `npm run final` moves every shot to CONFORMED once the export verifies. Replacing a clip resets it to RENDERED. `npm run status` keeps hand edits.
