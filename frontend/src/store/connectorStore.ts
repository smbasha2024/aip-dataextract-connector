import { create } from "zustand";

import type { Job } from "../types/job";
import type { ConnectorEvent } from "../types/event";

import type {
    StatusPayload,
    HeartbeatPayload,
    DownloadPayload,
    LogPayload,
    InputRequiredPayload,
} from "../types/payloads";

interface ConnectorStore {
    connected: boolean;
    status: StatusPayload | null;
    heartbeat: HeartbeatPayload | null;
    jobs: Record<number, Job>;
    logs: LogPayload[];
    downloads: DownloadPayload[];
    pendingInput: InputRequiredPayload | null;
    heartbeatReceivedAt: Date | null;
    timeline: ConnectorEvent[];

    addTimelineEvent(event: ConnectorEvent): void;
    setConnected(value: boolean): void;
    setStatus(status: StatusPayload): void;
    setHeartbeat(data: HeartbeatPayload): void;
    upsertJob(job: Job): void;
    addLog(log: LogPayload): void;
    addDownload(download: DownloadPayload): void;
    setPendingInput(
        input: InputRequiredPayload | null
    ): void;
    updateJobProgress(
        task_id: number,
        progress: number,
        step?: string,
    ): void;
}

export const useConnectorStore =
create<ConnectorStore>((set) => ({
    connected: false,
    status: null,
    heartbeat: null,
    jobs: {},
    logs: [],
    downloads: [],
    pendingInput: null,
    heartbeatReceivedAt: null,
    timeline: [],

    setConnected: (value) =>
        set({
            connected: value,
        }),

    setStatus: (status) =>
        set({
            status,
        }),

    setHeartbeat: (heartbeat) =>
        set({
            heartbeat,
            heartbeatReceivedAt: new Date(),
        }),

    upsertJob: (job) =>
        set((state) => ({
            jobs: {
                ...state.jobs,
                [job.task_id]: {
                    ...state.jobs[job.task_id],
                    ...job,
                },
            },
        })),

    addLog: (log) =>
        set((state) => ({
            logs: [
                log,
                ...state.logs,
            ].slice(0, 500),
        })),

    addDownload: (download) =>
        set((state) => ({
            downloads: [
                download,
                ...state.downloads,
            ],
        })),

    setPendingInput: (pendingInput) =>
        set({
            pendingInput,
        }),
    
    updateJobProgress: (
        task_id,
        progress,
        step,
    ) =>
        set((state) => {
            const existing = state.jobs[task_id];

            if (!existing) {
                return state;
            }

            return {
                jobs: {
                    ...state.jobs,
                    [task_id]: {
                        ...existing,
                        progress,
                        step,
                    },
                },
            };
        }),
    
    addTimelineEvent: (event) =>
        set((state) => ({
            timeline: [
                event,
                ...state.timeline,
            ].slice(0, 500),
        })),
}));