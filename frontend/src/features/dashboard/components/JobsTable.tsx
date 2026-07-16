import { useConnectorStore } from "../../../store/connectorStore";
import { useMemo } from "react";

export default function JobTable() {
    const selectedJobId = useConnectorStore(
        s => s.selectedJobId
    );

    const setSelectedJob = useConnectorStore(
        s => s.setSelectedJob
    );
    const jobsMap = useConnectorStore((s) => s.jobs);

    const jobs = useMemo(() => {
        return Object.values(jobsMap).sort(
            (a, b) => b.task_id - a.task_id
        );
    }, [jobsMap]);

    return (
        <div className="rounded-xl bg-white shadow border border-slate-200">

            

            <table className="w-full text-sm">

                <thead className="bg-slate-50">

                    <tr>

                        <th className="text-left px-4 py-3">
                            Job ID
                        </th>

                        <th className="text-left px-4 py-3">
                            Agent
                        </th>

                        <th className="text-left px-4 py-3">
                            Status
                        </th>

                        <th className="text-left px-4 py-3">
                            Progress
                        </th>

                        <th className="text-left px-4 py-3">
                            Step
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {jobs.length === 0 && (

                        <tr>

                            <td
                                colSpan={5}
                                className="text-center py-10 text-slate-400"
                            >
                                No Jobs
                            </td>

                        </tr>

                    )}

                    {jobs.map((job) => (

                        <tr
                            key={job.task_id}
                            onClick={() => setSelectedJob(job.job_id)}
                            className={`
                                cursor-pointer
                                hover:bg-slate-50
                                transition
                                ${
                                    selectedJobId === job.job_id
                                        ? "bg-blue-50"
                                        : ""
                                }
                            `}
                        >

                            <td className="px-4 py-3">
                                {job.job_id}
                            </td>

                            <td className="px-4 py-3 uppercase">
                                {job.agent_name}
                            </td>

                            <td className="px-4 py-3">
                                <StatusBadge status={job.status} />
                            </td>

                            <td className="px-4 py-3">

                                <div className="flex items-center gap-3">

                                    <div className="flex-1">

                                        <div className="h-2 rounded-full bg-slate-200 overflow-hidden">

                                            <div
                                                className={`h-full rounded transition-all duration-500 ${job.status === "running" ? "animate-pulse" : ""} ${progressColor(job.status)}`}
                                                style={{
                                                    width: `${job.progress}%`,
                                                }}
                                            />

                                        </div>

                                    </div>

                                    <div className="w-12 text-right text-sm font-medium text-slate-700">
                                        {job.progress}%
                                    </div>

                                </div>

                                <div className="mt-2 text-xs text-slate-500">
                                    {job.step || "-"}
                                </div>

                                <div className="mt-1 text-[11px] text-slate-400">
                                    {job.last_update &&
                                        new Date(job.last_update).toLocaleTimeString()}
                                </div>
                            </td>

                            <td className="px-4 py-3">
                                {job.step || "-"}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

function statusColor(status: string) {
    switch (status.toLowerCase()) {

        case "completed":
            return "bg-green-500 text-green-700";

        case "running":
            return "bg-blue-500 text-blue-700";

        case "queued":
            return "bg-yellow-500 text-yellow-700";

        case "failed":
            return "bg-red-500 text-red-700";

        default:
            return "bg-slate-400 text-slate-700";
    }
};

interface StatusBadgeProps {
    status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <div className="flex items-center gap-2">
            <span
                className={`h-3.5 w-3.5 rounded-full shadow-sm ${statusColor(status)}`}
            />
            <span className="text-sm font-semibold capitalize text-slate-700">
                {status}
            </span>
        </div>
    );
}

function progressColor(status: string) {
    switch (status.toLowerCase()) {
        case "completed":
            return "bg-emerald-600";

        case "failed":
            return "bg-red-600";

        case "queued":
            return "bg-amber-500";

        default:
            return "bg-blue-600";
    }
}