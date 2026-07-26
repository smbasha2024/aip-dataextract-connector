import {getDockerStatus, waitForDocker, startDocker, connectorExists, isConnectorRunning, startConnector, stopConnector, restartConnector,} from "./dockerService.js";
import { waitForBackend } from "./backendService.js";
import { DockerStatus } from "../types/docker.js";
import {showDockerNotRunningDialog, showRetryDialog,} from "./dialogService.js";

async function reportStatus(
    message: string,
    onStatus?: (message: string) => Promise<void>,
): Promise<void> {

    if (onStatus) {
        await onStatus(message);
    }
}

export async function startConnectorRuntime(onStatus?: (message: string)=> Promise<void>,): Promise<void> {
    await reportStatus("Checking Docker Desktop...", onStatus,);
    const dockerStatus = await getDockerStatus();

    switch (dockerStatus) {
        case DockerStatus.NotInstalled:
            throw new Error(
                "Docker Desktop is not installed."
            );

        case DockerStatus.NotRunning: {
            const start = await showDockerNotRunningDialog();

            if (!start) {
                throw new Error(
                    "Docker Desktop is required."
                );
            }

            await reportStatus("Starting Docker Desktop...", onStatus,);
            await startDocker();
            await reportStatus("Waiting for Docker Desktop...", onStatus,);

            await waitForDocker();
            break;
        }

        case DockerStatus.Running:
            break;
    }

    await reportStatus("Checking Local Connector...", onStatus,);

    if (!(await connectorExists())) {
        throw new Error(
            "Connector container is not installed."
        );
    }

    if (!(await isConnectorRunning())) {
       await reportStatus("Starting Local Connector...", onStatus,);
        await startConnector();
    }

    await reportStatus("Waiting for Local Connector...", onStatus,);

    while (true) {
        try {
            await waitForBackend();
            break;

        } catch {
            const retry = await showRetryDialog("The Local Connector is still starting.");

            if (!retry) {
                throw new Error("Local Connector did not start.");
            }
        }
    }

    await reportStatus("Local Connector is ready.", onStatus,);
}

export async function stopConnectorRuntime(): Promise<void> {
    await stopConnector();
}

export async function restartConnectorRuntime(): Promise<void> {
    await restartConnector();
    await waitForBackend();
}
