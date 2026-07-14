import { useConnectorStore } from "../../../store/connectorStore";

export default function StatusCards() {

    const connected = useConnectorStore((s) => s.connected);
    const status = useConnectorStore((s) => s.status);
    const heartbeat = useConnectorStore((s) => s.heartbeatReceivedAt);

    const connectorStatus = status?.status ?? "DISCONNECTED";
    const runningWorkers = status?.running_workers ?? 0;
    const queueSize = status?.queue_size ?? 0;
    const maxWorkers = status?.max_workers ?? 0;

    const heartbeatText = heartbeat ? heartbeat.toLocaleTimeString() : "Never";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">

            <Card
                title="Dashboard"
                value={connected ? "Connected" : "Disconnected"}
                color={
                    connected
                        ? "text-green-600"
                        : "text-red-600"
                }
            />

            <Card
                title="Connector"
                value={connectorStatus}
                color={connectorColor(connectorStatus)}
            />

            <Card
                title="Workers"
                value={`${runningWorkers}/${maxWorkers}`}
            />

            <Card
                title="Queue"
                value={queueSize}
            />

            <Card
                title="Heartbeat"
                value={heartbeatText}
                color="text-blue-600"
            />

        </div>
    );
}

interface CardProps {
    title: string;
    value: string | number;
    color?: string;
}

function Card({
    title,
    value,
    color = "text-slate-800",
}: CardProps) {

    return (
        <div className="rounded-xl bg-white shadow p-5 border border-slate-200">

            <div className="text-sm text-slate-500">
                {title}
            </div>

            <div className={`mt-2 text-2xl font-bold ${color}`}>
                {value}
            </div>

        </div>
    );
}

function connectorColor(status: string) {

    switch (status) {

        case "CONNECTED":
            return "text-green-600";

        case "IDLE":
            return "text-blue-600";

        case "BUSY":
            return "text-orange-500";

        case "STARTING":
            return "text-yellow-500";

        case "DISCONNECTED":
            return "text-red-600";

        default:
            return "text-slate-700";
    }
}