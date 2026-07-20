import { useEffect, useState } from "react";
import { useConnectorStore } from "../../../../store/connectorStore";
import { getConnectionHealth } from "../../../../utils/connectionHealth";
import { formatHeartbeatAge } from "../../../../utils/time";

export default function ConnectionBanner() {
    const heartbeat = useConnectorStore(
        (s) => s.heartbeatReceivedAt
    );

    const [, refresh] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            refresh(v => v + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const health = getConnectionHealth(heartbeat);

    if (health === "HEALTHY") {
        return null;
    }

    const heartbeatAge = formatHeartbeatAge(heartbeat);

    const delayed = health === "DELAYED";

    return (
        <div
            className={`mb-4 rounded-xl border px-4 py-3 shadow-sm ${
                delayed
                    ? "border-yellow-300 bg-yellow-50"
                    : "border-red-300 bg-red-50"
            }`}
        >
            <div
                className={`font-semibold ${
                    delayed
                        ? "text-yellow-700"
                        : "text-red-700"
                }`}
            >
                {delayed
                    ? "⚠ Connection to Cloud Server is delayed"
                    : "❌ Connection to Cloud Server lost"}
            </div>

            <div className="mt-1 text-sm text-slate-600">
                Last heartbeat received {heartbeatAge}.
            </div>
        </div>
    );
}