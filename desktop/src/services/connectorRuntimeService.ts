import {getDockerStatus, waitForDocker, startDocker, connectorExists, isConnectorRunning, startConnector, stopConnector, restartConnector,} from "./dockerService.js";

import { waitForBackend } from "./backendService.js";
import { DockerStatus } from "../types/docker.js";

export async function startConnectorRuntime(): Promise<void> {

    const dockerStatus = await getDockerStatus();

    switch (dockerStatus) {

        case DockerStatus.NotInstalled:
            throw new Error(
                "Docker Desktop is not installed."
            );

        case DockerStatus.NotRunning:
            await startDocker();
            await waitForDocker();
            break;

        case DockerStatus.Running:
            break;
    }

    if (!(await connectorExists())) {
        throw new Error(
            "Connector container is not installed."
        );
    }

    if (!(await isConnectorRunning())) {
        await startConnector();
    }

    await waitForBackend();
}

export async function stopConnectorRuntime(): Promise<void> {
    await stopConnector();
}

export async function restartConnectorRuntime(): Promise<void> {
    await restartConnector();
    await waitForBackend();
}