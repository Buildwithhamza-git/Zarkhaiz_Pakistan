import { Mail, Calendar, Sprout } from "lucide-react";
import ProfileAvatar from "./ProfileAvatar";

const formatMemberSince = (createdAt) => {
    if (!createdAt) return "—";

    return new Date(createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
};

export default function ProfileSidebar({ user, onAvatarUpload, avatarUploading, avatarError }) {
    return (
        <div className="bg-green-50 rounded-2xl p-6 flex flex-col items-center text-center h-fit">
            <ProfileAvatar
                firstname={user?.firstname}
                lastname={user?.lastname}
                profileImage={user?.profileImage}
                onUpload={onAvatarUpload}
                uploading={avatarUploading}
                error={avatarError}
            />

            <h2 className="mt-4 text-xl font-bold text-gray-900">
                {user?.firstname} {user?.lastname}
            </h2>

            <span className="mt-1 inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold capitalize">
                {user?.role || "Customer"}
            </span>

            <div className="mt-4 flex items-center gap-2 text-gray-600 text-sm">
                <Mail size={16} />
                <span>{user?.email}</span>
            </div>

            <hr className="w-full my-4 border-green-100" />

            <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar size={16} />
                <span>Member since {formatMemberSince(user?.createdAt)}</span>
            </div>

            <div className="mt-5 w-full bg-white rounded-xl p-4 flex items-start gap-3 text-left">
                <Sprout className="text-green-600 shrink-0 mt-0.5" size={20} />
                <div>
                    <p className="font-semibold text-gray-800 text-sm">
                        Grow Better, Live Better
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                        Thank you for being part of Zarkhaiz Pakistan.
                    </p>
                </div>
            </div>
        </div>
    );
}
