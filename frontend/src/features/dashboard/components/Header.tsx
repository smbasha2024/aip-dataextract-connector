import { useEffect, useState } from "react";
import { useConnectorStore } from "../../../store/connectorStore";
import { CONFIG } from "../../../config/config"

export default function Header() {

    const connected = useConnectorStore((s) => s.connected);
    const status = useConnectorStore((s) => s.status);

    const selectedJobId = useConnectorStore(
        (s) => s.selectedJobId
    );

    const setSelectedJob = useConnectorStore(
        (s) => s.setSelectedJob
    );

    const [time, setTime] = useState(new Date());

    useEffect(() => {

        const id = setInterval(() => {

            setTime(new Date());

        }, 1000);

        return () => clearInterval(id);

    }, []);

    return (

        <div className="bg-white rounded-xl shadow border border-slate-200 px-8 py-6">

            <div className="flex justify-between items-start">

                {/* LEFT */}

                <div>

                    <h1 className="text-4xl font-bold text-blue-700">
                        {CONFIG.appName}
                    </h1>

                    <p className="text-slate-500 mt-2">
                        {CONFIG.caption}
                    </p>

                </div>

                {/* RIGHT */}

                <div className="text-right space-y-2">

                    <div>

                        <span
                            className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-semibold ${
                                connected
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {connected
                                ? status?.status ?? "CONNECTED"
                                : "OFFLINE"}
                        </span>

                    </div>

                    <div className="text-sm text-slate-500">

                        Version {CONFIG.version}

                    </div>

                    <div className="font-semibold">

                        {time.toLocaleDateString()} {time.toLocaleTimeString()}

                    </div>

                </div>

            </div>

            <div className="mt-6 flex items-center justify-between border-t pt-4">

                <div className="flex items-center gap-3">

                    <span className="text-slate-500">

                        Viewing

                    </span>

                    <span className="rounded-full bg-blue-100 px-4 py-1 font-semibold text-blue-700">

                        {selectedJobId
                            ? `Job ${selectedJobId}`
                            : "All Jobs"}

                    </span>

                </div>

                {selectedJobId && (

                    <button
                        onClick={() => setSelectedJob(null)}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                    >
                        Clear Selection
                    </button>

                )}

            </div>

        </div>

    );

}