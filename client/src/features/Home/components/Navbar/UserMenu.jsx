import { useState, useEffect, useRef } from "react";
import {
    ChevronDown,
    User,
    LogOut,
    Package,
    Settings,
    Store,
    Clock3,
    LayoutDashboard,
    RefreshCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../../../context/authContext";

export default function UserMenu() {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const [open, setOpen] = useState(false);

    const {
        user,
        seller,
        logout,
    } = useAuthContext();

    // ==========================================
    // Seller Status
    // ==========================================

    const sellerStatus =
        seller?.status?.toLowerCase();

    const isApprovedSeller =
        sellerStatus === "approved";

    const isPendingSeller =
        sellerStatus === "pending";

    const isRejectedSeller =
        sellerStatus === "rejected";

    // ==========================================
    // Close dropdown when clicking outside
    // ==========================================

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    // ==========================================
    // Navigation helper
    // ==========================================

    const goTo = (path) => {
        setOpen(false);
        navigate(path);
    };

    // ==========================================
    // Logout
    // ==========================================

    const handleLogout = () => {
        setOpen(false);
        logout();
        navigate("/");
    };

    // ==========================================
    // Not Logged In
    // ==========================================

    if (!user) {
        return (
            <div className="flex items-center gap-3">

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="
                        rounded-full
                        border
                        border-green-700
                        px-5
                        py-2
                        font-medium
                        text-green-700
                        transition
                        hover:bg-green-50
                    "
                >
                    Login
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="
                        rounded-full
                        bg-green-700
                        px-5
                        py-2
                        font-medium
                        text-white
                        transition
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

            {/* ==================================
                User Button
            ================================== */}

            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="
                    flex
                    items-center
                    gap-3
                    rounded-full
                    px-2
                    py-1
                    transition
                    hover:bg-green-50
                "
            >

                {/* Avatar */}

                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-green-700
                        font-semibold
                        text-white
                    "
                >
                    {user.firstname
                        ?.charAt(0)
                        ?.toUpperCase()}
                </div>

                {/* User Information */}

                <div className="text-left">

                    <p className="text-sm font-semibold text-gray-900">
                        {user.firstname}
                    </p>

                    <p className="text-xs text-gray-500">
                        {user.email}
                    </p>

                </div>

                <ChevronDown
                    size={18}
                    className={`
                        transition-transform
                        ${open ? "rotate-180" : ""}
                    `}
                />

            </button>

            {/* ==================================
                Dropdown
            ================================== */}

            {open && (
                <div
                    className="
                        absolute
                        right-0
                        z-50
                        mt-3
                        w-72
                        overflow-hidden
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        shadow-2xl
                    "
                >

                    {/* ==================================
                        User Header
                    ================================== */}

                    <div className="border-b bg-gray-50 px-5 py-4">

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            My Account
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">
                            {user.firstname} {user.lastname}
                        </p>

                        <p className="text-xs text-gray-500">
                            {user.email}
                        </p>

                    </div>

                    {/* ==================================
                        Buyer Section
                    ================================== */}

                    <div className="py-2">

                        <button
                            type="button"
                            onClick={() =>
                                goTo("/profile")
                            }
                            className="
                                flex
                                w-full
                                items-center
                                gap-3
                                px-5
                                py-3
                                text-left
                                text-sm
                                text-gray-700
                                transition
                                hover:bg-green-50
                                hover:text-green-700
                            "
                        >
                            <User size={18} />
                            My Profile
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                goTo("/orders")
                            }
                            className="
                                flex
                                w-full
                                items-center
                                gap-3
                                px-5
                                py-3
                                text-left
                                text-sm
                                text-gray-700
                                transition
                                hover:bg-green-50
                                hover:text-green-700
                            "
                        >
                            <Package size={18} />
                            My Orders
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                goTo("/settings")
                            }
                            className="
                                flex
                                w-full
                                items-center
                                gap-3
                                px-5
                                py-3
                                text-left
                                text-sm
                                text-gray-700
                                transition
                                hover:bg-green-50
                                hover:text-green-700
                            "
                        >
                            <Settings size={18} />
                            Settings
                        </button>

                    </div>

                    <div className="border-t border-gray-100" />

                    {/* ==================================
                        SELLER SECTION
                    ================================== */}

                    <div className="p-3">

                        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Seller
                        </p>

                        {/* ==================================
                            APPROVED SELLER
                        ================================== */}

                        {isApprovedSeller && (
                            <>
                                <div
                                    className="
                                        mb-2
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        bg-green-50
                                        px-4
                                        py-3
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-green-700
                                            text-white
                                        "
                                    >
                                        <Store size={18} />
                                    </div>

                                    <div className="min-w-0">

                                        <p className="text-sm font-semibold text-green-800">
                                            Seller Mode
                                        </p>

                                        <p className="truncate text-xs text-green-600">
                                            {seller?.storeName ||
                                                "Your Store"}
                                        </p>

                                    </div>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        goTo(
                                            "/seller/dashboard"
                                        )
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        gap-3
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-left
                                        text-sm
                                        font-medium
                                        text-gray-700
                                        transition
                                        hover:bg-green-50
                                        hover:text-green-700
                                    "
                                >
                                    <LayoutDashboard size={18} />

                                    Seller Dashboard
                                </button>
                            </>
                        )}

                        {/* ==================================
                            PENDING SELLER
                        ================================== */}

                        {isPendingSeller && (
                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-yellow-200
                                    bg-yellow-50
                                    p-4
                                "
                            >

                                <div className="flex items-start gap-3">

                                    <Clock3
                                        size={19}
                                        className="mt-0.5 shrink-0 text-yellow-600"
                                    />

                                    <div>

                                        <p className="text-sm font-semibold text-yellow-800">
                                            Application Pending
                                        </p>

                                        <p className="mt-1 text-xs leading-relaxed text-yellow-700">
                                            Your seller application
                                            is currently waiting
                                            for approval.
                                        </p>

                                    </div>

                                </div>

                            </div>
                        )}

                        {/* ==================================
                            REJECTED SELLER
                        ================================== */}

                        {isRejectedSeller && (
                            <button
                                type="button"
                                onClick={() =>
                                    goTo("/become-seller")
                                }
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-xl
                                    bg-red-50
                                    px-4
                                    py-3
                                    text-left
                                    text-sm
                                    font-medium
                                    text-red-700
                                    transition
                                    hover:bg-red-100
                                "
                            >
                                <RefreshCcw size={18} />

                                Reapply as Seller
                            </button>
                        )}

                        {/* ==================================
                            NO SELLER ACCOUNT
                        ================================== */}

                        {!seller && (
                            <button
                                type="button"
                                onClick={() =>
                                    goTo("/become-seller")
                                }
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-4
                                    py-3
                                    text-left
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    transition
                                    hover:bg-green-50
                                    hover:text-green-700
                                "
                            >
                                <Store size={18} />

                                Become Seller
                            </button>
                        )}

                    </div>

                    {/* ==================================
                        Logout
                    ================================== */}

                    <div className="border-t border-gray-100 p-3">

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-xl
                                px-4
                                py-3
                                text-left
                                text-sm
                                font-medium
                                text-red-600
                                transition
                                hover:bg-red-50
                            "
                        >
                            <LogOut size={18} />

                            Logout
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}