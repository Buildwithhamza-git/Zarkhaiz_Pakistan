import { useEffect } from "react";
import { Heart, X } from "lucide-react";

export default function WishlistConfirmModal({
    open,
    productName = "this product",
    busy = false,
    onNotify,
    onSaveOnly,
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
                aria-labelledby="wishlist-confirm-title"
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
                        <Heart size={30} className="fill-red-500 text-red-500" />
                    </div>

                    <h2
                        id="wishlist-confirm-title"
                        className="mt-4 text-lg font-bold text-gray-900"
                    >
                        Add to Wishlist?
                    </h2>

                    <p className="mt-1.5 text-sm text-gray-500">
                        Would you like to notify the seller that you have added{" "}
                        <span className="font-semibold text-gray-700">
                            {productName}
                        </span>{" "}
                        to your wishlist?
                    </p>

                    <div className="mt-6 flex w-full flex-col gap-2.5">
                        <button
                            type="button"
                            disabled={busy}
                            onClick={onNotify}
                            className="
                                inline-flex w-full items-center justify-center gap-2
                                rounded-lg bg-green-700 px-4 py-2.5
                                text-sm font-medium text-white
                                transition-all duration-200
                                hover:bg-green-800 hover:-translate-y-0.5
                                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
                                disabled:cursor-not-allowed disabled:opacity-60
                            "
                        >
                            Yes, Notify Seller
                        </button>

                        <button
                            type="button"
                            disabled={busy}
                            onClick={onSaveOnly}
                            className="
                                inline-flex w-full items-center justify-center
                                rounded-lg border border-green-700 px-4 py-2.5
                                text-sm font-medium text-green-700
                                transition-colors duration-200
                                hover:bg-green-50
                                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
                                disabled:cursor-not-allowed disabled:opacity-60
                            "
                        >
                            No, Just Save
                        </button>

                        <button
                            type="button"
                            disabled={busy}
                            onClick={onCancel}
                            className="
                                inline-flex w-full items-center justify-center
                                px-4 py-2.5
                                text-sm font-medium text-gray-500
                                transition-colors duration-200
                                hover:text-gray-700
                                disabled:cursor-not-allowed disabled:opacity-60
                            "
                        >
                            Cancel
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