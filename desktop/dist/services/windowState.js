import Store from "electron-store";
const store = new Store({
    name: "window-state",
});
const DEFAULT_STATE = {
    width: 1600,
    height: 950,
    x: undefined,
    y: undefined,
    maximized: false,
};
export function loadWindowState() {
    return {
        ...DEFAULT_STATE,
        ...store.store,
    };
}
export function saveWindowState(win) {
    if (win.isDestroyed()) {
        return;
    }
    const bounds = win.getBounds();
    store.set({
        width: bounds.width,
        height: bounds.height,
        x: bounds.x,
        y: bounds.y,
        maximized: win.isMaximized(),
    });
}
//# sourceMappingURL=windowState.js.map