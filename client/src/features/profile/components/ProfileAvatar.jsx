import { useRef } from "react";
import { Camera, Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function ProfileAvatar({
    firstname,
    lastname,
    profileImage,
    onUpload,
    uploading = false,
    error = "",
}) {
    const fileInputRef = useRef(null);

    const initials = `${firstname?.charAt(0) || ""}${lastname?.charAt(0) || ""}`.toUpperCase();

    const imageUrl = profileImage
        ? profileImage.startsWith("http")
            ? profileImage
            : `${API_BASE_URL}${profileImage}`
        : null;

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            onUpload(null, "Only JPEG, PNG or WEBP images are allowed");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            onUpload(null, "Image must be smaller than 2MB");
            return;
        }

        onUpload(file, "");
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                <div className="w-32 h-32 rounded-full bg-green-700 text-white flex items-center justify-center text-4xl font-semibold overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={`${firstname} ${lastname}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        initials || "?"
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    aria-label="Change profile photo"
                    className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-white border shadow flex items-center justify-center text-gray-600 hover:text-green-700 disabled:cursor-not-allowed"
                >
                    {uploading ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Camera size={16} />
                    )}
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
            )}
        </div>
    );
}
