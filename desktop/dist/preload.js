"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("connector", {
    getRuntimeState: () => ipcRenderer.invoke("runtime:getState"),
    startConnector: () => ipcRenderer.invoke("runtime:start"),
    stopConnector: () => ipcRenderer.invoke("runtime:stop"),
    restartConnector: () => ipcRenderer.invoke("runtime:restart"),
    getVersion: () => ipcRenderer.invoke("runtime:getVersion"),
    onRuntimeStateChanged: (callback) => {
        const listener = (_, state) => { callback(state); };
        ipcRenderer.on("runtime:stateChanged", listener);
        return () => { ipcRenderer.removeListener("runtime:stateChanged", listener); };
    },
    getSettings: () => ipcRenderer.invoke("settings:get"),
    updateSettings: (settings) => ipcRenderer.invoke("settings:update", settings),
});
//# sourceMappingURL=preload.js.map