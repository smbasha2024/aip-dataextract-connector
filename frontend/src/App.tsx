import { useEffect } from "react";
import DashboardPage from "./features/dashboard/Dashboard";
import { connectorWebSocket } from "./services/websocket";
import {ensureSingleDashboard, notifyExistingDashboard,} from "./services/dashboardInstance";
import { useState } from "react";
import DuplicateDashboard from "./features/dashboard/components/common/DuplicateDashboard";

export default function App() {
    const [duplicateDashboard, setDuplicateDashboard] = useState(false);

    useEffect(() => {
        async function initialize() {
            const first = await ensureSingleDashboard();

            console.log("Primary dashboard:", first);

            if (!first) {
                notifyExistingDashboard();
                setDuplicateDashboard(true);
                return;
            }

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