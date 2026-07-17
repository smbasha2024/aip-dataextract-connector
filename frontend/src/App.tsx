import { useEffect } from "react";
import DashboardPage from "./features/dashboard/Dashboard";
import { connectorWebSocket } from "./services/websocket";

export default function App() {
    useEffect(() => {
        connectorWebSocket.connect();
        
        if ("Notification" in window) {
            if (Notification.permission === "default") {
                Notification.requestPermission();
            }
        }
    }, []);

    return <DashboardPage />;
}