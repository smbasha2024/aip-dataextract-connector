import { runCommand } from "./commandRunner.js";
import { DockerStatus } from "../types/docker.js";

export async function isDockerRunning(): Promise<boolean> {
    try {
        await runCommand(
            "docker",
            ["info"]
        );
        return true;
    } catch {
        return false;
    }
}

export async function getDockerStatus(): Promise<DockerStatus> {
    const result = await runCommand(
        "docker",
        ["info"]
    );

    if (result.exitCode === 0) {
        return DockerStatus.Running;
    }

    const error = result.stderr.toLowerCase();

    if (
        error.includes("enoent") ||
        error.includes("not found")
    ) {
        return DockerStatus.NotInstalled;
    }

    return DockerStatus.NotRunning;
}

export async function startDocker(): Promise<void> {
    throw new Error("Not implemented");
}

export async function isConnectorRunning(): Promise<boolean> {
    throw new Error("Not implemented");
}

export async function startConnector(): Promise<void> {
    throw new Error("Not implemented");
}

export async function stopConnector(): Promise<void> {
    throw new Error("Not implemented");
}