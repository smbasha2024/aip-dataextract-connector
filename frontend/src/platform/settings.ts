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