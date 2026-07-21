import { Tray, Menu, app, } from "electron";
import path from "path";
import { __dirname } from "../utils/paths.js";
let tray = null;
export function createTray(window) {
    if (tray) {
        return tray;
    }
    const iconPath = path.join(__dirname, "../assets/icon.png");
    tray = new Tray(iconPath);
    tray.setToolTip("AIProxys Connector");
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: "Open Dashboard",
            click: () => {
                if (window.isMinimized()) {
                    window.restore();
                }
                window.show();
                window.focus();
            },
        },
        {
            type: "separator",
        },
        {
            label: "Quit",
            click: () => {
                app.quit();
            },
        },
    ]));
    tray.on("double-click", () => {
        if (window.isMinimized()) {
            window.restore();
        }
        window.show();
        window.focus();
    });
    return tray;
}
//# sourceMappingURL=trayService.js.map