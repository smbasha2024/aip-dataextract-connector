const { app, BrowserWindow, shell } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

const WINDOW = {
    title: "AIProxys Connector",
    width: 1600,
    height: 950,
    minWidth: 1200,
    minHeight: 700,
};

let mainWindow;

async function createWindow() {
    mainWindow = new BrowserWindow({
        title: WINDOW.title,

        width: WINDOW.width,
        height: WINDOW.height,

        minWidth: WINDOW.minWidth,
        minHeight: WINDOW.minHeight,

        show: false,

        backgroundColor: "#f1f5f9",

        autoHideMenuBar: true,

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    mainWindow.setMenu(null);

    mainWindow.webContents.setWindowOpenHandler(() => ({
        action: "deny",
    }));

    mainWindow.webContents.setZoomFactor(1);
    mainWindow.webContents.setVisualZoomLevelLimits(1, 1);

    if (isDev) {
        await mainWindow.loadURL("http://localhost:5173");

        mainWindow.webContents.openDevTools({
            mode: "detach",
        });
    } else {
        await mainWindow.loadFile(
            path.join(__dirname, "../frontend/dist/index.html")
        );
    }

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });
}

async function startApplication() {
    await createWindow();

    app.on("activate", async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            await createWindow();
        }
    });
}

app.whenReady().then(startApplication);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});