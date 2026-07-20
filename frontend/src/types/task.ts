export interface TaskResponse {
    id: number;
    job_id: string;
    tenant_id: string;
    agent_name: string;
    payload: string;
    status: string;
    received_at: string;
}