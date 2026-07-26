import { BrowserWindow } from "electron";

let startupWindow: BrowserWindow | null = null;

export function createStartupWindow(): BrowserWindow {
    if (startupWindow) {
        return startupWindow;
    }

    startupWindow = new BrowserWindow({
        width: 520,
        height: 240,

        resizable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        closable: false,

        show: false,
        center: true,
        title: "AIProxys Connector",
        autoHideMenuBar: true,
        backgroundColor: "#ffffff",
    });

    startupWindow.setMenu(null);

    startupWindow.loadURL(
        "data:text/html;charset=utf-8," +
        encodeURIComponent(`
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8">
            <style>
            body{
                margin:0;
                font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
                display:flex;
                justify-content:center;
                align-items:center;
                height:100vh;
                background:white;
            }
            #status{
                font-size:18px;
                color:#333;
            }
            </style>
            </head>
            <body>

            <div id="status">
            Starting AIProxys Connector...
            </div>

            </body>
            </html>
        `)
    );

    startupWindow.once("ready-to-show", () => {
        startupWindow?.show();
    });

    return startupWindow;
}

export async function updateStartupStatus(message: string,): Promise<void> {
    if (!startupWindow) {
        return;
    }

    await startupWindow.webContents.executeJavaScript(`
        document.getElementById("status").innerText =
            ${JSON.stringify(message)};
    `);
}

export function closeStartupWindow(): void {
    if (!startupWindow) {
        return;
    }

    //startupWindow.close();
    startupWindow.destroy();
    startupWindow = null;
}