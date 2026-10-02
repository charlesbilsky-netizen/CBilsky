# Impact Fuel: Miami Unfiltered — Generation Prompts

Paste-ready prompts for an image-to-video or text-to-video generator (Seedance 2.0, Kling, Veo, Runway). Generate the reference images first. Then generate each shot using its listed references. Save each clip as `public/shots/<filename>` and run `npm run scan`.

Sources: Super Meta-Prompt, One-Piece Integrated Prompt, Full Movie Continuation Prompt, Continuity Bible (knowledge 2). Where they conflict, the integrated prompt wins. Adopted from the bible: hex palette, Guide age 35, thin silver box chain, mid-2000s charcoal sedan with a rear-panel scratch.

**Conflict kept to the integrated brief:** the bible gives the Visitor a silk camp shirt and rope chain. The integrated brief says restrained gold and clean, overdressed clothes. I used the restrained version. If you want the louder look, swap it in REF-03 before generating anything.

## Global settings

- 16:9, 24 fps, 1920x1080 or 3840x2160, Rec.709 SDR.
- Palette: sodium amber `#E5A13B`, rain-washed navy `#1A2E3B`, dirty teal, concrete gray, tobacco brown, emergency red, occasional green fluorescent. Natural skin, controlled blacks.
- Generate each clip at least 0.5 s longer than its slot. The assembly trims. It never stretches.
- Every character is visibly 25 or older. Nobody's mouth moves to the track.
- Mute or discard generator audio. The assembly uses only the original Opus master.

**Universal negative prompt (append to every shot):**

