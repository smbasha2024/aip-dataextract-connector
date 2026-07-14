import { useConnectorStore } from "../../../store/connectorStore";

export default function InputDialog() {

    const input = useConnectorStore((s) => s.pendingInput);

    if (!input)
        return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

                <h2 className="text-xl font-semibold">
                    {input.title}
                </h2>

                <p className="mt-3 text-slate-600">
                    {input.message}
                </p>

                {input.image && (

                    <img
                        src={input.image}
                        className="mt-4 rounded border"
                    />

                )}

                <input
                    id="connectorInput"
                    className="mt-5 w-full border rounded-lg px-3 py-2"
                    type={input.input_type}
                />

                <button
                    className="mt-5 w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
                >
                    Submit
                </button>

            </div>

        </div>

    );

}