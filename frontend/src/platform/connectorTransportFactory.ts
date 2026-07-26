import { RestTransport } from "./restTransport";
import { ElectronTransport } from "./electronTransport";
import type {ConnectorTransport,} from "./connectorTransport";

export function createConnectorTransport(): ConnectorTransport {
    if (typeof window !== "undefined" && "connector" in window) {
        return new ElectronTransport();
    }

    return new RestTransport();
}