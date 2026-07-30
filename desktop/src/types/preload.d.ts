export {};
declare global {
    interface Window {
        electron: {
            platform: string;
            versions: {
                electron: string;
                chrome: string;
                node: string;
            };
        };

        connector: {
            getRuntimeState(): Promise<any>;
            startConnector(): Promise<void>;
            stopConnector(): Promise<void>;
            restartConnector(): Promise<void>;
            getVersion(): Promise<string>;
            onRuntimeStateChanged(callback: (state: any) => void,): () => void;
            getSettings(): Promise<any>;
            updateSettings(settings: any): Promise<any>;
        };

    }
}