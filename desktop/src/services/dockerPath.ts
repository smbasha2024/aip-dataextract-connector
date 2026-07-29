import { access } from "node:fs/promises";
import path from "node:path";

let dockerPathCache: string | null = null;

const WINDOWS_PATHS = [
    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe",
    "C:\\Program Files\\Docker\\Docker\\resources\\docker.exe",
];

const MAC_PATHS = [
    "/opt/homebrew/bin/docker",
    "/usr/local/bin/docker",
    "/usr/bin/docker",
];

const LINUX_PATHS = [
    "/usr/bin/docker",
    "/usr/local/bin/docker",
];

async function exists(file: string): Promise<boolean> {
    try {
        await access(file);
        return true;
    } catch {
        return false;
    }
}

export async function getDockerPath(): Promise<string> {
    if (dockerPathCache) {
        return dockerPathCache;
    }

    // First try PATH
    dockerPathCache = "docker";

    // Platform-specific fallback
    const candidates =
        process.platform === "win32"
            ? WINDOWS_PATHS
            : process.platform === "darwin"
            ? MAC_PATHS
            : LINUX_PATHS;

    for (const candidate of candidates) {
        if (await exists(candidate)) {
            dockerPathCache = candidate;
            break;
        }
    }

    return dockerPathCache;
}