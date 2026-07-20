import { useConnectorStore, getDashboardStats } from "../../../store/connectorStore";

export default function DashboardStats() {
    const jobs = useConnectorStore(s => s.jobs);
    const stats = getDashboardStats(jobs);

    return (
        <div className="grid grid-cols-6 gap-4">
            <StatCard
                title="Jobs"
                value={stats.total}
            />

            <StatCard
                title="Completed"
                value={stats.completed}
                color="text-green-600"
            />

            <StatCard
                title="Failed"
                value={stats.failed}
                color="text-red-600"
            />

            <StatCard
                title="Running"
                value={stats.running}
                color="text-blue-600"
            />

            <StatCard
                title="Queued"
                value={stats.queued}
                color="text-yellow-600"
            />

            <StatCard
                title="Success"
                value={`${stats.successRate}%`}
                color="text-green-700"
            />
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string | number;
    color?: string;
}

function StatCard({
    title,
    value,
    color = "text-slate-800",
}: StatCardProps) {

    const numericValue =
        typeof value === "string"
            ? parseInt(value)
            : value;

    return (

        <div className="rounded-xl border bg-white shadow-sm p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">
                {title}
            </div>

            <div className={`mt-2 text-2xl font-bold ${color}`}>
                {value}
            </div>

            {title === "Success" && (
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                    <div
                        className="h-full rounded-full bg-green-600"
                        style={{
                            width: `${numericValue}%`,
                        }}
                    />
                </div>
            )}

        </div>

    );
}