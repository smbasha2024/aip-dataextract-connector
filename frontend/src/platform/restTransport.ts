import type {ConnectorTransport, RuntimeState,} from "./connectorTransport";

export class RestTransport implements ConnectorTransport {
    async getRuntimeState(): Promise<RuntimeState> {
        const response = await fetch(
            "/api/runtime"
        );

        return response.json();
    }

    async startConnector(): Promise<void> {
        throw new Error("Not implemented");
    }

    async stopConnector(): Promise<void> {
        throw new Error("Not implemented");
    }

    async restartConnector(): Promise<void> {
        throw new Error("Not implemented");
    }

    async getVersion(): Promise<string> {
        throw new Error("Not implemented");
    }

    onRuntimeStateChanged(callback: (state: RuntimeState) => void,): () => void {
        // Browser transport currently has no runtime events.
        void callback;
        return () => {};
    }
}