import {getDockerStatus, isConnectorRunning, startConnector,} from "./dockerService.js";
import { waitForBackend } from "./backendService.js";
import { DockerStatus } from "../types/docker.js";

export async function startConnectorRuntime(): Promise<void> {
    const dockerStatus = await getDockerStatus();

    switch (dockerStatus) {
        case DockerStatus.NotInstalled:
            throw new Error("Docker Desktop is not installed.");

        case DockerStatus.NotRunning:
            await startConnector();

        // We'll wait for Docker here shortly.

        case DockerStatus.Running:
            break;
    }

    const connectorRunning = await isConnectorRunning();

    if (!connectorRunning) {
        await startConnector();
    }

    await waitForBackend();
}

export async function stopConnectorRuntime(): Promise<void> {
    throw new Error("Not implemented");
}

export async function restartConnectorRuntime(): Promise<void> {
    throw new Error("Not implemented");
}