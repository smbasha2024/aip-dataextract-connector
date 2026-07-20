import { useConnectorStore } from "../../../../store/connectorStore";

export default function ConnectorStatus() {
    const status = useConnectorStore(
        (s) => s.status?.status ?? "DISCONNECTED"
    );

    let dotColor = "bg-red-500";
    let textColor = "text-red-600";
    let subtitle = "Disconnected from Cloud Server";

    switch (status) {
        case "CONNECTED":
            dotColor = "bg-green-500";
            textColor = "text-green-600";
            subtitle = "Connected to Cloud Server";
            break;

        case "CONNECTING":
            dotColor = "bg-yellow-500";
            textColor = "text-yellow-600";
            subtitle = "Connecting...";
            break;

        case "DISCONNECTED":
        default:
            break;
    }

    return (
        <div className="flex items-center gap-3">
            <span
                className={`
                    h-3
                    w-3
                    rounded-full
                    ${dotColor}
                    animate-pulse
                `}
            />

            <div>
                <div
                    className={`
                        font-semibold
                        ${textColor}
                    `}
                >
                    {status}
                </div>

                <div className="text-xs text-gray-500">
                    {subtitle}
                </div>
            </div>
        </div>
    );
}