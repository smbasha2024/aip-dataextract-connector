export interface Job {
    task_id: number;
    job_id: string;
    agent_name: string;
    status: string;
    progress: number;
    step?: string;
    started_at?: string;
    completed_at?: string;
    last_update?: string;
}