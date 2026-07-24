import { CONNECTOR } from "../config/connector.js";

const HEALTH_CHECK_TIMEOUT_MS = 3000;
const WAIT_TIMEOUT_MS = 30000;
const RETRY_INTERVAL_MS = 1000;

export async function healthCheck(): Promise<boolean> {
    const controller = new AbortController();

    const timeout = setTimeout(
        () => controller.abort(),
        HEALTH_CHECK_TIMEOUT_MS
    );

    try {
        const response = await fetch(
            CONNECTOR.localConnector.healthUrl,
            {
                method: "GET",
                signal: controller.signal,
            }
        );

        return response.ok;
    } catch {
        return false;
    } finally {
        clearTimeout(timeout);
    }
}

export async function waitForBackend(): Promise<void> {
    const startTime = Date.now();

    while (true) {
        if (await healthCheck()) {
            return;
        }

        if (
            Date.now() - startTime >
            WAIT_TIMEOUT_MS
        ) {
            throw new Error(
                "Timed out waiting for Local Connector."
            );
        }

        await new Promise((resolve) =>
            setTimeout(resolve, RETRY_INTERVAL_MS)
        );
    }
}

export async function getVersion(): Promise<string> {
    throw new Error("Not implemented");
}