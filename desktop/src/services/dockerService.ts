import { runCommand } from "./commandRunner.js";
import { DockerStatus } from "../types/docker.js";
import { CONNECTOR } from "../config/connector.js";

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

export async function connectorExists(): Promise<boolean> {
    const result = await runCommand(
        "docker",
        [
            "ps",
            "-a",
            "--filter",
            `name=${CONNECTOR.docker.containerName}`,
            "--format",
            "{{.Names}}",
        ]
    );

    if (!result.success) {
        return false;
    }

    return result.stdout
        .split("\n")
        .map((name) => name.trim())
        .includes(CONNECTOR.docker.containerName);
}

export async function startDocker(): Promise<void> {
    switch (process.platform) {

        case "darwin":
            await runCommand("open", [
                "-a",
                "Docker",
            ]);
            return;

        case "win32":
            throw new Error(
                "Starting Docker is not yet implemented on Windows."
            );

        case "linux":
            throw new Error(
                "Starting Docker is not yet implemented on Linux."
            );

        default:
            throw new Error(
                `Unsupported platform: ${process.platform}`
            );
    }
}

export async function isConnectorRunning(): Promise<boolean> {
    const result = await runCommand(
        "docker",
        [
            "ps",
            "--filter",
            `name=${CONNECTOR.docker.containerName}`,
            "--format",
            "{{.Names}}",
        ]
    );

    if (!result.success) {
        return false;
    }

    return result.stdout
        .split("\n")
        .map((name) => name.trim())
        .includes(CONNECTOR.docker.containerName);
}

export async function startConnector(): Promise<void> {
    const result = await runCommand(
        "docker",
        [
            "start",
            CONNECTOR.docker.containerName,
        ]
    );

    if (!result.success) {
        throw new Error(
            `Failed to start connector.\n${result.stderr}`
        );
    }
}

export async function stopConnector(): Promise<void> {
    const result = await runCommand(
        "docker",
        [
            "stop",
            CONNECTOR.docker.containerName,
        ]
    );

    if (!result.success) {
        throw new Error(
            `Failed to stop connector.\n${result.stderr}`
        );
    }
}

export async function restartConnector(): Promise<void> {
    const result = await runCommand(
        "docker",
        [
            "restart",
            CONNECTOR.docker.containerName,
        ]
    );

    if (!result.success) {
        throw new Error(
            `Failed to restart connector.\n${result.stderr}`
        );
    }
}