import { MonitorX } from "lucide-react";
import { useEffect } from "react";

interface Props {
    onClose: () => void;
}

export default function DuplicateDashboard({
    onClose,
}: Props) {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.close();
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-10">
                <div className="flex justify-center mb-6">
                    <div className="rounded-full bg-red-100 p-5">
                        <MonitorX
                            size={48}
                            className="text-red-600"
                        />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center">
                    Dashboard Already Open
                </h1>

                <p className="mt-4 text-center text-slate-600">
                    Another AIProxys Connector Dashboard is already running.
                </p>

                <p className="mt-2 text-center text-slate-500">
                    Please switch to the existing dashboard.
                </p>

                <button
                    onClick={onClose}
                    className="
                        mt-8
                        w-full
                        rounded-lg
                        bg-blue-600
                        py-3
                        text-white
                        hover:bg-blue-700
                    "
                >
                    Close Window
                </button>
            </div>
        </div>
    );
}