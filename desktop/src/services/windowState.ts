import Store from "electron-store";
import { BrowserWindow } from "electron";

interface WindowState {
    width: number;
    height: number;
    x?: number;
    y?: number;
    maximized: boolean;
}

const store = new Store<WindowState>({
    name: "window-state",
});

const DEFAULT_STATE: WindowState = {
    width: 1600,
    height: 950,
    x: undefined,
    y: undefined,
    maximized: false,
};

export function loadWindowState(): WindowState {
    return {
        ...DEFAULT_STATE,
        ...store.store,
    };
}

export function saveWindowState(win: BrowserWindow): void {
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