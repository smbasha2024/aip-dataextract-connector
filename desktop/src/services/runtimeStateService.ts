import { EventEmitter } from "node:events";

export enum RuntimeStatus {
    Starting = "starting",
    Running = "running",
    Stopped = "stopped",
    Error = "error",
}

export interface RuntimeState {
    status: RuntimeStatus;

    dockerRunning: boolean;
    connectorRunning: boolean;
    backendHealthy: boolean;

    lastUpdated: Date;
}

export type RuntimeStateListener = (state: RuntimeState) => void;

let runtimeState: RuntimeState = {
    status: RuntimeStatus.Starting,

    dockerRunning: false,
    connectorRunning: false,
    backendHealthy: false,

    lastUpdated: new Date(),
};

const listeners = new Set<RuntimeStateListener>();
const runtimeEvents = new EventEmitter();

/**
 * Returns a read-only copy of the current runtime state.
 */
export function getRuntimeState(): Readonly<RuntimeState> {
    return { ...runtimeState };
}

/**
 * Updates one or more runtime state properties.
 */
export function updateRuntimeState(state: Partial<RuntimeState>,): void {
    const newState: RuntimeState = {
        ...runtimeState,
        ...state,
        lastUpdated: new Date(),
    };

    const changed =
        runtimeState.status !== newState.status ||
        runtimeState.dockerRunning !== newState.dockerRunning ||
        runtimeState.connectorRunning !== newState.connectorRunning ||
        runtimeState.backendHealthy !== newState.backendHealthy;

    runtimeState = newState;

    if (changed) {
        runtimeEvents.emit(
            "changed",
            getRuntimeState(),
        );
        
        notifyListeners();
    }
}

/**
 * Updates only the overall runtime status.
 */
/*
export function setRuntimeStatus(status: RuntimeStatus,): void {
    if (runtimeState.status === status) {
        return;
    }

    runtimeState = {
        ...runtimeState,
        status,
        lastUpdated: new Date(),
    };

    runtimeEvents.emit(
        "changed",
        getRuntimeState(),
    );
}
*/
/**
 * Subscribe to runtime state changes.
 */
export function onRuntimeStateChanged(listener: (state: RuntimeState) => void,): void {
    runtimeEvents.on("changed", listener,);
}

/**
 * Remove a runtime state listener.
 */
export function removeRuntimeStateListener(listener: (state: RuntimeState) => void,): void {
    runtimeEvents.off("changed", listener,);
}

export function subscribeRuntimeState(
    listener: RuntimeStateListener,
): void {

    listeners.add(listener);

}

export function unsubscribeRuntimeState(
    listener: RuntimeStateListener,
): void {

    listeners.delete(listener);

}

function notifyListeners(): void {

    for (const listener of listeners) {

        listener(getRuntimeState());

    }

}