import { Download } from "lucide-react";
import { useConnectorStore } from "../../../store/connectorStore";

export default function DownloadsPanel() {

    const downloads = useConnectorStore((s) => s.downloads);

    return (
        <div className="rounded-xl bg-white shadow border border-slate-200 h-[420px] flex flex-col">

            <div className="px-6 py-4 border-b flex items-center gap-2">

                <Download size={20} />

                <h2 className="text-lg font-semibold">
                    Downloads
                </h2>

            </div>

            <div className="flex-1 overflow-auto">

                {downloads.length === 0 && (

                    <div className="p-6 text-slate-400">
                        No downloaded files.
                    </div>

                )}

                {downloads.map((download, index) => (

                    <div
                        key={index}
                        className="border-b px-4 py-3"
                    >

                        <div className="font-semibold text-slate-700">

                            {download.filename}

                        </div>

                        <div className="text-xs text-slate-500 break-all mt-1">

                            {download.path}

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}