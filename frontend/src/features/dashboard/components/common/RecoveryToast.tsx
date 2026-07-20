import { useEffect } from "react";

interface Props {
    message: string;
    onClose(): void;
}

export default function RecoveryToast({
    message,
    onClose,
}: Props) {

    useEffect(() => {

        const id = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(id);

    }, [onClose]);

    return (
        <div
            className="
                fixed
                bottom-6
                right-6
                z-50
                rounded-lg
                bg-green-600
                px-5
                py-3
                text-white
                shadow-xl
            "
        >
            ✅ {message}
        </div>
    );
}