import Store from "electron-store";

export interface AppSettings {
    window: {
        x?: number;
        y?: number;
        width: number;
        height: number;
        maximized: boolean;
    };

    ui: {
        backgroundNotificationShown: boolean;
    };

    connector: {
        autoStart: boolean;
        startHidden: boolean;
    };
}

export const settingsStore = new Store<AppSettings>({
    name: "aiproxys-connector",
    defaults: {
        window: {
            width: 1600,
            height: 950,
            maximized: false,
        },

        ui: {
            backgroundNotificationShown: false,
        },

        connector: {
            autoStart: false,
            startHidden: false,
        },
    },
});