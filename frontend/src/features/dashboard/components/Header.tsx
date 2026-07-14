import { useEffect, useState } from "react";
import { useConnectorStore } from "../../../store/connectorStore";

export default function Header() {

    const connected = useConnectorStore((s) => s.connected);
    const status = useConnectorStore((s) => s.status);

    const [time, setTime] = useState(new Date());

    useEffect(() => {

        const id = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(id);

    }, []);

    return (

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-6 py-5">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold text-blue-700">
                        AIProxys Connector Dashboard
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Local Connector Monitoring Console
                    </p>

                </div>

                <div className="text-right">

                    <div className="text-sm text-slate-500">
                        Version 1.0.0
                    </div>

                    <div className="font-semibold">
                        {time.toLocaleString()}
                    </div>

                    <div className="mt-2">

                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
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

                </div>

            </div>

        </div>

    );
}