import { Tray, Menu, } from "electron";
import path from "path";
import { __dirname } from "../utils/paths.js";
let tray = null;
export function createTray(window, onQuit) {
    if (tray) {
        return tray;
    }
    const iconPath = path.join(__dirname, "../../assets/icon.png");
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