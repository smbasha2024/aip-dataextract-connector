import { CONFIG } from "../config/config";

function canNotify(): boolean {

    if (!("Notification" in window)) {
        console.log("Notification API not supported");
        return false;
    }

    if (Notification.permission !== "granted") {
        console.log("Notification permission not granted");
        return false;
    }

    if (document.visibilityState === "visible") {
        console.log("Dashboard already visible");
        return false;
    }

    return true;
}

function playSound() {

    const audio = new Audio("/sounds/notification.mp3");

    audio.play()
        .then(() => {
            console.log("Audio started");
        })
        .catch((err) => {
            console.error("Audio failed:", err);
        });

}

function showBrowserNotification(
    title: string,
    body: string,
    playAudio = true,
) {

    if (!canNotify()) {
        return;
    }

    const notification = new Notification(
        title,
        {
            body,
            icon: "/favicon.ico",
        }
    );

    if (playAudio) {
        playSound();
    }

    notification.onclick = () => {
        window.focus();
        notification.close();
    };

    // Optional
    /*
    setTimeout(() => {
        notification.close();
    }, 15000);
    */
}

export const NotificationService = {
    notifyInputRequired(title: string) {
        showBrowserNotification(
            CONFIG.appName,
            title,
            true,
        );
    },

    notifyJobCompleted(jobId: string) {
        showBrowserNotification(
            CONFIG.appName,
            `Job ${jobId} completed successfully.`,
            false,
        );
    },

    notifyJobFailed(jobId: string) {
        showBrowserNotification(
            CONFIG.appName,
            `Job ${jobId} failed.`,
            true,
        );
    },

    notifyDownloadReady(filename: string) {
        showBrowserNotification(
            CONFIG.appName,
            `Download ready: ${filename}`,
            false,
        );
    },

    notifyCloudDisconnected() {
        showBrowserNotification(
            CONFIG.appName,
            "Connection to Cloud Server lost.",
            true,
        );
    },

    notifyCloudConnected() {
        showBrowserNotification(
            CONFIG.appName,
            "Connected to Cloud Server.",
            false,
        );
    },

};