"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
    "connector",
    {
        getRuntimeState: () => ipcRenderer.invoke("runtime:getState",),
        startConnector: () => ipcRenderer.invoke("runtime:start",),
        stopConnector: () => ipcRenderer.invoke("runtime:stop",),
        restartConnector: () => ipcRenderer.invoke("runtime:restart",),
        getVersion: () => ipcRenderer.invoke("runtime:getVersion",),
    },
);