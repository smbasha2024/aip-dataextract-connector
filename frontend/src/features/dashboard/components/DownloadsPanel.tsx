import { Download } from "lucide-react";
import { useConnectorStore } from "../../../store/connectorStore";
import type { DownloadEntry } from "../../../types/payloads";
import { FileDown } from "lucide-react";

export default function DownloadsPanel() {

    const downloads = useConnectorStore(
        (s) => s.downloads
    );

    const selectedJobId = useConnectorStore(
        (s) => s.selectedJobId
    );

    const filteredDownloads = selectedJobId
        ? downloads.filter(
            (download) =>
                download.job_id === selectedJobId
        )
        : downloads;

    return (
        <div className="rounded-xl bg-white shadow border border-slate-200 h-[420px] flex flex-col">

            <div className="flex-1">

                {filteredDownloads.length === 0 && (

                    <div className="p-6 text-slate-400">
                        No downloaded files.
                    </div>

                )}

                {filteredDownloads.map((download, index) => (

                    <div
                        key={index}
                        className="mb-2 rounded-lg border-l-4 border-green-500 bg-green-50 p-3 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">

                        <div className="flex justify-between items-center">

                            <div className="flex items-center gap-2">

                                <FileDown
                                    size={18}
                                    className="text-green-600"
                                />

                                <span className="font-semibold text-slate-800">

                                    {download.filename}

                                </span>

                            </div>

                            <span className="text-xs text-slate-500">

                                {new Date(download.timestamp)
                                    .toLocaleTimeString()}

                            </span>

                        </div>

                        <div className="mt-2 text-xs text-slate-600">

                            {download.source}

                            {download.job_id && (
                                <> • Job {download.job_id}</>
                            )}

                        </div>

                        <div className="mt-2 text-xs break-all text-slate-500">

                            {download.path}

                        </div>

                        <div className="mt-3 flex gap-2">

                            <button
                                className="
                                    rounded-md
                                    bg-blue-600
                                    px-3
                                    py-1
                                    text-sm
                                    text-white
                                    hover:bg-blue-700
                                "
                            >
                                Download
                            </button>

                            <button
                                className="
                                    rounded-md
                                    border
                                    px-3
                                    py-1
                                    text-sm
                                    hover:bg-slate-100
                                "
                                onClick={() =>
                                    navigator.clipboard.writeText(download.path)
                                }
                            >
                                Copy Path
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}