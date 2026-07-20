import { create } from "zustand";

import type { Job } from "../types/job";
import type { ConnectorEvent } from "../types/event";
import type { LogEntry } from "../types/log";
import type { TaskResponse } from "../types/task";
import type {
    StatusPayload,
    HeartbeatPayload,
    DownloadEntry,
    InputRequiredPayload,
} from "../types/payloads";

interface ConnectorStore {
    connected: boolean;
    status: StatusPayload | null;
    heartbeat: HeartbeatPayload | null;
    jobs: Record<number, Job>;
    logs: LogEntry[];
    downloads: DownloadEntry[];
    pendingInput: InputRequiredPayload | null;
    heartbeatReceivedAt: Date | null;
    timeline: ConnectorEvent[];
    selectedJobId: string | null;
    recoveryMessage: string | null;

    addTimelineEvent(event: ConnectorEvent): void;
    setConnected(value: boolean): void;
    setStatus(status: StatusPayload): void;
    setHeartbeat(data: HeartbeatPayload): void;
    upsertJob(job: Job): void;
    addLog(log: LogEntry): void;
    addDownload(download: DownloadEntry): void;
    setPendingInput(input: InputRequiredPayload | null): void;
    updateJobProgress(task_id: number, progress: number, step?: string,): void;
    setSelectedJob(jobId: string | null): void;

    restoreDashboardState: () => void;
    restoreTasks(tasks: TaskResponse[]): void;
    restorePendingInput(input: InputRequiredPayload | null): void;
    restoreStatus(status: StatusPayload): void;

    setRecoveryMessage(message: string | null): void;
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
    selectedJobId: null,
    recoveryMessage: null,

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
            const job = state.jobs[task_id];

            if (!job) {
                return state;
            }

            return {
                jobs: {
                    ...state.jobs,
                    [task_id]: {
                        ...job,
                        progress,
                        step,
                        last_update: new Date().toISOString(),
                    },
                },
            };
        }),
    
    addTimelineEvent: (event) =>
        set((state) => {
            if (state.timeline.some(e => e.id === event.id)) {
                console.warn("Duplicate timeline event:", event.id);

                return state;      // <-- IMPORTANT
            }
            return {
                timeline: [
                    event,
                    ...state.timeline,
                ].slice(0, 500),
            };
        }),
    
    setSelectedJob: (jobId) =>
        set({
            selectedJobId: jobId,
        }),
    
    restoreDashboardState: () => {
        const selectedJobId =
            localStorage.getItem("selectedJobId");

        set({
            selectedJobId,
        });
    },

    restoreStatus: (status) =>
        set({
            status,
            connected: status.status === "CONNECTED",
        }),

    restorePendingInput: (input) =>
        set({
            pendingInput: input,
        }),

    restoreTasks: (tasks) =>
        set(() => {
            const jobs: Record<number, Job> = {};
            tasks.forEach(task => {
                jobs[task.id] = {
                    task_id: task.id,
                    job_id: task.job_id,
                    //tenant_id: task.tenant_id,
                    agent_name: task.agent_name,
                    status: task.status.toUpperCase(),
                    progress: 0,
                    started_at: task.received_at,
                    last_update: task.received_at,
                };
            });

            return {
                jobs,
            };

        }),
    
    setRecoveryMessage: (message) =>
        set({
            recoveryMessage: message,
        }),
}));


export function getDashboardStats(
    jobs: Record<number, Job>
) {
    const list = Object.values(jobs);

    const completed = list.filter(j => j.status === "completed").length;
    const failed = list.filter(j => j.status === "failed").length;
    const running = list.filter(j => j.status === "running").length;
    const queued = list.filter(j => j.status === "queued").length;

    const total = list.length;

    const successRate =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);

    return {
        total,
        completed,
        failed,
        running,
        queued,
        successRate,
    };
}