import { settingsStore } from "./settingsStore.js";

export function isBackgroundNotificationShown(): boolean {
    return settingsStore.get(
        "ui.backgroundNotificationShown"
    );
}

export function setBackgroundNotificationShown(): void {
    settingsStore.set(
        "ui.backgroundNotificationShown",
        true
    );
}