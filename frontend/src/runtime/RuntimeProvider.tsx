import { useCallback, useEffect, useMemo, useState, type ReactNode,} from "react";

import { RuntimeContext } from "./RuntimeContext";
import { connectorTransport } from "../platform";
import type { RuntimeState } from "../platform";

interface Props {
    children: ReactNode;
}

export function RuntimeProvider({
    children,
}: Props) {

    const [runtime, setRuntime] = useState<RuntimeState | null>(null);

    const refresh = useCallback(async () => {
        const state = await connectorTransport.getRuntimeState();
        setRuntime(state);
    }, []);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const state = await connectorTransport.getRuntimeState();

            if (!cancelled) {
                setRuntime(state);
            }
        })();

        const unsubscribe = connectorTransport.onRuntimeStateChanged(
            (state) => {
                setRuntime(state);
            },
        );

        return () => {
            cancelled = true;
            unsubscribe();
        };

    }, [refresh]);

    const value = useMemo(
        () => ({
            runtime,
            refresh,
        }),
        [runtime, refresh],
    );

    return (
        <RuntimeContext.Provider value={value}>
            {children}
        </RuntimeContext.Provider>
    );
}