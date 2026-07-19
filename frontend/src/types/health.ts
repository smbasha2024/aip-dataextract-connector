export interface HealthResponse {
    status: string;
    version: string;
    uptime_seconds: number;
    jobs_received: number;
    jobs_completed: number;
    jobs_failed: number;
    downloads: number;
    pending_inputs: number;
    websocket_reconnects: number;
    dashboard_launches: number;
    dashboard_connected: boolean;
    dashboard_connections: number;
}