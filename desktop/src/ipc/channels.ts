export const IPC_CHANNELS = {
    Runtime: {
        GetState: "runtime:getState",
        Start: "runtime:start",
        Stop: "runtime:stop",
        Restart: "runtime:restart",
        GetVersion: "runtime:getVersion",

        StateChanged: "runtime:stateChanged",
    },
} as const;