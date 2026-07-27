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

    if (!app.isPackaged) {
        return;
    }
    //if (app.isPackaged && settings.openAtLogin) {
    app.setLoginItemSettings({
        openAtLogin: true,
    });
}

export function disableAutoLaunch(): void {
    settingsStore.set(
        "connector.autoStart",
        false
    );

    if (!app.isPackaged) {
        return;
    }
    //if (app.isPackaged && settings.openAtLogin) {
    app.setLoginItemSettings({
        openAtLogin: false,
    });
}

export function syncAutoLaunch(): void {
    if (!app.isPackaged) {
        return;
    }
    //if (app.isPackaged && settings.openAtLogin) {
    app.setLoginItemSettings({
        openAtLogin: isAutoLaunchEnabled(),
    });
}