import type { LogPayload } from "./payloads";

export interface LogEntry extends LogPayload {
    job_id: string | null;
    timestamp: string;
    source: string;
}