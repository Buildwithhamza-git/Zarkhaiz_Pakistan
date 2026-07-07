import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, ChevronDown } from "lucide-react";

import useAuthContext from "../../../hooks/useAuth";
import ProfileDropdown from "./profiledropdown";

export default function DashboardHeader() {
    const { user } = useAuthContext();
    console.log(user)

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setShowDropdown(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener(
            "mousedown",
            handleClickOutside
        );
    };
}, []);

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-green-100 shadow-sm">

            <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

                {/* Logo */}

                <Link
                    to="/dashboard"
                    className="flex items-center gap-3"
                >
                    <div className="w-11 h-11 rounded-full bg-green-700 flex items-center justify-center text-white text-xl">
                        🌾
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-green-800">
                            Zarkhaiz Pakistan
                        </h1>

                        <p className="text-xs text-gray-500">
                            Agriculture Marketplace
                        </p>
                    </div>
                </Link>

                {/* Right Side */}

                <div className="relative flex items-center gap-6" ref={dropdownRef}>

                    <button
                        className="
                            w-11
                            h-11
                            rounded-full
                            bg-green-50
                            hover:bg-green-100
                            flex
                            items-center
                            justify-center
                            transition
                        "
                    >
                        <Bell size={20} />
                    </button>

                    <button
                        onClick={() =>
                            setShowDropdown(!showDropdown)
                        }
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-2
                            hover:bg-green-50
                            transition
                        "
                    >
                        <img
                            src="https://ui-avatars.com/api/?name=User&background=16a34a&color=fff"
                            alt="profile"
                            className="w-11 h-11 rounded-full border-2 border-green-600"
                        />

                        <div className="text-left">

                            <h4 className="font-semibold text-green-800">
                                {user
                                    ? `${user.firstname} ${user.lastname}`
                                    : "Guest"}
                            </h4>

                            <p className="text-xs text-gray-500">
                                {user?.role || ""}
                            </p>

                        </div>

                        <ChevronDown size={18} />

                    </button>

                    {showDropdown && (
                        <ProfileDropdown
                            onClose={() =>
                                setShowDropdown(false)
                            }
                        />
                    )}

                </div>

            </div>

        </header>
    );
}