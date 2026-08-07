import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function RemoveWishlistModal({
    open,
    productName = "this product",
    busy = false,
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") onCancel?.();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [open, onCancel]);

    if (!open) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onCancel?.();
    };

    return (
        <div
            role="presentation"
            onClick={handleBackdropClick}
            className="
                fixed inset-0 z-[100] flex items-center justify-center
                bg-gray-900/50 backdrop-blur-sm
                px-4
                animate-[fadeIn_0.2s_ease-out]
            "
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="remove-wishlist-title"
                className="
                    relative w-full max-w-sm
                    rounded-2xl bg-white p-6 shadow-xl
                    animate-[popIn_0.2s_ease-out]
                "
            >
                <button
                    type="button"
                    onClick={onCancel}
                    aria-label="Close"
                    className="
                        absolute top-3 right-3
                        flex h-8 w-8 items-center justify-center
                        rounded-full text-gray-400
                        transition-colors duration-200
                        hover:bg-gray-100 hover:text-gray-600
                        focus:outline-none focus:ring-2 focus:ring-green-500
                    "
                >
                    <X size={17} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle size={30} className="text-red-600" />
                    </div>

                    <h2
                        id="remove-wishlist-title"
                        className="mt-4 text-lg font-bold text-gray-900"
                    >
                        Remove this product from wishlist?
                    </h2>

                    <p className="mt-1.5 text-sm text-gray-500">
                        <span className="font-semibold text-gray-700">
                            {productName}
                        </span>{" "}
                        will be removed from your wishlist.
                    </p>

                    <div className="mt-6 flex w-full gap-3">
                        <button
                            type="button"
                            disabled={busy}
                            onClick={onCancel}
                            className="
                                flex-1 rounded-lg border border-gray-200 px-4 py-2.5
                                text-sm font-medium text-gray-700
                                transition-colors duration-200
                                hover:bg-gray-50
                                disabled:cursor-not-allowed disabled:opacity-60
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={busy}
                            onClick={onConfirm}
                            className="
                                flex-1 rounded-lg bg-red-600 px-4 py-2.5
                                text-sm font-medium text-white
                                transition-colors duration-200
                                hover:bg-red-700
                                disabled:cursor-not-allowed disabled:opacity-60
                            "
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.95) translateY(4px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}