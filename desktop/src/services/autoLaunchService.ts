import { app } from "electron";

import { settingsStore } from "./settingsStore.js";

export function isAutoLaunchEnabled(): boolean {
    return settingsStore.get(
        "connector.autoStart"
    );
}

export function enableAutoLaunch(): void {
    settingsStore.set(
        "connector.autoStart",
        true
    );

    app.setLoginItemSettings({
        openAtLogin: true,
    });
}

export function disableAutoLaunch(): void {
    settingsStore.set(
        "connector.autoStart",
        false
    );

    app.setLoginItemSettings({
        openAtLogin: false,
    });
}

export function syncAutoLaunch(): void {
    app.setLoginItemSettings({
        openAtLogin: isAutoLaunchEnabled(),
    });
}