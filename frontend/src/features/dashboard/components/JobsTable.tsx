import { useConnectorStore } from "../../../store/connectorStore";

export default function JobTable() {

    const jobs = useConnectorStore((s) =>
        Object.values(s.jobs).sort((a, b) => b.task_id - a.task_id)
    );

    return (
        <div className="rounded-xl bg-white shadow border border-slate-200">

            <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">
                    Jobs
                </h2>
            </div>

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
                            className="border-t hover:bg-slate-50"
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

                                <div className="w-40">

                                    <div className="h-2 rounded bg-slate-200">

                                        <div
                                            className="h-2 rounded bg-blue-600 transition-all"
                                            style={{
                                                width: `${job.progress}%`,
                                            }}
                                        />

                                    </div>

                                    <div className="text-xs mt-1">
                                        {job.progress}%
                                    </div>

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

function StatusBadge({
    status,
}: {
    status: string;
}) {

    const colors: Record<string, string> = {
        RECEIVED: "bg-slate-100 text-slate-700",
        QUEUED: "bg-yellow-100 text-yellow-700",
        RUNNING: "bg-blue-100 text-blue-700",
        COMPLETED: "bg-green-100 text-green-700",
        FAILED: "bg-red-100 text-red-700",
    };

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
                colors[status] ??
                "bg-slate-100 text-slate-700"
            }`}
        >
            {status}
        </span>
    );
}