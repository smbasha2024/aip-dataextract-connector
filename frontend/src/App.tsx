import { useEffect } from "react";

import DashboardPage from "./features/dashboard/Dashboard";

import { connectorWebSocket } from "./services/websocket";

export default function App() {

    useEffect(() => {

        connectorWebSocket.connect();

    }, []);

    return <DashboardPage />;

}