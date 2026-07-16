import { useConnectorStore } from "../../../store/connectorStore";
import {
    Info,
    AlertTriangle,
    XCircle,
    Activity
} from "lucide-react";
import { FileText } from "lucide-react";

export default function LogsPanel() {

    const logs = useConnectorStore(s => s.logs);

    const selectedJobId =
        useConnectorStore(
            s => s.selectedJobId
        );

    const filteredLogs =
        selectedJobId
            ? logs.filter(
                l => l.job_id === selectedJobId
            )
            : logs;

    return (
        <div className="rounded-xl bg-white shadow border border-slate-200 flex flex-col flex-1 min-h-0">

            <div className="flex-1 overflow-auto p-2">

                {filteredLogs.length === 0 && (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">

                            <FileText
                                size={40}
                                className="mx-auto text-slate-300"
                            />

                            <div className="mt-3 text-slate-500 font-medium">

                                No activity yet

                            </div>

                            <div className="text-sm text-slate-400 mt-1">

                                Logs from connector and agents
                                will appear here.

                            </div>

                        </div>

                    </div>
                )}

                {filteredLogs.map((log, index) => (

                    <div
                        key={index}
                        className={`
                            mb-3
                            rounded-lg
                            border-l-4
                            px-4
                            py-3
                            shadow-sm
                            hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200
                            ${logColor(log.level)}
                        `}
                    >

                        <div className="flex justify-between items-start">

                            <div className="flex items-center gap-2">

                                {logIcon(log.level)}

                                <span className="font-semibold">
                                    {levelText(log.level)}
                                </span>

                            </div>

                            <div className="text-right">

                                {log.timestamp && (

                                    <div className="text-xs text-slate-400">

                                        {new Date(log.timestamp).toLocaleTimeString()}

                                    </div>

                                )}

                                {log.progress !== undefined && (

                                    <div className="text-sm font-semibold text-blue-600">

                                        {log.progress}%

                                    </div>

                                )}

                            </div>

                        </div>

                        {log.step && (

                            <div className="mt-3 font-medium text-blue-700">

                                {log.step}

                            </div>

                        )}

                        {log.message && (

                            <div className="mt-2 text-slate-700">

                                {log.message}

                            </div>

                        )}

                        {log.progress !== undefined && (

                            <div className="mt-3">

                                <div className="h-2 rounded-full bg-slate-200">

                                    <div
                                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                        style={{
                                            width: `${log.progress}%`,
                                        }}
                                    />

                                </div>

                            </div>

                        )}

                        <div className="mt-3 flex justify-between text-xs text-slate-500">

                            <span>

                                {log.source}

                                {log.job_id && (
                                    <> • Job {log.job_id}</>
                                )}

                            </span>

                        </div>

                        <button
                            className="text-xs text-blue-600 hover:underline"
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    `${log.step ?? ""}\n${log.message ?? ""}`
                                )
                            }
                        >
                            Copy
                        </button>

                    </div>

                ))}

            </div>

        </div>
    );
}

function logColor(level?: string) {

    switch ((level ?? "").toUpperCase()) {

        case "ERROR":
            return "border-red-500 bg-red-50";

        case "WARNING":
            return "border-amber-500 bg-amber-50";

        case "INFO":
            return "border-blue-500 bg-blue-50";

        default:
            return "border-slate-300 bg-white";
    }

}

function levelText(level?: string) {
    return (level ?? "STEP").toUpperCase();
}

function logIcon(level?: string) {

    switch ((level ?? "").toUpperCase()) {

        case "ERROR":
            return <XCircle size={18} className="text-red-600" />;

        case "WARNING":
            return <AlertTriangle size={18} className="text-amber-600" />;

        case "INFO":
            return <Info size={18} className="text-blue-600" />;

        default:
            return <Activity size={18} className="text-slate-600" />;

    }

}