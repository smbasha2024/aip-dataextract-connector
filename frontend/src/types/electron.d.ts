import type { RuntimeState } from "@/transport/connectorTransport";

declare global {
    interface Window {
        connector: {
            getRuntimeState(): Promise<RuntimeState>;
            startConnector(): Promise<void>;
            stopConnector(): Promise<void>;
            restartConnector(): Promise<void>;
            getVersion(): Promise<string>;
        };
    }
}

export {};