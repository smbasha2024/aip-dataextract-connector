import { useEffect, useState } from "react";
import { useConnectorStore } from "../../../store/connectorStore";
import { CONFIG } from "../../../config/config"
import { HeartPulse } from "lucide-react";
import ConnectorDetailsPanel from "./ConnectorDetailsPanel";
import { restoreDashboard } from "../../../services/dashboardBootstrap";
import { connectorWebSocket } from "../../../services/websocket";
import { formatDuration } from "../../../utils/time";

export default function Header() {
    const connected = useConnectorStore((s) => s.connected);
    //const status = useConnectorStore((s) => s.status);
    const [showFocusToast, setShowFocusToast] = useState(false);

    const selectedJobId = useConnectorStore(
        (s) => s.selectedJobId
    );

    const setSelectedJob = useConnectorStore(
        (s) => s.setSelectedJob
    );

    const [time, setTime] = useState(new Date());
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const id = setInterval(() => {
            setTime(new Date());
        }, 1000);
        
        return () => clearInterval(id);

    }, []);

    useEffect(() => {
        function handleFocusRequest() {
            setShowFocusToast(true);

            setTimeout(() => {
                setShowFocusToast(false);
            }, 4000);
        }

        window.addEventListener(
            "dashboard-focus-request",
            handleFocusRequest
        );

        return () => {
            window.removeEventListener(
                "dashboard-focus-request",
                handleFocusRequest
            );
        };
    }, []);

    const handleRefresh = async () => {await restoreDashboard();};
    const handleReconnect = async () => {
        //connectorWebSocket.disconnect();

        await new Promise(resolve =>
            setTimeout(resolve, 1000)
        );

        connectorWebSocket.connect();
    };
    const connectedSince = useConnectorStore((s) => s.connectedSince);
    const connectionDuration = formatDuration(connectedSince);

    return (
        <div className="bg-white rounded-xl shadow border border-slate-200 px-8 py-6">
            <div className="flex justify-between items-start">
                {/* LEFT */}
                <div>
                    <h1 className="text-4xl font-bold text-blue-700">
                        {CONFIG.appName}
                    </h1>

                    <div className="mt-2 flex items-center gap-4">
                        <p className="text-slate-500">
                            {CONFIG.caption}
                        </p>

                        <button
                            onClick={() => setShowDetails(true)}
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-red-200
                                bg-red-50
                                px-3
                                py-1
                                text-sm
                                text-red-600
                                hover:bg-red-100
                                transition
                            "
                            title="Connector Details"
                        >
                            <HeartPulse size={16} />

                            Health

                        </button>
                        <ConnectorDetailsPanel
                            open={showDetails}
                            onClose={() => setShowDetails(false)}
                        />
                    </div>

                    <button
                        onClick={handleRefresh}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-100"
                    >
                        🔄 Refresh
                    </button>

                    <button
                        onClick={handleReconnect}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                    >
                        🔌 Reconnect
                    </button>

                </div>

                {/* RIGHT */}
                <div className="text-right space-y-2">
                    <div>
                        <span
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold ${
                                connected
                                    ? "bg-green-100 text-green-900"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            <span
                                className={`h-2.5 w-2.5 rounded-full ${
                                    connected
                                        ? "bg-green-500 animate-pulse"
                                        : "bg-red-500"
                                }`}
                            />

                            {connected
                                ? "Connected"
                                : "OFFLINE"}
                        </span>
                        
                        {connected && (
                            <span className="mt-1 text-xs text-slate-500">
                                Connected for {connectionDuration}
                            </span>
                        )}
                        
                    </div>

                    <div className="text-sm text-slate-500">
                        Version {CONFIG.version}
                    </div>

                    <div className="font-semibold">
                        {time.toLocaleDateString()} {time.toLocaleTimeString()}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-3">
                    <span className="text-slate-500">
                        Viewing
                    </span>

                    <span className="rounded-full bg-blue-100 px-4 py-1 font-semibold text-blue-700">

                        {selectedJobId
                            ? `Job ${selectedJobId}`
                            : "All Jobs"}

                    </span>
                </div>

                {selectedJobId && (
                    <button
                        onClick={() => setSelectedJob(null)}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                    >
                        Clear Selection
                    </button>
                )}
            </div>

            {showFocusToast && (
                <div
                    className="
                        fixed
                        top-5
                        right-5
                        z-50
                        rounded-lg
                        bg-blue-600
                        px-5
                        py-3
                        text-white
                        shadow-xl
                    "
                >
                    Another dashboard attempted to open.
                    This dashboard is active.
                </div>

            )}
        </div>
    );
}
