import { useConnectorStore } from "../store/connectorStore";
import axios from "axios";
import { EventType } from "../types/events";
import type { ConnectorEvent } from "../types/event";
import { CONFIG } from "../config/config";

import type {
    StatusPayload,
    HeartbeatPayload,
    JobPayload,
    LogPayload,
    DownloadPayload,
    InputRequiredPayload,
} from "../types/payloads";

class ConnectorWebSocket {
    private socket: WebSocket | null = null;

    connect() {
        if (
            this.socket &&
            this.socket.readyState === WebSocket.OPEN
        ) {
            return;
        }

        //this.socket = new WebSocket("ws://localhost:5050/ws");
        this.socket = new WebSocket(CONFIG.wsUrl);

        const store = useConnectorStore.getState();

        this.socket.onopen = () => {
            console.log("Dashboard connected.");
            store.setConnected(true);
            this.recoverPendingInput();
        
            //this.socket?.send(
            //    JSON.stringify({
            //        type: "dashboard_connected",
            //    })
            //);
        };

        this.socket.onmessage = (message) => {
            console.log("RAW:", message.data);
            const event = JSON.parse(message.data);
            console.log(
                event.id,
                event.type
            );
            this.handleEvent(event);
        };

        this.socket.onclose = () => {
            console.log("Dashboard disconnected.");
            store.setConnected(false);
            setTimeout(
                () => this.connect(),
                3000,
            );
        };

        this.socket.onerror = (err) => {
            console.error("WebSocket Error", err);
        };

        //this.socket.onmessage = (message) => {
        //    const event: ConnectorEvent<unknown> = JSON.parse(message.data);
        //    this.handleEvent(event);
        //};
    }

    private async recoverPendingInput() {
        try {
            const response = await axios.get(
                `${CONFIG.apiUrl}/api/input/pending`,
            );

            if (response.data.pending) {
                useConnectorStore
                    .getState()
                    .setPendingInput(
                        response.data.request
                    );
            }

        }
        catch (err) {
            console.error(
                "Failed to recover pending input",
                err
            );
        }
    }

    private handleEvent(event: ConnectorEvent,) {
        const store = useConnectorStore.getState();
        store.addTimelineEvent(event);
        
        switch (event.type) {
            case EventType.STATUS:
                store.setStatus(event.payload as StatusPayload);
                break;

            case EventType.HEARTBEAT:
                store.setHeartbeat(event.payload as HeartbeatPayload);
                break;

            case EventType.JOB_RECEIVED:{
                const payload = event.payload as JobPayload;

                store.upsertJob({
                    task_id: payload.task_id,
                    job_id: event.job_id ?? "",
                    agent_name: payload.agent_name,
                    status: payload.status,
                    progress: 0,
                    step: "Received",
                    started_at: new Date().toISOString(),
                });

                break;
            }

            case EventType.JOB_QUEUED:{
                const payload = event.payload as JobPayload;

                store.upsertJob({
                    task_id: payload.task_id,
                    job_id: event.job_id ?? "",
                    agent_name: payload.agent_name,
                    status: payload.status,
                    progress: 0,
                    step: "Queued",
                    started_at: new Date().toISOString(),
                });

                break;
            }

            case EventType.JOB_STARTED:{
                const payload = event.payload as JobPayload;

                store.upsertJob({
                    task_id: payload.task_id,
                    job_id: event.job_id ?? "",
                    agent_name: payload.agent_name,
                    status: payload.status,
                    progress: 0,
                    step: "Started",
                    started_at: new Date().toISOString(),
                });

                break;
            }

            case EventType.JOB_COMPLETED: {
                const payload = event.payload as JobPayload;

                store.upsertJob({
                    task_id: payload.task_id,
                    job_id: event.job_id ?? "",
                    agent_name: payload.agent_name,
                    status: payload.status,
                    progress: 100,
                    step: "Completed",
                    completed_at: new Date().toISOString(),
                });

                break;
            }
            
            case EventType.JOB_FAILED:{
                const payload = event.payload as JobPayload;

                store.upsertJob({
                    task_id: payload.task_id,
                    job_id: event.job_id ?? "",
                    agent_name: payload.agent_name,
                    status: payload.status,
                    progress: 100,
                    step: "Failed",
                    completed_at: new Date().toISOString(),
                });

                break;
            }

            case EventType.LOG:{
                const payload = event.payload as LogPayload;

                store.addLog({
                    ...payload,
                    job_id: event.job_id,
                    timestamp: event.timestamp,
                    source: event.source,
                });

                if (payload.task_id !== undefined) {
                    store.updateJobProgress(
                        payload.task_id,
                        payload.progress ?? 0,
                        payload.step,
                    );
                }

                break;
            }

            case EventType.DOWNLOAD_READY: {
                const payload = event.payload as DownloadPayload;

                store.addDownload({
                    ...payload,
                    job_id: event.job_id,
                    timestamp: event.timestamp,
                    source: event.source,
                });

                break;
            }
            
            case EventType.INPUT_REQUIRED:{
                const payload = event.payload as InputRequiredPayload;
                store.setPendingInput(payload);
                //showNotification("AIProxys Connector", "User input is required.");
                showInputNotification(payload);
                break;
            }

            case EventType.INPUT_RECEIVED:
                store.setPendingInput(null);
                break;

            default:
                console.log(event);
        }
    }
}

function showInputNotification(input: InputRequiredPayload) {
    //console.log("showInputNotification called");
    //console.log("Notification supported:", "Notification" in window);
    //console.log("Permission:", Notification.permission);
    //console.log("Visibility:", document.visibilityState);

    if (!("Notification" in window)) {
        console.log("Notification API not supported");
        return;
    }

    if (Notification.permission !== "granted") {
        console.log("Permission not granted");
        return;
    }

    // Don't show if user is already looking at dashboard
    if (document.visibilityState === "visible") {
        console.log("Dashboard already visible");
        return;
    }

    //console.log("Creating notification...");

    const notification = new Notification(
        "AIProxys Connector",
        {
            body: input.title,
            icon: "/favicon.ico",
        }
    );

    const audio = new Audio("/sounds/notification.mp3");
    //console.log(audio.src);
    audio.play()
        .then(() => {
            console.log("Audio started");
        })
        .catch((err) => {
            console.error("Audio failed:", err);
        });

    notification.onclick = () => {
        window.focus();
        notification.close();
    };

    // Auto-close after 15 seconds
    /*
    setTimeout(() => {
        notification.close();
    }, 15000); */

}

export const connectorWebSocket =
    new ConnectorWebSocket();