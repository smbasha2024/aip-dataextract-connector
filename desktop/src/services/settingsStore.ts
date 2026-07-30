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

        startDockerAutomatically: boolean;
        restartIfStopped: boolean;
    };

    application: {
        launchAtLogin: boolean;
        closeToTray: boolean;
        minimizeToTray: boolean;
        autoCheckUpdates: boolean;
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
            startDockerAutomatically: true,
            restartIfStopped: true,
        },
        
        application: {
            launchAtLogin: true,
            closeToTray: true,
            minimizeToTray: true,
            autoCheckUpdates: true,
        },
    },
});