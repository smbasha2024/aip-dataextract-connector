import { BrowserWindow } from "electron";
import { settingsStore } from "./settingsStore.js";

interface WindowState {
    width: number;
    height: number;
    x?: number;
    y?: number;
    maximized: boolean;
}

const DEFAULT_STATE: WindowState = {
    width: 1600,
    height: 950,
    x: undefined,
    y: undefined,
    maximized: false,
};

export function loadWindowState(): WindowState {
    const state = settingsStore.get("window");

    return {
        ...DEFAULT_STATE,
        ...state,
    };
}

export function saveWindowState(
    win: BrowserWindow
): void {

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