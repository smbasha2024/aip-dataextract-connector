import { createConnectorTransport } from "./connectorTransportFactory";

export const connectorTransport = createConnectorTransport();
export type { RuntimeState ,ConnectorTransport} from "./connectorTransport";