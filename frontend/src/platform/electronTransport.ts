import type { ConnectorTransport, RuntimeState,} from "./connectorTransport";

export class ElectronTransport implements ConnectorTransport {
    async getRuntimeState(): Promise<RuntimeState> {
        return window.connector.getRuntimeState();
    }

    async startConnector(): Promise<void> {
        return window.connector.startConnector();
    }

    async stopConnector(): Promise<void> {
        return window.connector.stopConnector();
    }

    async restartConnector(): Promise<void> {
        return window.connector.restartConnector();
    }

    async getVersion(): Promise<string> {
        return window.connector.getVersion();
    }

    onRuntimeStateChanged(callback: (state: RuntimeState) => void,): () => void {
        return window.connector.onRuntimeStateChanged(
            callback,
        );
    }
}