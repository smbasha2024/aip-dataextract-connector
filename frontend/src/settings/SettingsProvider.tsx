import { useCallback, useEffect, useMemo, useState, type ReactNode,} from "react";
import { SettingsContext } from "./SettingsContext";
import { connectorTransport } from "../platform";
import type { AppSettings } from "../platform/settings";

interface Props {
    children: ReactNode;
}

export function SettingsProvider({ children }: Props) {
    const [settings, setSettings] = useState<AppSettings | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadSettings() {
            try {
                const state = await connectorTransport.getSettings();

                if (!cancelled) {
                    setSettings(state);
                }
            } catch (err) {
                console.error("Failed to load settings", err);
            }
        }

        void loadSettings();

        return () => {
            cancelled = true;
        };
    }, []);

    const refresh = useCallback(async () => {
        const state = await connectorTransport.getSettings();
        setSettings(state);
    }, []);

    const save = useCallback(async (settings: AppSettings) => {
        const updated = await connectorTransport.updateSettings(settings);
        setSettings(updated);
    }, []);

    const value = useMemo(
        () => ({
            settings,
            refresh,
            save,
        }),
        [settings, refresh, save],
    );

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}