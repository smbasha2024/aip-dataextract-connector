const CHANNEL_NAME = "aiproxys-dashboard";
const dashboardId = crypto.randomUUID();
const channel = new BroadcastChannel(CHANNEL_NAME);

let releaseLock: (() => void) | null = null;

type Message = {
    type: "FOCUS";
    sender: string;
};

// ------------------------------------------------------
// Always listen for focus requests
// ------------------------------------------------------

channel.onmessage = (event: MessageEvent<Message>) => {
    const msg = event.data;

    if (msg.sender === dashboardId) {
        return;
    }

    if (msg.type === "FOCUS") {
        console.log("FOCUS message received");
        notifyDashboardRequested();
    }
};

// ------------------------------------------------------
// Leader election using Web Locks
// ------------------------------------------------------

export async function ensureSingleDashboard(): Promise<boolean> {
    if (!("locks" in navigator)) {
        console.warn("Web Locks API not supported.");
        return true;
    }

    let acquired = false;
    console.log("Requesting dashboard lock...");
    await new Promise<void>((resolve) => {
        navigator.locks.request(
            "aiproxys-dashboard",
            {
                ifAvailable: true,
            },

            async (lock) => {
                 console.log("Lock callback:", lock);
                if (!lock) {
                    console.log("Lock NOT acquired");
                    acquired = false;
                    resolve();
                    return;
                }
                console.log("Lock acquired!");
                acquired = true;

                console.log("Dashboard lock acquired.");

                resolve();

                await new Promise<void>((lockReleased) => {
                    releaseLock = lockReleased;
                });

            }
        );

    });
    console.log("Returning:", acquired);
    return acquired;
}

// ------------------------------------------------------
// Release lock
// ------------------------------------------------------

export function releaseDashboard() {
    if (releaseLock) {
        releaseLock();
        releaseLock = null;
    }
}

// ------------------------------------------------------
// Ask existing dashboard to get user's attention
// ------------------------------------------------------

export function notifyExistingDashboard() {
    console.log("Sending FOCUS message");

    channel.postMessage({
        type: "FOCUS",
        sender: dashboardId,
    });
}

// ------------------------------------------------------
// Existing dashboard behaviour
// ------------------------------------------------------

function notifyDashboardRequested() {
    console.log("Dashboard focus requested");

    window.focus();

    if (!document.hasFocus()) {
        flashTitle();
    }

    if (
        document.visibilityState !== "visible" &&
        Notification.permission === "granted"
    ) {

        const notification = new Notification(
            "AIProxys Connector",
            {
                body: "Another dashboard was opened. This dashboard is already active.",
                icon: "/favicon.ico",
            }
        );

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

    }

    window.dispatchEvent(
        new CustomEvent("dashboard-focus-request")
    );
}

// ------------------------------------------------------
// Flash browser title
// ------------------------------------------------------

function flashTitle() {
    const original = document.title;

    let count = 0;

    const timer = window.setInterval(() => {

        document.title =
            document.title === original
                ? "🔔 AIProxys Connector"
                : original;

        count++;

        if (count >= 8) {
            clearInterval(timer);
            document.title = original;
        }

    }, 700);
}