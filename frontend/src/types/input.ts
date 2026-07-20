export interface PendingInputResponse {
    pending: boolean;
    request?: PendingInputRequest;
}

export interface PendingInputRequest {
    request_id: string;
    job_id: string;
    title: string;
    message: string;
    type: string;
    image?: string | null;
}