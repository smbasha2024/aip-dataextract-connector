import { useConnectorStore } from "../../../store/connectorStore";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRef } from "react";
import { CONFIG } from "../../../config/config"

export default function InputDialog() {
    const input = useConnectorStore((s) => s.pendingInput);
    const [value, setValue] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!input)
            return;

        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 50);

        return () => clearTimeout(timer);

    }, [input]);

    async function submit() {
        if (submitting || value.trim() === "")
            return;

        if (!input)
            return;

        setSubmitting(true);

        try {
            await axios.post(
                 `${CONFIG.apiUrl}/api/input/respond`,
                {
                    request_id: input.request_id,
                    value,
                }
            );
        }
        catch (err) {
            console.error(err);
            console.log("Failed to submit input.");
        }
        finally {
            setSubmitting(false);
        }
    }

    if (!input)
        return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <h2  className="text-xl font-bold text-slate-800">
                    {input.title}
                </h2>
                <p className="mt-3 text-slate-600">
                    {input.message}
                </p>
                {input.image && (
                    <img
                        src={input.image}
                        className="mt-4 w-full rounded-lg border shadow-sm"
                        alt="Input challenge"
                    />
                )}
                <input
                    id="connectorInput"
                    ref={inputRef}
                    className="mt-5 w-full border rounded-lg px-3 py-2"
                    type={input.input_type}
                    placeholder={
                        input.input_type === "password"
                            ? "Enter password"
                            : input.input_type === "number"
                            ? "Enter OTP"
                            : "Enter value"
                    }
                    value={value}
                    onChange={(e) =>
                        setValue(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            submit();
                        }
                    }}
                    disabled={submitting}
                />
                <button
                    className="mt-5 w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
                    disabled={
                        submitting ||
                        value.trim() === ""
                    }
                    onClick={submit}
                >
                    {submitting? "⏳ Submitting...": "Submit"}
                </button>
            </div>
        </div>
    );
}