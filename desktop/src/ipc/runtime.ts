import { ipcMain } from "electron";
import {getRuntimeState,} from "../services/runtimeStateService.js";
import {startConnectorRuntime, stopConnectorRuntime, restartConnectorRuntime,} from "../services/connectorRuntimeService.js";
import {getVersion,} from "../services/backendService.js";

export function registerRuntimeHandlers(): void {
    ipcMain.handle(
        "runtime:getState",
        async () => {
            return getRuntimeState();
        },
    );

    ipcMain.handle(
        "runtime:start",
        async () => {
            await startConnectorRuntime();
        },
    );

    ipcMain.handle(
        "runtime:stop",
        async () => {
            await stopConnectorRuntime();
        },
    );

    ipcMain.handle(
        "runtime:restart",
        async () => {
            await restartConnectorRuntime();
        },
    );

    ipcMain.handle(
        "runtime:getVersion",
        async () => {
            return await getVersion();
        },
    );
}