```
animation, anime, illustration, CGI, 3D render, videogame look, plastic skin, wax faces, deformed hands, extra fingers, duplicated people, face drift, age drift, wardrobe drift, object pop-in, readable signage, logos, watermarks, subtitles, captions, title cards, lip sync, mouths moving, minors, juvenile characters, stereotype, caricature, sexual content, gore, graphic wounds, torture, instructional detail, floating camera, whip pan, teleporting, excessive lens flare, overexposed neon, crushed blacks, teal-orange grade
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

## Phase 3 — Shot prompts

Format: slot length · suggested generation length · references.

**01 · 00:00–00:13 · `shot_01_opening.mp4`** · 13.0 s · generate 2×7 s and join, or one 15 s · REF-07
```
Opens nearly black. Slow 24mm aerial descent over humid Miami-Dade rooftops at night: scattered lit windows, wet streets, dripping power lines, distant skyline glow through haze. Camera lowers steadily from roof height to an empty sodium-lit street, ending at eye level on wet asphalt. Single continuous move, physically plausible, no people in focus.
```

**02 · 00:13–00:23 · `shot_02_dade_welcome.mp4`** · 10.0 s · generate 10–12 s · REF-01, REF-07
```
35mm shoulder-height tracking shot moving backward in front of the Guide (REF-01) as he walks toward camera along a narrow lived-in block. Adult residents watch silently from stoops. A city bus passes behind him left to right. Distant red-blue emergency light reflects on wet pavement. He keeps walking, eyes forward, mouth closed. Ends with him still mid-stride, filling the center of frame.
```

**03 · 00:23–00:29 · `shot_03_handoff.mp4`** · 6.0 s · generate 7 s
```
85mm macro insert beside a rough concrete wall at night. Two adult hands, only forearms visible, pass a small opaque brown-paper wrapped package. A red-blue emergency light sweeps across the hands and wet concrete. Both hands freeze, then one slides the package inside a dark jacket. Contents never visible. Ends on the empty wall and reflection.
```
*Filter-safe fallback:* `85mm macro, two adult hands pass a folded paper envelope beside a concrete wall; red-blue light sweeps across; one hand tucks it into a jacket pocket.`

**04 · 00:29–00:32 · `shot_04_ride_along.mp4`** · 3.0 s · generate 5 s · REF-01, REF-06
```
Low vehicle-height tracking shot alongside the charcoal sedan (REF-06) at night in the rain. The Guide (REF-01) sits in the driver's seat, door swings shut, rain beads on the side glass, amber dashboard glow lights his face, engine starts and the car pulls forward out of frame. Mouth closed throughout.
```

**05 · 00:32–00:37 · `shot_05_south_beach.mp4`** · 5.0 s · generate 6 s · REF-03, REF-08
```
50mm medium-wide, South Beach at night: soft neon on art-deco facades, valet line, adult tourists. The Visitor (REF-03) steps away from the valet stand, gold watch catching light. The beauty feels exposing. A dark van passes close in the foreground left to right, fully wiping the frame to black.
```

**06 · 00:37–00:41 · `shot_06_jewelry.mp4`** · 4.0 s · generate 5 s · REF-03
```
85mm close-up of the Visitor's wrist: gold watch and chain catch neon light. Focus racks to two adult figures in shadow across the street, watching. One crosses between him and the bright street. Focus racks back: the Visitor pulls his sleeve over the watch and lowers his hand, realizing he is being measured.
```

**07 · 00:41–00:46 · `shot_07_i395.mp4`** · 5.0 s · generate 6 s · REF-06, REF-09
```
Low-angle 24mm tracking shot following the charcoal sedan (REF-06) beneath an elevated concrete highway at night. Columns pass in steady rhythm. The sedan turns into a narrowing side street and brakes to a stop in front of a locked chain-link gate, brake lights glowing red on wet asphalt.
```

**08 · 00:46–00:50 · `shot_08_street_crew.mp4`** · 4.0 s · generate 5 s · REF-02
```
Slow 50mm dolly-in on the three adult Street Crew members (REF-02) on a cramped stoop. One slides a metal security gate shut, one looks toward the road, one sets a small coffee cup down on the step. Nobody speaks. Menace through stillness only.
```

**09 · 00:50–00:54 · `shot_09_little_havana.mp4`** · 4.0 s · generate 5 s · REF-10, REF-06
```
35mm tracking shot from the street toward a Little Havana ventanita at night: warm light, coffee steam, checkered tile, adult domino players under the awning, a Cuban flag hanging naturally. The charcoal sedan (REF-06) passes slowly; its reflection slides across the storefront glass as the camera arrives at the window.
```

**10 · 00:54–01:02 · `shot_10_intermediary.mp4`** · 8.0 s · generate 8–10 s · REF-04
```
Dim apartment room. 50mm over-the-shoulder on an adult man watching an unbranded black-and-white crime film on a small CRT television; nothing on screen is recognizable. He smiles with false confidence, then turns. The intermediary (REF-04) stands calmly in the hallway behind him and takes one step forward. Warm lamp light gives way to hard green fluorescent hallway light. No speech.
```

**11 · 01:02–01:09 · `shot_11_cemetery_entry.mp4`** · 7.0 s · generate 8 s · REF-01, REF-11
```
A palm silhouette slides out of frame left, revealing the Brownsville cemetery entrance at night: cracked mausoleums, overgrown grass, rain-dark limestone headstones, chain-link, distant amber lamp. The Guide (REF-01) walks a gravel path away from camera. Slow 24mm crane down toward a wet headstone. No supernatural effects.
```

**12 · 01:09–01:16 · `shot_12_generations.mp4`** · 7.0 s · generate 8 s · REF-11
```
Slow lateral 50mm dolly across rows of old family grave markers, names and dates too soft to read. An adult hand enters and brushes rainwater from one carved stone. A single adult mourner stands still in soft focus in the background. Quiet grief, no gore.
```

**13 · 01:16–01:20 · `shot_13_little_haiti.mp4`** · 4.0 s · generate 5 s · REF-05, REF-12
```
35mm follow shot from behind the Little Haiti enforcer (REF-05) as he walks a lived-in Little Haiti street at night (worn colorful storefronts, metal roll gates, adult pedestrians) and calmly climbs the wooden porch steps of a multi-family house toward the entry door.
```

**14 · 01:20–01:27 · `shot_14_door_chicago.mp4`** · 7.0 s · generate 2 clips: 4 s door + 4 s phone
```
A) Interior corridor, 50mm. An apartment door shudders from a single impact on the other side; paint dust falls from the frame. An adult resident slips safely out a back door. A phone drops onto the tile floor.
B) 85mm insert: the phone vibrating on tile, screen showing an abstract incoming call with only the word "Chicago". Cut to adult relatives in a kitchen reacting anxiously to a call. No readable numbers or account details.
```
The "Chicago" screen is the only readable text in the film. The brief allows it. If the generator garbles it, use an abstract glowing call screen instead.

**15 · 01:27–01:31 · `shot_15_decision.mp4`** · 4.0 s · generate 5 s · REF-03, REF-06
```
50mm, empty alley at night. The Visitor (REF-03) stands alone beside the charcoal sedan, tucks his chain inside his shirt, looks toward the road, decides, gets in, and turns the steering wheel with white knuckles. Nervous survival, no hero pose.
```

**16 · 01:31–01:35 · `shot_16_opa_locka.mp4`** · 4.0 s · generate 5 s · REF-13, REF-06
```
24mm crane rise over Opa-locka at night: Moorish-influenced domes and arches at an industrial edge, broad road, haze. Two distant helicopters sweep searchlights through the haze in shifting triangular geometry. The final beam lands on the windshield of the charcoal sedan (REF-06) on the road below.
```

**17 · 01:35–01:39 · `shot_17_carol_city.mp4`** · 4.0 s · generate 5 s · REF-06 interior, REF-14
```
Interior of the charcoal sedan at night in Carol City. The windshield suddenly spiderwebs with cracks; the car jolts to a stop. An adult passenger ducks below the dash line in shock, breathing hard. A small dark smear on his sleeve. No wounds visible.
```
*Filter-safe fallback:* `Interior of the sedan at night; the windshield cracks from a sudden impact, the car lurches to a stop, an adult passenger ducks in fear. Shattered glass glitters in the streetlight.`

**18 · 01:39–01:43 · `shot_18_real_dade.mp4`** · 4.0 s · generate 4 × 1.5 s, or one 5 s match-cut clip
```
Match-cut sequence: an adult hand rests on a wall of framed family photographs; an adult buttons a black wool coat; a memorial procession seen from behind a chain-link fence; an empty hearse lane under a hard streetlight in rain.
```

**19 · 01:43–01:46 · `shot_19_vest_pyrex.mp4`** · 3.0 s · generate 4 s
```
85mm macro under a fluorescent tube. Adult hands pull a worn vest strap tight over a shirt. On a stained wooden counter, a scratched glass baking dish holds only a few clear water droplets. One hand trembles once; the fluorescent light flickers subtly.
```
*Filter-safe fallback:* `85mm macro, adult hands tighten a worn canvas strap; an empty scratched glass dish sits on a stained counter under a flickering fluorescent tube.`

**20 · 01:46–01:49 · `shot_20_predawn.mp4`** · 3.0 s · generate 5 s · REF-01, REF-07
```
Blue pre-dawn humidity. The Guide (REF-01) steps out of a dark industrial doorway. Slow 24mm crane from his boots up to a wide lived-in view: low-rise blocks, a canal, utility wires, distant highway lights. Not a tourist skyline.
```

**21 · 01:49–01:54 · `shot_21_consequences.mp4`** · 5.0 s · generate 5 × 1–1.5 s or one montage clip
```
Fast but readable montage of established locations in changed states: the Little Havana ventanita shutter drops; first light on the cemetery stones; the Little Haiti phone still glowing on tile; Opa-locka searchlights fading; the damaged charcoal sedan stopped on a Carol City shoulder; the Guide walking a connected road at dawn.
```

**22 · 01:54–01:57.0075 · `shot_22_final_eyes.mp4`** · 3.0075 s · generate 4–5 s · REF-01
```
85mm close-up of the Guide's (REF-01) eyes reflected in a rain-streaked car side window. City lights and one distant searchlight slide across the glass. He stays completely still, mouth closed.
```
The cut to black at the end of the audio comes from the edit. Don't ask the generator for a fade.

---

## Phase 3 audit checklist (per clip)

Face, age, wardrobe, chain, sedan scratch, screen direction, hands, fake text, logos, lip movement, stereotype, physics. If a clip fails, regenerate only that shot with the same references. Record the generator, generation ID and regeneration count in `impact_fuel_production_manifest.json`. When a clip passes, set `"qc_passed": true` on it (status moves RENDERED → QC_PASSED). `npm run final` moves every shot to CONFORMED once the export verifies. Replacing a clip resets it to RENDERED. `npm run status` keeps hand edits.
