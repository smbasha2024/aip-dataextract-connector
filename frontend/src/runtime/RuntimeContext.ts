import { createContext } from "react";
import type { RuntimeState } from "../platform";

export interface RuntimeContextValue {
    runtime: RuntimeState | null;
    refresh: () => Promise<void>;
}

export const RuntimeContext = createContext<RuntimeContextValue | null>(null);