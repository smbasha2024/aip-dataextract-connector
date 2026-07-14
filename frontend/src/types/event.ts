import type { EventType } from "./events";

export interface ConnectorEvent<T = unknown> {
    id: string;
    timestamp: string;
    type: EventType;
    source: string;
    job_id: string | null;
    payload: T;
}