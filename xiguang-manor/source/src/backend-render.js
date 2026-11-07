// Manor is a compatibility backend. Only the new world and its child scenes
// own visible cameras. Hiding it in main's ready callback is too late for
// preload/retry lifecycle frames and can be undone by a scene restore.
export function hideBackend(scene){
 scene.sys.setVisible(false);
 for(const camera of scene.cameras.cameras)camera.setVisible(false);
}
export function detachLegacyMap(scene){
 hideBackend(scene);
 // Keep all references, collision/data APIs and update lists intact. A later
 // world.setVisible(true) must never put these legacy pictures on screen.
 scene.world.removeFromDisplayList();
 scene.roomImage.removeFromDisplayList();
}
