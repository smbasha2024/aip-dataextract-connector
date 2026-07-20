export type ConnectionHealth =
    | "HEALTHY"
    | "DELAYED"
    | "LOST";

export function getConnectionHealth(
    heartbeat: Date | null
): ConnectionHealth {

    if (!heartbeat) {
        return "LOST";
    }

    const seconds =
        (Date.now() - heartbeat.getTime()) / 1000;

    if (seconds < 20) {
        return "HEALTHY";
    }

    if (seconds < 30) {
        return "DELAYED";
    }

    return "LOST";
}