export function formatHeartbeatAge(date: Date | null): string {
    if (!date) {
        return "Never";
    }

    const seconds = Math.floor(
        (Date.now() - date.getTime()) / 1000
    );

    if (seconds < 2) {
        return "Just now";
    }

    if (seconds < 60) {
        return `${seconds} sec ago`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    return `${hours} hr ago`;
}

export function formatDuration(
    date: Date | null
): string {

    if (!date)
        return "--";

    const seconds =
        Math.floor(
            (Date.now() - date.getTime()) / 1000
        );

    const hours =
        Math.floor(seconds / 3600);

    const minutes =
        Math.floor((seconds % 3600) / 60);

    const secs =
        seconds % 60;

    if (hours > 0)
        return `${hours}h ${minutes}m`;

    if (minutes > 0)
        return `${minutes}m ${secs}s`;

    return `${secs}s`;
}