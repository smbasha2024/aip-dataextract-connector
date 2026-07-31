import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useSettings } from "../../../settings";
import type { AppSettings } from "../../../platform/settings";

import SettingSection from "./SettingSection";
import SettingToggle from "./SettingsTaggle";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function SettingsPanel({
    open,
    onClose,
}: Props) {

    const {
        settings,
        refresh,
        save,
    } = useSettings();

    const [form, setForm] = useState<AppSettings | null>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        let cancelled = false;

        async function load() {
            await refresh();

            if (!cancelled && settings) {
                setForm(structuredClone(settings));
            }
        }

        void load();

        return () => {
            cancelled = true;
        };

    }, [open]);

    if (!open || !form) {
        return null;
    }

    const updateConnector = (
        values: Partial<AppSettings["connector"]>,
    ) => {

        setForm((current) => {

            if (!current) {
                return current;
            }

            return {
                ...current,
                connector: {
                    ...current.connector,
                    ...values,
                },
            };
        });
    };

    const updateApplication = (
        values: Partial<AppSettings["application"]>,
    ) => {

        setForm((current) => {

            if (!current) {
                return current;
            }

            return {
                ...current,
                application: {
                    ...current.application,
                    ...values,
                },
            };
        });
    };

    async function handleSave() {
        if (!form) {
            return;
        }

        await save(form);
        onClose();
    }

    function handleCancel() {
        if (settings) {
            setForm(structuredClone(settings));
        }

        onClose();
    }

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/30"
                onClick={handleCancel}
            />

            <div
                className="
                    absolute
                    right-0
                    top-0
                    h-full
                    w-[540px]
                    bg-slate-50
                    shadow-2xl
                    flex
                    flex-col
                "
            >

                {/* Header */}

                <div className="flex items-center justify-between border-b bg-white px-8 py-6">

                    <h2 className="text-xl font-semibold">
                        Settings
                    </h2>

                    <button
                        onClick={handleCancel}
                        className="
                            rounded-md
                            p-2
                            hover:bg-slate-100
                            transition-colors
                        "
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Body */}

                <div className="flex-1 overflow-auto px-8 py-7 pt-2">
                    <SettingSection title="Startup">
                        <SettingToggle
                            title="Launch at Login"
                            description="Start AIProxys Connector automatically when Windows or macOS starts."
                            checked={form.application.launchAtLogin}
                            onChange={(value) =>
                                updateApplication({
                                    launchAtLogin: value,
                                })
                            }
                        />

                        <SettingToggle
                            title="Start Connector Automatically"
                            description="Start the connector service when the desktop application launches."
                            checked={form.connector.autoStart}
                            onChange={(value) =>
                                updateConnector({
                                    autoStart: value,
                                })
                            }
                        />

                        <SettingToggle
                            title="Start Docker Automatically"
                            description="Automatically start Docker Desktop if it is not already running."
                            checked={form.connector.startDockerAutomatically}
                            onChange={(value) =>
                                updateConnector({
                                    startDockerAutomatically: value,
                                })
                            }
                        />

                        <SettingToggle
                            title="Start Hidden"
                            description="Launch minimized to the system tray."
                            checked={form.connector.startHidden}
                            onChange={(value) =>
                                updateConnector({
                                    startHidden: value,
                                })
                            }
                        />

                    </SettingSection>

                    <div className="mt-10">

                        <SettingSection title="Application">

                            <SettingToggle
                                title="Close to Tray"
                                description="Closing the window keeps AIProxys Connector running in the background."
                                checked={form.application.closeToTray}
                                onChange={(value) =>
                                    updateApplication({
                                        closeToTray: value,
                                    })
                                }
                            />

                            <SettingToggle
                                title="Minimize to Tray"
                                description="Hide the application in the system tray when minimized."
                                checked={form.application.minimizeToTray}
                                onChange={(value) =>
                                    updateApplication({
                                        minimizeToTray: value,
                                    })
                                }
                            />

                            <SettingToggle
                                title="Automatically Check for Updates"
                                description="Periodically check for new desktop application versions."
                                checked={form.application.autoCheckUpdates}
                                onChange={(value) =>
                                    updateApplication({
                                        autoCheckUpdates: value,
                                    })
                                }
                            />

                        </SettingSection>

                    </div>

                </div>

                {/* Footer */}

                <div
                    className="
                        flex
                        justify-end
                        gap-3
                        border-t
                        bg-white
                        px-8
                        py-5
                    "
                >

                    <button
                        onClick={handleCancel}
                        className="
                            rounded-md
                            border
                            px-7
                            py-2.5
                            hover:bg-slate-100
                        "
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="
                            rounded-md
                            bg-blue-600
                            px-7
                            py-2.5
                            text-white
                            hover:bg-blue-700
                        "
                    >
                        Save
                    </button>

                </div>

            </div>

        </div>
    );
}