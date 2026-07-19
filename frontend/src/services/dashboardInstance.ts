const CHANNEL_NAME = "aiproxys-dashboard";
const dashboardId = crypto.randomUUID();
const startedAt = Date.now();
const channel = new BroadcastChannel(CHANNEL_NAME);

let existingDashboard = false;
type Message =
    | {
          type: "PING";
          sender: string;
          startedAt: number;
      }
    | {
          type: "PONG";
          sender: string;
          startedAt: number;
      }
    | {
          type: "FOCUS";
          sender: string;
      };

export async function ensureSingleDashboard(): Promise<boolean> {
    existingDashboard = false;
    channel.onmessage = (event: MessageEvent<Message>) => {
        const msg = event.data;

        if (msg.sender === dashboardId)
            return;

        switch (msg.type) {
            case "PING":
                channel.postMessage({
                    type: "PONG",
                    sender: dashboardId,
                    startedAt,
                });
                break;

            case "PONG":
                if (msg.startedAt < startedAt) {
                    existingDashboard = true;
                }
                break;

            case "FOCUS":
                notifyDashboardRequested();
                break;
        }
    };

    channel.postMessage({
        type: "PING",
        sender: dashboardId,
        startedAt,
    });

    await new Promise(resolve =>
        setTimeout(resolve, 500)
    );

    return !existingDashboard;
}

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

function notifyDashboardRequested() {
    flashTitle();

    if (
        document.visibilityState !== "visible" &&
        Notification.permission === "granted"
    ) {
        const notification = new Notification(
            "AIProxys Connector",
            {
                body: "Another dashboard was opened. This is the active dashboard.",
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

export function notifyExistingDashboard() {
    channel.postMessage({
        type: "FOCUS",
        sender: dashboardId,
    });
}