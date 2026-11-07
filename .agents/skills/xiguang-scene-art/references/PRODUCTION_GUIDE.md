# Art direction and technical integration

- The supplied illustration `../assets/florist_original_concept.png` is a 1199×1312 RGB image. It is a single FLATTENED image. It contains an upstairs nook, staircase, raised counters, tall window and a wide first-floor area; it's not a tile map or physically correct navigable geometry out of the box.
- For first iteration, make the *first-floor* playable; upper-floor movement and walkable stairs are excluded unless separate layered artwork and perspective-specific navigation are established.
- Draw a walkability polygon based on visually unobstructed floor area. This is not the same as 'all non-wall pixels': plan collision outlines for flower tubs, table, counter, railing, stairs, furniture, and door position. Ensure geometry coordinates are transformed after aspect-preserving scaling.
- For large windows, retain painted daylight as the primary light. In a subsequent version, generate alternate night art of identical composition rather than applying only a dark tinted rectangle.
- A flattened backdrop can make the game look beautiful quickly, but accurate occlusion / moving treasure chests requires real transparent assets and retouched clean plates. Export those separately from art-generation tools where possible; do not fake independent source layers.
- Use visual consistency tests: scene PNG versus actual in-game screenshot, 390x844 and 375x667. Crop camera deliberately, never distort source aspect ratio, and keep gesture controls unobtrusive.
- Phaser 3.90 + Vite + PWA with existing assets and save system; preserve feature code. If introducing tiled scene maps, use Tiled JSON plus Phaser support, but only when that improves level design. Tiled does not recreate the painting.
- Existing project can use Playwright to automatically capture UI and perform interactions; prefer that over installing a second visual-test framework.
- Aseprite can help with future transparent sprite editing or exporting spritesheets if available, but is not required to place one flattened illustration; do not block on its installation.
- Source licensing: the concept art is newly generated from the user's high-level original art direction; user-provided third-party image screenshots remain reference-only. Do not copy those screenshots as game backgrounds.
