export const EventType = {
    JOB_RECEIVED: "JOB_RECEIVED",
    JOB_QUEUED: "JOB_QUEUED",
    JOB_STARTED: "JOB_STARTED",
    JOB_COMPLETED: "JOB_COMPLETED",
    JOB_FAILED: "JOB_FAILED",

    INPUT_REQUIRED: "INPUT_REQUIRED",
    INPUT_RECEIVED: "INPUT_RECEIVED",

    DOWNLOAD_READY: "DOWNLOAD_READY",

    LOG: "LOG",

    STATUS: "STATUS",

    HEARTBEAT: "HEARTBEAT",
} as const;

export type EventType =
    (typeof EventType)[keyof typeof EventType];