import { useEffect, useRef, useState } from "react";
import { Camera, Image as ImageIcon } from "lucide-react";

export default function ImageUpload({
    label,
    value,
    onChange,
    accept = "image/png,image/jpeg,image/jpg",
    error,
}) {

    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {

        // ❌ No value
        if (!value) {
            setPreview(null);
            return;
        }

        // ✅ If value is already a URL (from localStorage or backend)
        if (typeof value === "string") {
            setPreview(value);
            return;
        }

        // ✅ If value is a File
        if (value instanceof File) {

            const url = URL.createObjectURL(value);

            setPreview(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        }

        // fallback
        setPreview(null);

    }, [value]);

    const handleSelect = (e) => {

        const file = e.target.files?.[0];

        if (!file) return;

        onChange(file);
    };

    return (
        <div>

            <label className="font-medium">
                {label}
            </label>

            <div className="mt-4 flex items-center gap-5">

                {/* Preview */}
                <div
                    className="
                        w-28
                        h-28
                        rounded-full
                        overflow-hidden
                        border-2
                        border-dashed
                        border-green-300
                        flex
                        items-center
                        justify-center
                        bg-green-50
                    "
                >

                    {preview ? (
                        <img
                            src={preview}
                            alt="preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <ImageIcon
                            size={36}
                            className="text-green-400"
                        />
                    )}

                </div>

                {/* Controls */}
                <div>

                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="
                            px-5
                            py-2
                            rounded-xl
                            bg-green-700
                            text-white
                            hover:bg-green-800
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <Camera size={18} />

                        {preview
                            ? "Change Image"
                            : "Upload Image"}
                    </button>

                    <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG or JPEG only
                    </p>

                    <input
                        ref={inputRef}
                        hidden
                        type="file"
                        accept={accept}
                        onChange={handleSelect}
                    />

                    {error && (
                        <p className="text-red-600 text-sm mt-2">
                            {error}
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
}