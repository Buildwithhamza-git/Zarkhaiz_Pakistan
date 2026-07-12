import { useState, useEffect, useRef } from "react";
import { ChevronDown, User, LogOut, Package, Settings, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../../context/AuthContext";

export default function UserMenu() {


    const navigate = useNavigate();

    const dropdownRef = useRef(null);

    const [open, setOpen] = useState(false);

const { user, logout } = useAuthContext();

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

    }, []);

    const handleLogout = () => {

          logout();

        navigate("/");
    };

    if (!user) {

        return (

            <div className="flex items-center gap-3">

                <button
                    onClick={() => navigate("/login")}
                    className="
                        px-5
                        py-2
                        rounded-full
                        border
                        border-green-700
                        text-green-700
                        font-medium
                        hover:bg-green-50
                    "
                >
                    Login
                </button>

                <button
                    onClick={() => navigate("/signup")}
                    className="
                        px-5
                        py-2
                        rounded-full
                        bg-green-700
                        text-white
                        font-medium
                        hover:bg-green-800
                    "
                >
                    Sign Up
                </button>

            </div>

        );

    }

    return (

        <div
            ref={dropdownRef}
            className="relative"
        >

            <button
                onClick={() => setOpen(!open)}
                className="
                    flex
                    items-center
                    gap-3
                    rounded-full
                    px-2
                    py-1
                    hover:bg-green-50
                "
            >

                <div
                    className="
                        w-10
                        h-10
                        rounded-full
                        bg-green-700
                        text-white
                        flex
                        items-center
                        justify-center
                        font-semibold
                    "
                >
                    {user.firstname?.charAt(0)}
                </div>

                <div className="text-left">

                    <p className="text-sm font-semibold">
                        {user.firstname}
                    </p>

                    <p className="text-xs text-gray-500">
                        {user.email}
                    </p>

                </div>

                <ChevronDown size={18} />

            </button>

            {open && (

                <div
                    className="
                        absolute
                        right-0
                        mt-3
                        w-64
                        bg-white
                        rounded-xl
                        shadow-xl
                        border
                        py-3
                        z-50
                    "
                >

                    <button
                        onClick={() => navigate("/profile")}
                        className="flex items-center gap-3 w-full px-5 py-3 hover:bg-green-50"
                    >
                        <User size={18} />
                        My Profile
                    </button>

                    <button
                        onClick={() => navigate("/orders")}
                        className="flex items-center gap-3 w-full px-5 py-3 hover:bg-green-50"
                    >
                        <Package size={18} />
                        My Orders
                    </button>

                    <button
                        onClick={() => navigate("/become-seller")}
                        className="flex items-center gap-3 w-full px-5 py-3 hover:bg-green-50"
                    >
                        <Store size={18} />
                        Become Seller
                    </button>

                    <button
                        onClick={() => navigate("/settings")}
                        className="flex items-center gap-3 w-full px-5 py-3 hover:bg-green-50"
                    >
                        <Settings size={18} />
                        Settings
                    </button>

                    <hr className="my-2" />

                    <button
                        onClick={handleLogout}
                        className="
                            flex
                            items-center
                            gap-3
                            w-full
                            px-5
                            py-3
                            text-red-600
                            hover:bg-red-50
                        "
                    >
                        <LogOut size={18} />
                        Logout
                    </button>

                </div>

            )}

        </div>

    );

}