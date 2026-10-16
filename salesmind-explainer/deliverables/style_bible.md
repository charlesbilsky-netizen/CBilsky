# Style bible

The one visual system every chapter follows. Built for repeated viewing in training rooms, on laptops and on headphones.

## Palette

| Token | Value | Use |
|---|---|---|
| Ground | #010E07 | the film's near-black green field |
| Brand green | #007F39 → #26BF6B | structure, confirmation, the label, stage rails |
| Violet | #9B8AFB | one meaning only: a suggestion not yet accepted |
| Gold | #D9B26A | peak principles, judgement calls, exceptions (White Label, Restricted) |
| Critical / warning / info | #E26D5A / #E0A53C / #6FA8DC | the alert hierarchy, always with a text label, never colour alone |
| Off-white / text / muted | #F2F4F1 / #E6EAE7 / #8F9C97 | type ramp |

The management deck's light blue is the slide standard; the film deliberately keeps the product's brand green on near-black so screens, plates and graphics read as one world. This choice is documented, not accidental: a Salesforce-blue grade would detach the film from the product it teaches.

## Typography

Inter only. Display 136/96/78, body 20–22, labels 13–15 uppercase with tracking. UI copy is always flat, screen-space and unblurred: no important text behind glow, particles or perspective.

## Space and 3D

- Screens sit on a green ground at 82%, never full-bleed, with a resting tilt (rotateX 1.5°, rotateY −1.2°) that breathes ±0.5–0.7° on a slow sine.
- Every cut settles in perspective: incoming shots turn 4.2° → 0 and over-scale 1.8% → 0 over ~22 frames.
- Each chapter's first screen rises in 3D (rotateX 5° → 0) after its title card.
- The hero frame (the film's first image and its thumbnail): the dashboard at rotateY −14°, rotateX 5°, floor shadow, rim light, glass sheen.
- Camera pushes are eased and framing-clamped: a screen edge never enters frame mid-push.
- Depth never costs legibility: rotations stay under 15°, type stays parallel to screen within 5° except on the hero object.

## Motion grammar

One easing (cubic bezier 0.65, 0, 0.35, 1). Call-outs draw a leader line, then the label. The synthetic cursor presses with a click ring. Spotlights dim everything but the subject. Peak moments hold longer (pads in the timeline), and gold principles rise on dark glass in the lower third.

## Sound

Voice leads at −16 LUFS. Music opens at −24 LUFS and ducks 10 dB under speech, from the known line times so it never pumps. Every effect maps to a visible event: chip ticks, accept clicks, a two-note alert, a confirmation, a riser into the main title, one owl notification in chapter 17. Master: transparent limiter, then linear loudness normalisation to −16.0 LUFS, true peak under −1.5 dBTP.

## The label

"TRAINING ENVIRONMENT · SYNTHETIC DATA · NOT A LIVE ACCOUNT" sits on the composition's top layer on every frame, never transformed by the 3D system, and glows when the narrator says the reassurance line. Simulated third-party surfaces (the Google permissions screen, the Ollie chat) carry a second label for their whole duration.

## Accessibility

Alert states pair colour with a label and a shape. Subtitles are at most two lines of 42 characters and never collide with the lower-third principles (which hold the frame alone). Contrast on dark panels stays above 4.5:1 for body text.
