import { dialog } from "electron";

export async function showStartupError(
    message: string,
): Promise<void> {

    await dialog.showMessageBox({
        type: "error",
        title: "AIProxys Connector",
        message: "Unable to start AIProxys Connector",
        detail: message,
        buttons: ["Exit"],
        defaultId: 0,
        noLink: true,
    });
}

export async function showDockerNotRunningDialog(): Promise<boolean> {
    const result = await dialog.showMessageBox({
        type: "warning",
        title: "AIProxys Connector",
        message: "Docker Desktop is not running.",
        detail:
            "AIProxys Connector requires Docker Desktop.\n\nWould you like to start Docker now?",
        buttons: [
            "Start Docker",
            "Exit",
        ],
        defaultId: 0,
        cancelId: 1,
        noLink: true,
    });
    return result.response === 0;
}

export async function showRetryDialog(message: string,): Promise<boolean> {
    const result = await dialog.showMessageBox({
        type: "warning",
        title: "AIProxys Connector",
        message,
        buttons: [
            "Retry",
            "Exit",
        ],
        defaultId: 0,
        cancelId: 1,
        noLink: true,
    });
    return result.response === 0;
}