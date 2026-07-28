import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Store,
    LayoutDashboard,
    Clock3,
    RefreshCcw,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

import { useAuthContext } from "../../../../context/authContext";

const QUICK_LINKS = [
    { label: "Home", to: "/" },
    { label: "Shop Products", to: "/products" },
    { label: "Categories", to: "/products" },
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" },
];

const FOOTER_CATEGORIES = [
    { label: "Seeds", to: "/products" },
    { label: "Fertilizers", to: "/products" },
    { label: "Pesticides", to: "/products" },
    { label: "Crops", to: "/products" },
    { label: "Vegetables", to: "/products" },
    { label: "Fruits", to: "/products" },
];

const SOCIAL_LINKS = [
    {
        name: "Facebook",
        href: "https://facebook.com",
        icon: "f",
    },
    {
        name: "Instagram",
        href: "https://instagram.com",
        icon: "◎",
    },
    {
        name: "YouTube",
        href: "https://youtube.com",
        icon: "▶",
    },
    {
        name: "Twitter",
        href: "https://twitter.com",
        icon: "𝕏",
    },
];

export default function Footer() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const { user, seller } = useAuthContext();

    // ==========================================
    // SELLER STATUS
    // ==========================================

    const sellerStatus = seller?.status?.toLowerCase();

    const isApprovedSeller =
        sellerStatus === "approved";

    const isPendingSeller =
        sellerStatus === "pending";

    const isRejectedSeller =
        sellerStatus === "rejected";

    const hasSeller =
        !!seller;

    // ==========================================
    // CURRENT YEAR
    // ==========================================

    const currentYear = new Date().getFullYear();

    // ==========================================
    // NEWSLETTER
    // ==========================================

    const handleSubscribe = (e) => {
        e.preventDefault();

        if (!email.trim()) return;

        setSubscribed(true);
        setEmail("");

        setTimeout(() => {
            setSubscribed(false);
        }, 4000);
    };

    // ==========================================
    // SELLER BUTTON
    // ==========================================

    const handleSellerAction = () => {

        if (isApprovedSeller) {
            navigate("/seller/dashboard");
            return;
        }

        if (isPendingSeller) {
            navigate("/seller/application-status");
            return;
        }

        if (isRejectedSeller) {
            navigate("/become-seller");
            return;
        }

        navigate("/become-seller");
    };

    // ==========================================
    // DYNAMIC SELLER BUTTON
    // ==========================================

    const renderSellerButton = () => {

        // ======================================
        // APPROVED
        // ======================================

        if (isApprovedSeller) {
            return (
                <button
                    type="button"
                    onClick={handleSellerAction}
                    className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-lime-400
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-[#092014]
                        transition
                        hover:bg-lime-300
                        active:scale-95
                    "
                >
                    <LayoutDashboard size={17} />

                    Seller Dashboard
                </button>
            );
        }

        // ======================================
        // PENDING
        // ======================================

        if (isPendingSeller) {
            return (
                <button
                    type="button"
                    onClick={handleSellerAction}
                    className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-yellow-400/40
                        bg-yellow-400/10
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-yellow-300
                        transition
                        hover:bg-yellow-400/20
                    "
                >
                    <Clock3 size={17} />

                    Application Pending
                </button>
            );
        }

        // ======================================
        // REJECTED
        // ======================================

        if (isRejectedSeller) {
            return (
                <button
                    type="button"
                    onClick={handleSellerAction}
                    className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-red-400/40
                        bg-red-400/10
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-red-300
                        transition
                        hover:bg-red-400/20
                    "
                >
                    <RefreshCcw size={17} />

                    Reapply as Seller
                </button>
            );
        }

        // ======================================
        // NO SELLER ACCOUNT
        // ======================================

        if (!hasSeller) {
            return (
                <button
                    type="button"
                    onClick={handleSellerAction}
                    className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-lime-400/40
                        bg-lime-400/10
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-lime-300
                        transition
                        hover:bg-lime-400
                        hover:text-[#092014]
                    "
                >
                    <Store size={17} />

                    Become a Seller
                </button>
            );
        }

        return null;
    };

    // ==========================================
    // BACK TO TOP
    // ==========================================

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="relative overflow-hidden bg-[#092014] text-white">

            {/* Background decoration */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-32
                    -top-32
                    h-80
                    w-80
                    rounded-full
                    bg-green-500/10
                    blur-3xl
                "
            />

            <div
                className="
                    pointer-events-none
                    absolute
                    -bottom-40
                    -left-32
                    h-96
                    w-96
                    rounded-full
                    bg-lime-400/10
                    blur-3xl
                "
            />

            {/* ==========================================
                MAIN FOOTER
            ========================================== */}

            <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">

                {/* BRAND + NEWSLETTER */}

                <div
                    className="
                        mb-14
                        grid
                        gap-8
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/[0.04]
                        p-6
                        sm:p-8
                        lg:grid-cols-[1fr_1.2fr]
                        lg:items-center
                    "
                >

                    {/* BRAND */}

                    <div className="flex items-start gap-4">

                        <div
                            className="
                                flex
                                h-14
                                w-14
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-lime-400
                                text-3xl
                                text-[#092014]
                                shadow-lg
                            "
                        >
                            🌱
                        </div>

                        <div>

                            <div className="flex flex-wrap items-center gap-2">

                                <h2 className="text-2xl font-extrabold">
                                    Zarkhaiz
                                </h2>

                                <span
                                    className="
                                        rounded-full
                                        bg-lime-400/10
                                        px-3
                                        py-1
                                        text-xs
                                        font-bold
                                        text-lime-300
                                    "
                                >
                                    Pakistan
                                </span>

                            </div>

                            <p className="mt-1 text-sm text-gray-400">
                                Grow Together 🌾
                            </p>

                            <p
                                className="
                                    mt-3
                                    max-w-md
                                    text-sm
                                    leading-6
                                    text-gray-300
                                "
                            >
                                An AI-powered agriculture marketplace
                                connecting farmers, buyers and sellers
                                across Pakistan.
                            </p>

                        </div>

                    </div>

                    {/* NEWSLETTER */}

                    <div>

                        <p
                            className="
                                mb-2
                                text-sm
                                font-semibold
                                uppercase
                                tracking-wider
                                text-lime-300
                            "
                        >
                            Stay connected
                        </p>

                        <h3 className="text-xl font-bold">
                            Get agriculture updates in your inbox
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                            Get farming tips, marketplace updates and
                            new product announcements.
                        </p>

                        <form
                            onSubmit={handleSubscribe}
                            className="mt-4 flex flex-col gap-3 sm:flex-row"
                        >

                            <div
                                className="
                                    flex
                                    flex-1
                                    items-center
                                    rounded-xl
                                    border
                                    border-white/10
                                    bg-black/20
                                "
                            >

                                <span className="pl-4 text-lg text-lime-400">
                                    @
                                </span>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="Enter your email"
                                    required
                                    className="
                                        w-full
                                        bg-transparent
                                        px-3
                                        py-3
                                        text-sm
                                        text-white
                                        outline-none
                                        placeholder:text-gray-500
                                    "
                                />

                            </div>

                            <button
                                type="submit"
                                className="
                                    rounded-xl
                                    bg-lime-400
                                    px-6
                                    py-3
                                    text-sm
                                    font-bold
                                    text-[#092014]
                                    transition
                                    hover:bg-lime-300
                                    active:scale-95
                                "
                            >
                                Subscribe
                            </button>

                        </form>

                        {subscribed && (
                            <p className="mt-3 text-sm font-medium text-lime-300">
                                ✓ Thanks! You have been subscribed.
                            </p>
                        )}

                    </div>

                </div>

                {/* ==========================================
                    FOOTER COLUMNS
                ========================================== */}

                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

                    {/* ABOUT */}

                    <div>

                        <div className="mb-5 flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-green-700
                                    text-xl
                                "
                            >
                                🌿
                            </div>

                            <div>

                                <p className="font-bold">
                                    Zarkhaiz Pakistan
                                </p>

                                <p className="text-xs text-lime-300">
                                    Agriculture Marketplace
                                </p>

                            </div>

                        </div>

                        <p
                            className="
                                max-w-xs
                                text-sm
                                leading-6
                                text-gray-400
                            "
                        >
                            Empowering Pakistan's agriculture community
                            through technology, AI and a trusted
                            marketplace.
                        </p>

                        <div className="mt-6 space-y-3">

                            <a
                                href="mailto:support@zarkhaiz.pk"
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    text-sm
                                    text-gray-400
                                    transition
                                    hover:text-lime-300
                                "
                            >
                                <Mail
                                    size={16}
                                    className="text-lime-400"
                                />

                                support@zarkhaiz.pk
                            </a>

                            <a
                                href="tel:+923000000000"
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    text-sm
                                    text-gray-400
                                    transition
                                    hover:text-lime-300
                                "
                            >
                                <Phone
                                    size={16}
                                    className="text-lime-400"
                                />

                                +92 300 0000000
                            </a>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    text-sm
                                    text-gray-400
                                "
                            >
                                <MapPin
                                    size={16}
                                    className="text-lime-400"
                                />

                                Lahore, Pakistan
                            </div>

                        </div>

                    </div>

                    {/* EXPLORE */}

                    <div>

                        <h3
                            className="
                                mb-5
                                text-sm
                                font-bold
                                uppercase
                                tracking-wider
                            "
                        >
                            Explore
                        </h3>

                        <ul className="space-y-3">

                            {QUICK_LINKS.map((link) => (

                                <li key={link.label}>

                                    <Link
                                        to={link.to}
                                        className="
                                            group
                                            flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-gray-400
                                            transition
                                            hover:text-lime-300
                                        "
                                    >

                                        <span
                                            className="
                                                text-lime-500
                                                transition
                                                group-hover:translate-x-1
                                            "
                                        >
                                            ›
                                        </span>

                                        {link.label}

                                    </Link>

                                </li>

                            ))}

                        </ul>

                    </div>

                    {/* MARKETPLACE */}

                    <div>

                        <h3
                            className="
                                mb-5
                                text-sm
                                font-bold
                                uppercase
                                tracking-wider
                            "
                        >
                            Marketplace
                        </h3>

                        <ul className="space-y-3">

                            {FOOTER_CATEGORIES.map((category) => (

                                <li key={category.label}>

                                    <Link
                                        to={category.to}
                                        className="
                                            group
                                            flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-gray-400
                                            transition
                                            hover:text-lime-300
                                        "
                                    >

                                        <span
                                            className="
                                                text-lime-500
                                                transition
                                                group-hover:translate-x-1
                                            "
                                        >
                                            ›
                                        </span>

                                        {category.label}

                                    </Link>

                                </li>

                            ))}

                        </ul>

                    </div>

                    {/* JOIN ZARKHAIZ */}

                    <div>

                        <h3
                            className="
                                mb-5
                                text-sm
                                font-bold
                                uppercase
                                tracking-wider
                            "
                        >
                            {isApprovedSeller
                                ? "Seller Center"
                                : "Join Zarkhaiz"}
                        </h3>

                        {isApprovedSeller ? (

                            <>
                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-lime-400/20
                                        bg-lime-400/5
                                        p-4
                                    "
                                >

                                    <div className="flex items-center gap-3">

                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-lime-400
                                                text-[#092014]
                                            "
                                        >
                                            <Store size={19} />
                                        </div>

                                        <div>

                                            <p className="text-sm font-bold text-lime-300">
                                                Seller Mode
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                {seller?.storeName ||
                                                    "Your Store"}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                                {renderSellerButton()}
                            </>

                        ) : (

                            <>
                                <p
                                    className="
                                        text-sm
                                        leading-6
                                        text-gray-400
                                    "
                                >
                                    Are you a farmer, supplier or
                                    agricultural business? Start selling
                                    your products on Zarkhaiz Pakistan.
                                </p>

                                {renderSellerButton()}
                            </>

                        )}

                        {/* SOCIAL */}

                        <div className="mt-7">

                            <p
                                className="
                                    mb-3
                                    text-sm
                                    font-semibold
                                    text-gray-300
                                "
                            >
                                Follow us
                            </p>

                            <div className="flex gap-3">

                                {SOCIAL_LINKS.map((social) => (

                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.name}
                                        title={social.name}
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border
                                            border-white/10
                                            bg-white/[0.04]
                                            text-sm
                                            font-bold
                                            text-gray-300
                                            transition
                                            hover:border-lime-400
                                            hover:bg-lime-400
                                            hover:text-[#092014]
                                        "
                                    >
                                        {social.icon}
                                    </a>

                                ))}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* ==========================================
                BOTTOM BAR
            ========================================== */}

            <div className="border-t border-white/10">

                <div
                    className="
                        mx-auto
                        flex
                        max-w-7xl
                        flex-col
                        gap-4
                        px-5
                        py-5
                        sm:px-6
                        md:flex-row
                        md:items-center
                        md:justify-between
                        lg:px-8
                    "
                >

                    <p
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-500
                        "
                    >
                        <span className="text-lime-400">
                            🌱
                        </span>

                        © {currentYear} Zarkhaiz Pakistan.
                        All rights reserved.
                    </p>

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-5
                        "
                    >

                        <Link
                            to="/privacy"
                            className="
                                text-xs
                                text-gray-500
                                transition
                                hover:text-lime-300
                            "
                        >
                            Privacy Policy
                        </Link>

                        <Link
                            to="/terms"
                            className="
                                text-xs
                                text-gray-500
                                transition
                                hover:text-lime-300
                            "
                        >
                            Terms & Conditions
                        </Link>

                        <button
                            type="button"
                            onClick={scrollToTop}
                            title="Back to top"
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-white/10
                                text-gray-400
                                transition
                                hover:border-lime-400
                                hover:bg-lime-400
                                hover:text-[#092014]
                            "
                        >
                            ↑
                        </button>

                    </div>

                </div>

            </div>

        </footer>
    );
}