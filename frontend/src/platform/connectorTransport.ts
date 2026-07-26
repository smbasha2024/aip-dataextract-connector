export interface RuntimeState {
    status: string;
    dockerRunning: boolean;
    connectorRunning: boolean;
    backendHealthy: boolean;
    lastUpdated: string;
}

export interface ConnectorTransport {
    getRuntimeState(): Promise<RuntimeState>;
    startConnector(): Promise<void>;
    stopConnector(): Promise<void>;
    restartConnector(): Promise<void>;
    getVersion(): Promise<string>;
}