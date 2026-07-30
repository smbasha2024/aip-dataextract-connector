import { settingsStore,  AppSettings} from "./settingsStore.js";

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

export function getSettings() {
    return settingsStore.store;
}

export function updateSettings(settings: AppSettings) {
    settingsStore.store = settings;
    return settingsStore.store;
}

export function getConnectorSettings() {
    return settingsStore.get("connector");
}

export function getApplicationSettings() {
    return settingsStore.get("application");
}