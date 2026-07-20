import { getHealth } from "./healthService";
import { getPendingInput } from "./inputService";
import { getUnfinishedTasks } from "./taskService";

import { useConnectorStore } from "../store/connectorStore";

export async function restoreDashboard() {
    const [
        health,
        tasks,
        pending,
    ] = await Promise.all([
        getHealth(),
        getUnfinishedTasks(),
        getPendingInput(),
    ]);

    const store = useConnectorStore.getState();

    store.setConnected(health.dashboard_connected);
    store.restoreStatus({
        status: health.status,
        // The current health endpoint does not expose these values.
        // They will be updated automatically after the first STATUS
        // event arrives over the WebSocket.
        running_workers: 0,
        queue_size: 0,
        max_workers: 0,
    });
    store.restoreTasks(tasks);

    if (pending.pending && pending.request) {
        store.restorePendingInput({
            request_id: pending.request.request_id,
            job_id: pending.request.job_id,
            title: pending.request.title,
            message: pending.request.message,
            input_type: pending.request.type,
            image: pending.request.image ?? undefined,
        });
    }

    const restoredJobs = tasks.length;
    const restoredInputs = pending.pending ? 1 : 0;
    const messages: string[] = [];

    if (restoredJobs > 0) {
        messages.push(
            `${restoredJobs} unfinished job${restoredJobs > 1 ? "s" : ""}`
        );
    }

    if (restoredInputs > 0) {
        messages.push(
            `${restoredInputs} pending input`
        );
    }

    if (messages.length > 0) {
        store.setRecoveryMessage(
            `Recovered ${messages.join(" and ")}`
        );
    }
}