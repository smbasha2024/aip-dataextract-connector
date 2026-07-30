import { createContext } from "react";
import type { AppSettings } from "../platform/settings";

export interface SettingsContextValue {
    settings: AppSettings | null;
    refresh(): Promise<void>;
    save(settings: AppSettings,): Promise<void>;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);