import {healthCheck,} from "./backendService.js";
import {getDockerStatus, isConnectorRunning,} from "./dockerService.js";
import {updateRuntimeState, RuntimeStatus,} from "./runtimeStateService.js";
import {DockerStatus,} from "../types/docker.js";

let monitorTimer: NodeJS.Timeout | null = null;
const MONITOR_INTERVAL = 5000;

function calculateRuntimeStatus(dockerRunning: boolean, connectorRunning: boolean, backendHealthy: boolean,): RuntimeStatus {

    if (dockerRunning && connectorRunning && backendHealthy) {
        return RuntimeStatus.Running;
    }

    if (!dockerRunning) {
        return RuntimeStatus.Stopped;
    }

    return RuntimeStatus.Error;
}

async function monitor(): Promise<void> {
    try {
        const dockerRunning = (await getDockerStatus()) === DockerStatus.Running;

        let connectorRunning = false;
        let backendHealthy = false;

        if (dockerRunning) {
            connectorRunning = await isConnectorRunning();

            if (connectorRunning) {
                backendHealthy = await healthCheck();
            }
        }
       /*
        let status: RuntimeStatus;

        if (dockerRunning && connectorRunning && backendHealthy) {
            //setRuntimeStatus(RuntimeStatus.Running);
            status = RuntimeStatus.Running;
        }
        else if (!dockerRunning) {
            //setRuntimeStatus(RuntimeStatus.Stopped);
            status = RuntimeStatus.Stopped;
        }
        else {
            //setRuntimeStatus(RuntimeStatus.Error);
             status = RuntimeStatus.Error;
        }
        */
        const status = calculateRuntimeStatus(dockerRunning, connectorRunning, backendHealthy,);
        updateRuntimeState({status, dockerRunning, connectorRunning, backendHealthy,});
    }
    catch (error) {
        console.error("Runtime monitor error:", error,);
        //setRuntimeStatus(RuntimeStatus.Error);
       updateRuntimeState({status: RuntimeStatus.Error,});
    }
}

export function startRuntimeMonitor(): void {
    if (monitorTimer) {
        return;
    }

    void monitor();

    monitorTimer = setInterval(() => {
            void monitor();
        },
        MONITOR_INTERVAL,
    );
}

export function stopRuntimeMonitor(): void {
    if (!monitorTimer) {
        return;
    }

    clearInterval(monitorTimer,);
    monitorTimer = null;
}