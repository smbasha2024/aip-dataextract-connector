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
    }
}