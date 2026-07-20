//import { useEffect, useState } from "react";
import { useConnectorStore } from "../../../store/connectorStore";
//import {formatHeartbeatAge} from "../../../utils/time"
import { getConnectionHealth } from "../../../utils/connectionHealth";

export default function StatusCards() {
    const connected = useConnectorStore((s) => s.connected);
    const status = useConnectorStore((s) => s.status);
    const heartbeat = useConnectorStore((s) => s.heartbeatReceivedAt);

    const connectorStatus = status?.status ?? "DISCONNECTED";
    const runningWorkers = status?.running_workers ?? 0;
    const queueSize = status?.queue_size ?? 0;
    const maxWorkers = status?.max_workers ?? 0;

    //const [, forceRefresh] = useState(0);
    //useEffect(() => {
    //    const timer = setInterval(() => {
    //        forceRefresh(v => v + 1);
    //    }, 1000);

    //    return () => clearInterval(timer);
    //}, []);

    const heartbeatText = heartbeat ? heartbeat.toLocaleTimeString() : "Never";
    //const heartbeatText = formatHeartbeatAge(heartbeat);
    const connectionHealth = getConnectionHealth(heartbeat);
    
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

           <ConnectorCard
                status={connectorStatus}
            />

            <Card
                title="Workers"
                value={`${runningWorkers}/${maxWorkers}`}
            />

            <Card
                title="Queue"
                value={queueSize}
            />

            <HeartbeatCard
                heartbeat={heartbeatText}
                health={connectionHealth}
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

interface ConnectorCardProps {
    status: string;
}

function ConnectorCard({
    status,
}: ConnectorCardProps) {

    const connected = status === "CONNECTED";

    return (
        <div className="rounded-xl bg-white shadow p-5 border border-slate-200">
            <div className="text-sm text-slate-500">
                Connector
            </div>

            <div className="mt-2 flex items-center gap-3">

                <span
                    className={`h-3 w-3 rounded-full ${
                        connected
                            ? "bg-green-700 animate-pulse"
                            : "bg-blue-700"
                    }`}
                />

                <span
                    className={`text-2xl font-bold ${connectorColor(status)}`}
                >
                    {connectorLabel(status)}
                </span>

            </div>
        </div>
    );
}

interface HeartbeatCardProps {
    heartbeat: string;
    health: "HEALTHY" | "DELAYED" | "LOST";
}

function HeartbeatCard({
    heartbeat,
    health,
}: HeartbeatCardProps) {

    const bubble =
        health === "HEALTHY"
            ? "bg-green-500"
            : health === "DELAYED"
            ? "bg-yellow-500"
            : "bg-red-500";

    const color =
        health === "HEALTHY"
            ? "text-green-600"
            : health === "DELAYED"
            ? "text-yellow-600"
            : "text-red-600";

    const label =
        health === "HEALTHY"
            ? "Healthy"
            : health === "DELAYED"
            ? "Delayed"
            : "Lost";

    return (
        <div className="rounded-xl bg-white shadow p-5 border border-slate-200">
            <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                    Heartbeat
                </div>

                <div className="flex items-center gap-2">
                    <span
                        className={`h-2.5 w-2.5 rounded-full ${
                            bubble
                        } ${
                            label === "Healthy"
                                ? "animate-pulse"
                                : ""
                        }`}
                    />

                    <span className={`text-xs font-semibold ${color}`}>
                        {label}
                    </span>
                </div>
            </div>

            <div className="mt-2 text-2xl font-bold text-blue-600">
                {heartbeat}
            </div>
        </div>
    );
}

function connectorLabel(status: string) {
    switch (status) {
        case "CONNECTED":
            return "Connected";

        case "DISCONNECTED":
            return "Disconnected";

        case "STARTING":
            return "Starting";

        case "BUSY":
            return "Busy";

        case "IDLE":
            return "Idle";

        default:
            return status;
    }
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
/*
function healthColor(health: string) {
    switch (health) {
        case "HEALTHY":
            return "text-green-600";

        case "DELAYED":
            return "text-yellow-600";

        case "LOST":
            return "text-red-600";

        default:
            return "text-slate-700";
    }
}

function healthLabel(health: string) {
    switch (health) {

        case "HEALTHY":
            return "Healthy";

        case "DELAYED":
            return "Delayed";

        case "LOST":
            return "Lost";

        default:
            return health;
    }
}
    */