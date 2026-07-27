import React from "react";
import { X } from "lucide-react";

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
}) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-5xl",
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-black/40
                p-4
                backdrop-blur-[2px]
            "
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className={`
                    relative
                    flex
                    max-h-[90vh]
                    w-full
                    ${sizeClasses[size] || sizeClasses.md}
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    shadow-2xl
                `}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* ================================
                    Header
                ================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-gray-200
                        bg-white
                        px-6
                        py-4
                    "
                >
                    <h3
                        id="modal-title"
                        className="
                            text-xl
                            font-semibold
                            text-gray-900
                        "
                    >
                        {title}
                    </h3>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            text-gray-400
                            transition
                            hover:bg-gray-100
                            hover:text-gray-700
                        "
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ================================
                    Body
                ================================= */}

                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        px-6
                        py-6
                    "
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;