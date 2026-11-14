# Formal loading repair — 2026-11-14

## Why the second entry still blocked a phone

The previous `?v=` release link was ignored by the legacy Workbox URL matcher. Release 2 addressed that stale HTML with an update bridge, but then made existing players wait for the complete roughly 47 MB offline package and cache audit before entering the game. Slow or failed nonessential downloads could therefore hold the player on “检测到旧离线版本 / 准备新版资料”. The fast local update test did not represent this phone experience.

## Release 3

- Each formal build now emits its own game document, e.g. `game-full-stage1-20261114-3.html`. Its dependencies use Vite content hashes. An older worker cannot substitute its cached `index.html` for this distinct path; unchanged, identical assets can still come from the old cache.
- `enter-stage1.html` redirects directly to that document using a tiny inline script and provides a real fallback link. It imports no game engine, cache auditor, save model or update coordinator. It never waits for Service Worker installation, activation, repair or a full download.
- Ordinary game boot also starts immediately, without a release-pass redirect. The manifest retains its app ID and scope and starts the version-specific game document.
- The full current Workbox package includes the new game document, all lazy game modules and all native art. Its registration/download remains behind the existing foreground-ready gate. Offline readiness still requires the complete current version. A failed nonessential download cannot incorrectly claim offline readiness.
- An old active version of this scope's own `sw.js` is a valid registration to observe while downloading the new version. Different origins, script paths and scopes remain rejected.
- Complete downloads still use the existing user-confirmed update, save backup, safe-state checks, multi-window guard and verified reload. The entry itself does not activate workers or change saves. Older content-hashed assets and prior previews remain on the server.

## Regression

The production fixture installs real old releases with saved candy, outfit data, purchased furniture, flower stock, relics and wishes. It then serves the latest entry while returning503 for the native night-art file: morning gameplay must open using the new document while the old worker still controls the page, and the latest offline flag must remain false. After restoring the network, a saved update from the main world completes the cache; the complete browser is closed, restarted offline, and both direct entry and the original root must still work with the protected progress.

Chromium and WebKit automated touch viewports are used. No physical iPhone test is claimed. This is a loading fix; no art, gameplay, economy or save schema was changed.

## Results

Both browser engines passed the blocked nonessential download, explicit update retry, save comparison, complete-browser offline restart and original-root restart. Chromium began with the older129-file release; WebKit began with release2. The new verified cache contains178 resources /47,266,875 bytes, with no missing resources. All120 model tests pass. Entry timings in the evidence are from local production fixtures, not measured iPhone network performance.
