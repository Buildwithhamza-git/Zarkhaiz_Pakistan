import { User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuthContext from "../../../hooks/useAuth";

export default function ProfileDropdown({ closeDropdown }) {
    const navigate = useNavigate();

    const { logout } = useAuthContext();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div
            className="
                absolute
                right-0
                mt-3
                w-64
                rounded-2xl
                bg-white
                shadow-2xl
                border
                border-green-100
                overflow-hidden
                z-50
            "
        >
            <div className="px-5 py-4 bg-green-50 border-b border-green-100">
                <h3 className="font-bold text-green-800">
                    My Account
                </h3>
            </div>

            <button
                onClick={() => {
                    closeDropdown();
                    navigate("/profile");
                }}
                className="
                    flex
                    items-center
                    gap-3
                    w-full
                    px-5
                    py-4
                    hover:bg-green-50
                    transition
                "
            >
                <User size={20} />
                <span>Profile</span>
            </button>

            <button
                onClick={() => {
                    closeDropdown();
                    navigate("/settings");
                }}
                className="
                    flex
                    items-center
                    gap-3
                    w-full
                    px-5
                    py-4
                    hover:bg-green-50
                    transition
                "
            >
                <Settings size={20} />
                <span>Settings</span>
            </button>

            <button
                onClick={handleLogout}
                className="
                    flex
                    items-center
                    gap-3
                    w-full
                    px-5
                    py-4
                    text-red-600
                    hover:bg-red-50
                    transition
                "
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
    );
}