import { access } from "node:fs/promises";

const DOCKER_PATHS = [
    "/usr/local/bin/docker",
    "/opt/homebrew/bin/docker",
    "/usr/bin/docker",
];

export async function getDockerPath(): Promise<string> {
    for (const path of DOCKER_PATHS) {
        try {
            await access(path);
            return path;
        } catch {
            continue;
        }
    }

    return "docker";
}