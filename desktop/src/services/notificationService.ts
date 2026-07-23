import { Notification } from "electron";

export function showBackgroundNotification(): void {
    console.log("Showing background notification...");

    if (!Notification.isSupported()) {
        console.log("Notifications NOT supported");
        return;
    }

    console.log("Notifications supported");

    new Notification({
        title: "AIProxys Connector",
        body: "The connector is still running in the background.\nUse the menu bar icon to reopen it.",
    }).show();
}