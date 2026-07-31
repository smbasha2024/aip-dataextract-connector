interface Props {
    title: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export default function SettingToggle({
    title,
    description,
    checked,
    onChange,
}: Props) {

    return (
        <label className="flex items-start justify-between px-6 py-5 border-b border-slate-100 last:border-b-0 cursor-pointer">
            <div className="flex-1 pr-8">

                <div className="font-medium text-slate-800">
                    {title}
                </div>

                {description && (
                    <div className="mt-2 text-sm leading-6 text-slate-500">
                        {description}
                    </div>
                )}

            </div>

            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="
                    h-5
                    w-5
                    rounded
                    border-slate-300
                    text-blue-600
                "
            />

        </label>
    );

}