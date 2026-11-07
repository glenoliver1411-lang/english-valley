---
name: xiguang-scene-art
description: Use when upgrading or integrating illustrations, pixel art, 2.5D scenes, indoor scenes, floral shop, ruins, parallax, lighting, or character occlusion in the Xiguang Manor Phaser 3 game. Prefer real provided image assets over procedural approximations and verify the actual mobile-rendered result.
---

# Xiguang Manor — illustration-first art integration skill

This skill is REPO-SCOPED to `xiguang-manor/source/` in `glenoliver1411-lang/english-valley`.

## Outcome

Convert a high-quality, licensed or user-provided ORIGINAL illustration into a *playable Phaser scene* **without substituting a lower-quality Canvas/Pillow reconstruction**. The core objective is visual fidelity to the supplied asset, not maximizing tile count, filter strength, or decorative particle count.

## Required inputs

- Provided, original illustrative PNG: `assets/florist_original_concept.png` (1199×1312 RGB, art reference and production candidate, not a pre-layered map).
- The current source code and preview screenshots, especially `src/florist-scene.js`, `src/expedition-art.js`, `src/v5-scenes.js`, current art/source assets, scene coordinates, save model, Vite build and PWA configuration.
- User-supplied screenshots are references **only** unless user owns redistribution rights. Do not publish third-party images or source game screenshots.

## Non-negotiable rules

1. **Never redraw the supplied full scene using primitive shapes, gradients, generated rectangles, or repeated tiles** as a fallback. Use the supplied pixels intact at the best practical display scale. Canvas composition is allowed for *technical operations* like cropping, masking, and preparing layers, but not as a substitute for real illustrated scenery.
2. Avoid a false promise of automatic perfect layers. A flattened RGB illustration has no transparent sprites or hidden background under the furniture. For clean occlusion, manually prepare masks and repaint/reconstruct missing background where necessary; for inaccessible objects, use walk-blocking polygons instead of fake foreground masks.
3. Do not add a player sprite over a static image without designing navigation and collisions. For the first scene, restrict movement to accessible first-floor walkable regions; leave upper mezzanine visible but non-walkable until stairs/pathfinding and occlusion are solved.
4. Match the existing 3/4/isometric-ish scene perspective. Character foot anchor, size, shadow, material palette, and walk direction must make sense. Don't vertically stretch the original illustration to 432×850. Use uniform scale and camera viewport/crop to maintain aspect ratio.
5. Use image-native layers wherever possible: `background`, `occluders`, `interactive sprites`, `player`, `light overlays`, `UI`. Existing flowers and checkout desk are embedded in the art; do not draw second copies on top. If one illustrated object must move or animate, first remove/repair its original painted instance.
6. Preserve gameplay and save compatibility: florist stock and selling, bouquet wrap, furniture purchasing, existing single save key, garden, equipment, ruins, offline PWA; no NPCs unless explicitly asked.
7. Never rely on runtime external-hosted image URLs. Bundle release assets locally and verify offline startup after reload.
8. Do not overwrite the main production site or existing previews. Work in a dedicated branch and a new preview path; keep a rollback point.
9. Show *actual Phaser screenshots*, not just independent concept art, with mobile viewport (390×844 and 375×667). Compare against original supplied art and the preceding gameplay preview.
10. If an art-generation/editing tool is unavailable, list the exact missing transparent PNGs or painted variants and deliver an honest achievable prototype. A skill cannot create a graphics capability that the execution environment lacks.

## Working workflow

A. **Audit first.** Inspect existing Phaser scene architecture, hit regions, on-screen buttons, source asset licenses, build scripts, PWA caching and current art. Capture a screenshot baseline.

B. **Art fidelity plan.** Review `references/PRODUCTION_GUIDE.md`. Identify the visible first-floor floor polygon, counters and furniture footprint, foreground occluder polygons, mezzanine and stairs as initially non-walkable. Make a short scene manifest `xiguang-manor/source/src/assets/scenes/florist/SCENE_PLAN.md` with the chosen scale, coordinate transforms, source images and object anchors.

C. **Asset preparation.** Copy `assets/florist_original_concept.png` to `xiguang-manor/source/src/assets/scenes/florist/` under a stable name. Treat it as a high-resolution final illustrated BG. Keep source original; use texture formats/sizing as appropriate. If generating masks, store them as transparent PNG; never destructively overwrite the original. When creating occlusion, mask only genuinely foreground structures; do not erase fine art or hide whole rooms accidentally.

D. **Playability.** Implement first-floor walking and click/touch movement, collisions, counters, wrapping, home/garden navigation. Preserve old gameplay behavior and save contract. Do not enable second-floor walking until visual & physical alignment are validated. Ensure mobile view preserves the art instead of filling with stretched or overlapping UI.

E. **Lighting.** Keep the illustration's painted sunbeams and shadow gradients. Add subtle additional dynamic effects sparingly; built-in Phaser 2D lighting, if used, must have a fallback for unsupported Canvas renderers. Do not cover the artwork with dark/bright full-screen tints.

F. **QA.** Run node tests and available Playwright Chromium/WebKit, capture real gameplay, verify no black bars except intentional framing, no floor walking through furniture, no floating character, no ghosted duplicated interactive objects, no pixel blur from rescaling, buttons accessible, offline all scenes, save consistent across reload.

G. **Deliver.** Publish isolated preview and a side-by-side actual gameplay screenshot; enumerate created assets and distinguish completed behavior from limitations. Stop after one playable florist demonstration, solicit review before expanding to ruins.

## Supporting references

- `references/PRODUCTION_GUIDE.md`
- `references/QUALITY_GATE.md`
