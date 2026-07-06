import ErrorMessage from "./ErrorMessage";

export default function FormField({
    label,
    required = false,
    error,
    children,
}) {
    return (
        <div className="mb-5">
            {label && (
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                    {label}

                    {required && (
                        <span className="text-red-500 ml-1">*</span>
                    )}
                </label>
            )}

            {children}

            <ErrorMessage message={error} />
        </div>
    );
}