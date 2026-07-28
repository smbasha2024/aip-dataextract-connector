import { Tray, Menu, app } from "electron";
import path from "path";
import { __dirname } from "../utils/paths.js";
let tray = null;
export function createTray(window, onQuit) {
    if (tray) {
        return tray;
    }
    const iconPath = app.isPackaged ? path.join(process.resourcesPath, "assets", "icon.png")
        : path.join(__dirname, "../../assets", "icon.png");
    console.log("Tray icon path:", iconPath);
    tray = new Tray(iconPath);
    tray.setToolTip("AIProxys Connector");
    tray.setContextMenu(Menu.buildFromTemplate([
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
    ]));
    tray.on("double-click", () => {
        restoreWindow(window);
    });
    return tray;
}
function restoreWindow(window) {
    if (window.isMinimized()) {
        window.restore();
    }
    window.show();
    if (!window.isFocused()) {
        window.focus();
    }
}
//# sourceMappingURL=trayService.js.map