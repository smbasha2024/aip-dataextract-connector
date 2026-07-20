import { useConnectorStore } from "../../../store/connectorStore";
import { CONFIG } from "../../../config/config";

export default function Footer() {
    const connected = useConnectorStore(
        s => s.connected
    );

    return (
        <footer className="mt-6 rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <div className="flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                <div>
                    <span className="font-semibold text-slate-700">
                        AIProxys Connector Dashboard
                    </span>

                    <span className="mx-2">•</span>

                    Version 1.0.0
                </div>

                <div>
                    {connected ? (
                        <span className="inline-flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            Connected to {CONFIG.wsUrl}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-red-500"></span>
                            Disconnected
                        </span>
                    )}
                </div>
                <div>
                    © 2026 AIProxys Pvt Ltd
                </div>
            </div>
        </footer>
    );
}