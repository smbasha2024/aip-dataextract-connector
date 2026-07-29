import {Tray, Menu, BrowserWindow, app} from "electron";
import path from "path";
import { getTrayIconPath } from "../utils/appPaths.js";


let tray: Tray | null = null;

export function createTray(
    window: BrowserWindow,
    onQuit: () => void
): Tray {

    if (tray) {
        return tray;
    }

    //const iconPath = app.isPackaged? path.join(
    //    process.resourcesPath, "assets", "icon.png")
    //    : path.join(__dirname, "../../assets", "icon.png");

    //console.log("Tray icon path:", iconPath);

    tray = new Tray(getTrayIconPath());
    tray.setToolTip("AIProxys Connector");

    tray.setContextMenu(
        Menu.buildFromTemplate([
            {
                label: "Open Dashboard",
                click: () => {
                    restoreWindow(window);
                },
            },

            {
                type: "separator",
            },

            {
                label: "Quit",
                click: onQuit,
            },
        ])
    );

    tray.on("double-click", () => {
        restoreWindow(window);
    });

    return tray;
}

function restoreWindow(window: BrowserWindow): void {
    if (window.isMinimized()) {
        window.restore();
    }

    window.show();
    if (!window.isFocused()) {
        window.focus();
    }
}