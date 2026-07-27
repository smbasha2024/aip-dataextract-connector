import { useContext } from "react";
import { RuntimeContext } from "./RuntimeContext";

export function useRuntime() {
    const context = useContext(RuntimeContext);

    if (!context) {
        throw new Error(
            "useRuntime must be used inside RuntimeProvider."
        );
    }

    return context;
}