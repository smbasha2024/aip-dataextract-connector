import { app, BrowserWindow } from "electron";
//import { fileURLToPath } from "node:url";
//import path from "node:path";

import {loadWindowState, saveWindowState,} from "./services/windowState.js";
import { createTray } from "./services/trayService.js";

import {isBackgroundNotificationShown, setBackgroundNotificationShown,} from "./services/settingsService.js";
import {showBackgroundNotification,} from "./services/notificationService.js";
import {syncAutoLaunch,} from "./services/autoLaunchService.js";

import { isDockerRunning, getDockerStatus } from "./services/dockerService.js";
import { healthCheck, waitForBackend} from "./services/backendService.js";
import {startConnectorRuntime} from "./services/connectorRuntimeService.js"
import {showStartupError,} from "./services/dialogService.js";
import {createStartupWindow, updateStartupStatus, closeStartupWindow,} from "./services/startupWindowService.js";
import {startRuntimeMonitor, stopRuntimeMonitor,} from "./services/runtimeMonitorService.js";
import {onRuntimeStateChanged, subscribeRuntimeState} from "./services/runtimeStateService.js";
import {registerRuntimeHandlers,} from "./ipc/runtime.js";
import { getAssetPath, getFrontendFile, getPreloadPath, getAppIconPath} from "./utils/appPaths.js";

import log from "electron-log";

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    log.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    log.error("Unhandled Rejection:", err);
});

const WINDOW = {
    title: "AIProxys Connector",
    width: 1600,
    height: 950,
    minWidth: 1200,
    minHeight: 700,
};

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
    process.exit(0);
}
app.setName("AIProxys Connector");

if (process.platform === "darwin" && app.dock) {
    app.dock.setIcon(getAppIconPath());
}

let mainWindow: BrowserWindow | null = null;
let isQuitting = false;

async function createWindow(): Promise<void> {
    const state = loadWindowState();
    console.log("Creating window...");
    log.info("Creating window...");
    mainWindow = new BrowserWindow({
        title: WINDOW.title,

        width: state.width,
        height: state.height,

        x: state.x,
        y: state.y,

        minWidth: WINDOW.minWidth,
        minHeight: WINDOW.minHeight,

        show: false,
        backgroundColor: "#f1f5f9",
        autoHideMenuBar: true,
        
        webPreferences: {
            preload: getPreloadPath(),
            contextIsolation: true,
            nodeIntegration: false,
        },
        icon: getAppIconPath(),
    });

    mainWindow.setMenu(null);

    // Prevent opening new windows
    mainWindow.webContents.setWindowOpenHandler(() => ({
        action: "deny",
    }));

    /*
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);

        return {
            action: "deny",
        };
    });
    */

    // Disable zoom
    mainWindow.webContents.setZoomFactor(1);
    mainWindow.webContents.setVisualZoomLevelLimits(1, 1);

    if (!app.isPackaged) {
        await mainWindow.loadURL("http://localhost:5173");

        mainWindow.webContents.openDevTools({
            mode: "detach",
        });
    } else {
        await mainWindow.loadFile(
            getFrontendFile("index.html")
        );
    }

    mainWindow.once("ready-to-show", () => {
        if (!mainWindow) return;

        if (state.maximized) {
            mainWindow.maximize();
        }

        mainWindow.show();
    });

    const saveState = () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            saveWindowState(mainWindow);
        }
    };

    mainWindow.on("resize", () => {
        if (!mainWindow?.isMaximized()) {
            saveState();
        }
    });

    mainWindow.on("move", () => {
        if (!mainWindow?.isMaximized()) {
            saveState();
        }
    });

    mainWindow.on("close", (event) => {
        console.log("Window close event fired");
        log.info("Window close event fired");

        if (isQuitting) {
            console.log("App is quitting");
            log.info("App is quitting");
            return;
        }

        console.log("Hiding window");
        log.info("Hiding window");
        event.preventDefault();
        mainWindow?.hide();

        console.log(
            "Background notification shown:",
            isBackgroundNotificationShown()
        );
        log.info(
            "Background notification shown:",
            isBackgroundNotificationShown()
        );

        if (!isBackgroundNotificationShown()) {
            console.log("Should show notification");
            log.info("Should show notification");
            showBackgroundNotification();
            setBackgroundNotificationShown();
        }
    });

    mainWindow.on("closed", () => {
        console.log(">>>>>>>> CLOSED");
        log.info(">>>>>>>> CLOSED");
    });

    mainWindow.on("hide", () => {
        console.log(">>>>>>>> HIDE");
        log.info(">>>>>>>> HIDE");
    });

    mainWindow.on("minimize", () => {
        console.log(">>>>>>>> MINIMIZE");
        log.info(">>>>>>>> MINIMIZE");
    });

    mainWindow.on("blur", () => {
        console.log(">>>>>>>> BLUR");
        log.info(">>>>>>>> BLUR");
    });
}

async function startApplication(): Promise<void> {
    try {
        app.on("second-instance", () => {
            if (!mainWindow) {
                return;
            }

            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }

            if (!mainWindow.isVisible()) {
                mainWindow.show();
            }

            mainWindow.focus();
            //mainWindow.show();
        });

        registerRuntimeHandlers();
        await createWindow();
        syncAutoLaunch();

        if (mainWindow) {
            createTray(
                mainWindow,
                () => {
                    isQuitting = true;
                    app.quit();
                }
            );
        }

        app.on("activate", async () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                await createWindow();
            }
        });
    } catch (err) {
        console.error("Failed to create window:", err);
        log.error("Failed to create window:", err);
        throw err;
    }
    /*
    app.on("activate", async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            await createWindow();
        }
    });
    */
}

app.whenReady().then(async () => {
    try {
        createStartupWindow();

        await updateStartupStatus("Starting local connector...");
        await startConnectorRuntime(updateStartupStatus,);
        startRuntimeMonitor();

         // <-- ADD IT HERE
        subscribeRuntimeState((state) => {
            console.log("Sending runtime update:", state.status,);
            log.info("Sending runtime update:", state.status,);

            if (!mainWindow) { return; }

            mainWindow.webContents.send("runtime:stateChanged", state,);
        });

        onRuntimeStateChanged((state) => {
            console.log("Runtime State:",state,);
            log.info("Runtime State:",state,);
        });
        await updateStartupStatus("Opening dashboard...");

        await startApplication();
        closeStartupWindow();
        /*
        console.log(
            "Docker Running:",
            await isDockerRunning()
        );
        console.log(
            "Docker Status:",
            await getDockerStatus()
        );

        console.log("Checking Local Connector...");
        const healthy = await healthCheck();
        console.log("Healthy:", healthy);

        console.log("Waiting for connector...");
        await waitForBackend();
        console.log("Connector is ready.");
        */
    }
    catch (error) {
        closeStartupWindow();
        console.error(error);
        log.error(error);
         await showStartupError(
            error instanceof Error? error.message : "Unknown startup error."
        );
        app.quit();
    }

});

app.on("before-quit", () => {
    stopRuntimeMonitor();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        isQuitting = true;
        app.quit();
    }
});