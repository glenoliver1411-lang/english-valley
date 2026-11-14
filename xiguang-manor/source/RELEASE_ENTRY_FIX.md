# Formal entry repair — 2026-11-14

The previous `?v=full-stage1-20261114-1` link did not bypass the old offline HTML: the existing Workbox route deliberately ignores `v`. The new garden was published, but a player using that cache could continue to see the old game. Fresh-browser testing alone did not cover this delivery failure.

`enter-stage1.html` is a distinct, lightweight document outside the old precache graph. It detects an old worker, downloads the current complete release, backs up `xiguang-manor-v1` to the existing `:before-update` backup slot, and requests activation only while no other game window is open. It verifies the controlling worker and resource audit before navigating into the game. The main save key is never deleted or replaced by the entry.

The formal manifest keeps its existing identity and scope, with this document as the new start URL. The current worker fetches the entry online and falls back to its own complete cached entry offline. Content-hashed assets from older releases stay on the server. Existing preview workers retain their isolated scopes.

Fresh visitors keep the letter-first startup and background offline install. A `#forest-garden` entry requests one visit to the new playable garden after the existing gift or return animation; returning from that garden resumes the complete manor normally.

Targeted regression: reproduce the old formal cache and ignored `v` link, open the new document without visiting update menus, verify the native garden and old progress, close the complete browser and repeat offline. Test both Chromium and WebKit with a 390×844 touch viewport; no physical iPhone verification is claimed.

## Verified results

Both Chromium and WebKit reproduced the old cached garden, then passed automatic direct-entry upgrade and whole-browser offline restart. New cache audit: 180 resources / 47,269,922 bytes, no missing entries (181 CacheStorage entries including the activation marker). Protected legacy progress survived. All 120 model tests pass. Real device Safari was not tested. Actual results are recorded in `public/forest-garden-review/entry-update.json`; `entry-verified.png` is the running game after the upgrade.
