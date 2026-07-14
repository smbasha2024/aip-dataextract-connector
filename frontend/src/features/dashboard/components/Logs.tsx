import { useConnectorStore } from "../../../store/connectorStore";

export default function LogsPanel() {

    const logs = useConnectorStore((s) => s.logs);

    return (
        <div className="rounded-xl bg-white shadow border border-slate-200 h-[420px] flex flex-col">

            <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">
                    Live Logs
                </h2>
            </div>

            <div className="flex-1 overflow-auto">

                {logs.length === 0 && (
                    <div className="p-6 text-slate-400">
                        No logs received.
                    </div>
                )}

                {logs.map((log, index) => (

                    <div
                        key={index}
                        className="border-b px-4 py-3 text-sm"
                    >

                        <div className="flex justify-between">

                            <span className="font-semibold">
                                {log.level ?? "INFO"}
                            </span>

                            {log.progress !== undefined && (
                                <span>
                                    {log.progress}%
                                </span>
                            )}

                        </div>

                        {log.step && (
                            <div className="text-blue-600 mt-1">
                                {log.step}
                            </div>
                        )}

                        {log.message && (
                            <div className="text-slate-600 mt-1">
                                {log.message}
                            </div>
                        )}

                    </div>

                ))}

            </div>

        </div>
    );
}