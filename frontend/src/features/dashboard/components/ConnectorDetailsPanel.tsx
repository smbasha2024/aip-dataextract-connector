import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getHealth } from "../../../services/healthService";
import type { HealthResponse } from "../../../types/health";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function ConnectorDetailsPanel({
    open,
    onClose,
}: Props) {
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open)
            return;

        let cancelled = false;

        async function refresh() {
            setLoading(true);
            try {
                const response = await getHealth();
                if (!cancelled) {
                    setHealth(response);
                }
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        }

        refresh();

        const timer = window.setInterval(refresh, 10000);
        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, [open]);

    if (!open)
        return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Background */}

            <div
                className="absolute inset-0 bg-black/30"
                onClick={onClose}
            />

            {/* Right Panel */}
            <div
                className="
                    absolute
                    right-0
                    top-0
                    h-full
                    w-[420px]
                    bg-white
                    shadow-2xl
                    flex
                    flex-col
                "
            >

                <div className="border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        Connector Details
                    </h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    {loading && !health &&(
                        <div className="p-6">
                            Loading...
                        </div>
                    )}
                    
                    {health && (
                        <>
                            <Section title="Connection">
                                <Row
                                    label="Cloud Connection"
                                    value={
                                        <span className="
                                                rounded-full
                                                bg-green-100
                                                px-3
                                                py-1
                                                text-xs
                                                font-semibold
                                                text-green-700
                                            "
                                        >
                                            {health.status}
                                        </span>                 
                                    }                       
                                />
                                <Row
                                    label="Dashboard"
                                    value={
                                        health.dashboard_connected
                                            ? `Connected (${health.dashboard_connections})`
                                            : "Disconnected"
                                    }
                                />
                                
                                <Row
                                    label="Reconnects"
                                    value={health.websocket_reconnects}
                                />

                                <Row
                                    label="Last Connected"
                                    value={health.last_dashboard_connected}
                                />

                                <Row
                                    label="Last Disconnected"
                                    value={health.last_dashboard_disconnected}
                                />
                                
                            </Section>

                            <Section title="Activity">
                                <Row
                                    label="Jobs Received"
                                    value={health.jobs_received}
                                />
                                <Row
                                    label="Jobs Completed"
                                    value={health.jobs_completed}
                                />
                                <Row
                                    label="Jobs Failed"
                                    value={health.jobs_failed}
                                />
                                <Row
                                    label="Downloads"
                                    value={health.downloads}
                                />
                                <Row
                                    label="Pending Inputs"
                                    value={health.pending_inputs}
                                />
                            </Section>

                            <Section title="System">
                                <Row
                                    label="Uptime"
                                    value={formatUptime(health.uptime_seconds)}
                                />
                                <Row
                                    label="Version"
                                    value={health.version}
                                />
                            </Section>
                        </>
                    )}
                    
                </div>
            </div>
        </div>
    );
}

function Row({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 last:border-0">
            <span className="text-slate-500">
                {label}
            </span>

            <span className="font-semibold">
                {value}
            </span>
        </div>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mb-8">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                {title}
            </h3>

            <div className="rounded-lg border border-slate-200">
                {children}
            </div>
        </div>
    );
}

function formatUptime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(
        (seconds % 3600) / 60
    );
    const s = seconds % 60;

    return `${h}h ${m}m ${s}s`;
}