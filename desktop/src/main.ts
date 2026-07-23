import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {loadWindowState, saveWindowState,} from "./services/windowState.js";
import { createTray } from "./services/trayService.js";

import {isBackgroundNotificationShown, setBackgroundNotificationShown,} from "./services/settingsService.js";
import {showBackgroundNotification,} from "./services/notificationService.js";
import {syncAutoLaunch,} from "./services/autoLaunchService.js";

import { isDockerRunning, getDockerStatus } from "./services/dockerService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
let mainWindow: BrowserWindow | null = null;
let isQuitting = false;

async function createWindow(): Promise<void> {
    const state = loadWindowState();
    console.log("Creating window...");
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
        /*
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
        */
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
            path.join(__dirname, "../../frontend/dist/index.html")
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

        if (isQuitting) {
            console.log("App is quitting");
            return;
        }

        console.log("Hiding window");
        event.preventDefault();
        mainWindow?.hide();

        console.log(
            "Background notification shown:",
            isBackgroundNotificationShown()
        );

        if (!isBackgroundNotificationShown()) {
            console.log("Should show notification");
            showBackgroundNotification();
            setBackgroundNotificationShown();
        }
    });

    mainWindow.on("closed", () => {
        console.log(">>>>>>>> CLOSED");
    });

    mainWindow.on("hide", () => {
        console.log(">>>>>>>> HIDE");
    });

    mainWindow.on("minimize", () => {
        console.log(">>>>>>>> MINIMIZE");
    });

    mainWindow.on("blur", () => {
        console.log(">>>>>>>> BLUR");
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
    await startApplication();
    console.log(
        "Docker Running:",
        await isDockerRunning()
    );
    console.log(
        "Docker Status:",
        await getDockerStatus()
    );
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        isQuitting = true;
        app.quit();
    }
});