interface Props {
    title: string;
    children: React.ReactNode;
}

export default function SettingSection({
    title,
    children,
}: Props) {

    return (
        <div className="mb-8">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-600">
                {title}
            </h3>

            <div className="rounded-lg border border-slate-200 bg-white">
                {children}
            </div>
        </div>
    );
}