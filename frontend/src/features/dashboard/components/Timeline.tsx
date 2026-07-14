import { useConnectorStore } from "../../../store/connectorStore";

export default function Timeline() {

    const events = useConnectorStore((s) => s.timeline);

    return (
        <div className="rounded-xl bg-white shadow border border-slate-200 h-[420px] flex flex-col">

            <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">
                    Timeline
                </h2>
            </div>

            <div className="flex-1 overflow-auto">

                {events.length === 0 && (
                    <div className="p-6 text-slate-400">
                        No events received.
                    </div>
                )}

                {events.map((event) => (

                    <div
                        key={event.id}
                        className="border-b px-4 py-3 text-sm"
                    >

                        <div className="flex justify-between">

                            <span className="font-semibold">
                                {event.type}
                            </span>

                            <span className="text-slate-400 text-xs">
                                {new Date(event.timestamp).toLocaleTimeString()}
                            </span>

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