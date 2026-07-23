import { settingsStore } from "./settingsStore.js";
const DEFAULT_STATE = {
    width: 1600,
    height: 950,
    x: undefined,
    y: undefined,
    maximized: false,
};
export function loadWindowState() {
    const state = settingsStore.get("window");
    return {
        ...DEFAULT_STATE,
        ...state,
    };
}
export function saveWindowState(win) {
    if (win.isDestroyed()) {
        return;
    }
    const bounds = win.getBounds();
    settingsStore.set("window", {
        width: bounds.width,
        height: bounds.height,
        x: bounds.x,
        y: bounds.y,
        maximized: win.isMaximized(),
    });
}
//# sourceMappingURL=windowState.js.map