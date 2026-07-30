import { ipcMain } from "electron";
import {getSettings, updateSettings,} from "../services/settingsService.js";
import type { AppSettings } from "../services/settingsStore.js";

export function registerSettingsHandlers() {
    ipcMain.handle("settings:get", () => getSettings(),);

    ipcMain.handle("settings:update", (_, settings: AppSettings) => updateSettings(settings),);
}