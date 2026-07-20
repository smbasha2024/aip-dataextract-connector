import { useEffect } from "react";
import DashboardPage from "./features/dashboard/Dashboard";
import { connectorWebSocket } from "./services/websocket";
import {ensureSingleDashboard, notifyExistingDashboard,} from "./services/dashboardInstance";
import { useState } from "react";
import DuplicateDashboard from "./features/dashboard/components/common/DuplicateDashboard";
//import { useConnectorStore } from "./store/connectorStore";
import { restoreDashboard } from "./services/dashboardBootstrap";

export default function App() {
    const [duplicateDashboard, setDuplicateDashboard] = useState(false);
    //const restoreDashboardState = useConnectorStore((s) => s.restoreDashboardState);

    useEffect(() => {
        async function initialize() {
            //restoreDashboardState();
            const first = await ensureSingleDashboard();

            console.log("Primary dashboard:", first);

            if (!first) {
                notifyExistingDashboard();
                setDuplicateDashboard(true);
                return;
            }

            // Restore dashboard state from backend
            await restoreDashboard();

            // Start receiving live updates
            connectorWebSocket.connect();

            if (
                "Notification" in window &&
                Notification.permission === "default"
            ) {
                Notification.requestPermission();
            }
        }

        initialize();

    }, []);

   if (duplicateDashboard) {
        return (
            <DuplicateDashboard
                onClose={() => window.close()}
            />
        );
    }
    return <DashboardPage />;
}