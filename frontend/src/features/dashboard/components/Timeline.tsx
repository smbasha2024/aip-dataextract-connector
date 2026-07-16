import { useConnectorStore } from "../../../store/connectorStore";
import {
    CheckCircle,
    Clock3,
    Download,
    CircleDashed,
    AlertCircle,
    HeartPulse,
} from "lucide-react";

export default function Timeline() {

    const events = useConnectorStore((s) => s.timeline);

    const selectedJobId = useConnectorStore(
        (s) => s.selectedJobId
    );

    const filteredEvents = selectedJobId
        ? events.filter(
            (event) => event.job_id === selectedJobId
        )
        : events;

    return (
        <div className="rounded-xl bg-white shadow border border-slate-200 flex flex-col">

            <div className="flex-1 overflow-auto">

                {filteredEvents.length === 0 && (
                    <div className="p-6 text-slate-400">
                        No events received.
                    </div>
                )}

                {filteredEvents.map((event) => (

                    <div
                        key={event.id}
                        className={`
                            mb-3
                            rounded-lg
                            border-l-4
                            px-4
                            py-3
                            shadow-sm
                            hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200
                            ${eventColor(event.type)}
                        `}
                    >

                        <div className="flex justify-between items-start">

                            <div>

                                <div className="flex items-center gap-2">

                                    {eventIcon(event.type)}

                                    <span className="font-semibold text-slate-800">
                                        {eventTitle(event.type)}
                                    </span>

                                </div>

                                <div className="text-sm text-slate-500 mt-1">

                                    {event.source}

                                    {event.job_id && (
                                        <> • Job {event.job_id}</>
                                    )}

                                </div>

                            </div>

                            <div className="text-xs text-slate-400 whitespace-nowrap">

                                {new Date(event.timestamp).toLocaleTimeString()}

                            </div>

                        </div>

                        <div className="mt-1 text-slate-600">

                            Source: {event.source}

                            {event.job_id && (
                                <> • Job {event.job_id}</>
                            )}

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}

function eventColor(type: string) {

    switch (type) {

        case "JOB_RECEIVED":
            return "border-blue-500 bg-blue-50";

        case "JOB_QUEUED":
            return "border-amber-500 bg-amber-50";

        case "JOB_STARTED":
            return "border-cyan-500 bg-cyan-50";

        case "JOB_COMPLETED":
            return "border-emerald-500 bg-emerald-50";

        case "JOB_FAILED":
            return "border-red-500 bg-red-50";

        case "DOWNLOAD_READY":
            return "border-purple-500 bg-purple-50";

        case "STATUS":
            return "border-slate-400 bg-slate-50";

        case "HEARTBEAT":
            return "border-green-400 bg-green-50";

        default:
            return "border-slate-300 bg-white";
    }

}

function eventTitle(type: string) {

    switch (type) {

        case "JOB_RECEIVED":
            return "Job Received";

        case "JOB_QUEUED":
            return "Queued";

        case "JOB_STARTED":
            return "Started";

        case "JOB_COMPLETED":
            return "Completed";

        case "JOB_FAILED":
            return "Failed";

        case "DOWNLOAD_READY":
            return "Download Ready";

        case "STATUS":
            return "Status Changed";

        case "HEARTBEAT":
            return "Heartbeat";

        default:
            return type.replaceAll("_", " ");

    }

}

function eventIcon(type: string) {

    switch (type) {

        case "JOB_COMPLETED":
            return <CheckCircle size={18} className="text-emerald-600" />;

        case "JOB_STARTED":
            return <CircleDashed size={18} className="text-cyan-600" />;

        case "JOB_QUEUED":
            return <Clock3 size={18} className="text-amber-600" />;

        case "DOWNLOAD_READY":
            return <Download size={18} className="text-purple-600" />;

        case "JOB_FAILED":
            return <AlertCircle size={18} className="text-red-600" />;

        case "HEARTBEAT":
            return <HeartPulse size={18} className="text-green-600" />;

        default:
            return <CircleDashed size={18} />;
    }

}