export interface JobPayload {
    task_id: number;
    agent_name: string;
    status: string;
}

export interface LogPayload {
    level?: string;
    message?: string;
    task_id?: number;
    step?: string;
    progress?: number;
}

export interface StatusPayload {
    status: string;
    running_workers: number;
    queue_size: number;
    max_workers: number;
}

export interface HeartbeatPayload {
    alive: boolean;
}

export interface DownloadPayload {
    task_id: number;
    filename: string;
    path: string;
}
export interface DownloadEntry extends DownloadPayload {
    job_id: string | null;
    timestamp: string;
    source: string;
}
export interface InputRequiredPayload {
    request_id: string;
    title: string;
    message: string;
    input_type: string;
    image?: string;
    job_id: string;
}

export interface InputReceivedPayload {
    request_id: string;
}

