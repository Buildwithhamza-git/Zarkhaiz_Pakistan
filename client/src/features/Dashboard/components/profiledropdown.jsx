import { User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuthContext from "../../../hooks/useAuth";

export default function ProfileDropdown({ onClose }) {
    const navigate = useNavigate();

    const { logout } = useAuthContext();

    const handleLogout = () => {
    logout();

    onClose();

    navigate("/");
};

    return (
        <div
            className="
                absolute
                right-0
                top-16
                w-64
                bg-white
                rounded-2xl
                border
                border-green-100
                shadow-xl
                overflow-hidden
                z-50
            "
        >
            <div className="px-5 py-4 bg-green-50 border-b border-green-100">
                <h3 className="font-semibold text-green-800">
                    My Account
                </h3>
            </div>

            <button
                onClick={() => {
                    onClose();
                    navigate("/profile");
                }}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-green-50 transition"
            >
                <User size={20} />
                Profile
            </button>

            <button
                onClick={() => {
                    onClose();
                    navigate("/settings");
                }}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-green-50 transition"
            >
                <Settings size={20} />
                Settings
            </button>

            <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-4 text-red-600 hover:bg-red-50 transition"
            >
                <LogOut size={20} />
                Logout
            </button>
        </div>
    );
}