import React, { useState } from "react";
import {
  Menu,
  Search,
  ArrowLeftRight,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Input from "../../../../shared/components/ui/input";
import { useSellerContext } from "../../../../context/sellerContext";
import { useAuthContext } from "../../../../context/authContext";

const Topbar = ({ onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { seller, loading } = useSellerContext();
  const { logout } = useAuthContext();

  const navigate = useNavigate();

  // ==========================
  // Logout
  // ==========================

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ==========================
  // Switch to Buyer Mode
  // ==========================

  const handleSwitchToBuyer = () => {
    setDropdownOpen(false);
    navigate("/");
  };

  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6">
        <p className="text-sm text-gray-500">
          Loading dashboard...
        </p>
      </header>
    );
  }

  // ==========================
  // Current User
  // ==========================

  const currentUser = {
    name: seller?.user
      ? `${seller.user.firstname} ${seller.user.lastname}`
      : "Seller",

    email: seller?.user?.email || "",

    role: "Seller",

    avatar: seller?.user?.profilePicture
      ? `http://localhost:5000/uploads/profile/${seller.user.profilePicture}`
      : null,
  };

  // ==========================
  // Initials
  // ==========================

  const initials = currentUser.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 py-3 sm:px-6">

      {/* ========================== */}
      {/* LEFT */}
      {/* ========================== */}

      <div className="flex flex-1 items-center gap-4">

        {/* Sidebar Toggle */}

        <button
          type="button"
          onClick={onToggleSidebar}
          className="text-gray-600 transition hover:text-green-700"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Search */}

        <div className="hidden w-full max-w-sm sm:block">

          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search anything..."
            leftIcon={<Search size={16} />}
            className="!rounded-full !bg-gray-50 !py-2.5 focus:!bg-white"
          />

        </div>

      </div>

      {/* ========================== */}
      {/* RIGHT */}
      {/* ========================== */}

      <div className="flex items-center gap-3 sm:gap-5">

        {/* ========================== */}
        {/* SWITCH TO BUYER MODE */}
        {/* ========================== */}

        <button
          type="button"
          onClick={handleSwitchToBuyer}
          className="
            hidden
            sm:flex
            items-center
            gap-2
            rounded-xl
            border
            border-green-200
            bg-green-50
            px-4
            py-2
            text-sm
            font-medium
            text-green-700
            transition
            hover:bg-green-100
            hover:text-green-800
          "
        >

          <ArrowLeftRight size={17} />

          <span>
            Switch to Buyer Mode
          </span>

        </button>

        {/* Mobile Switch Button */}

        <button
          type="button"
          onClick={handleSwitchToBuyer}
          className="
            flex
            sm:hidden
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            border
            border-green-200
            bg-green-50
            text-green-700
            transition
            hover:bg-green-100
          "
          title="Switch to Buyer Mode"
          aria-label="Switch to Buyer Mode"
        >

          <ArrowLeftRight size={17} />

        </button>

        {/* ========================== */}
        {/* PROFILE */}
        {/* ========================== */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setDropdownOpen((prev) => !prev)
            }
            className="flex items-center gap-2"
          >

            {/* Avatar */}

            {currentUser.avatar ? (

              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-9 w-9 rounded-full object-cover"
              />

            ) : (

              <span className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-green-700
                text-sm
                font-semibold
                text-white
              ">
                {initials}
              </span>

            )}

            {/* User Information */}

            <div className="hidden text-left sm:block">

              <p className="text-sm font-semibold">
                {currentUser.name}
              </p>

              <p className="text-[11px] text-gray-400">
                {currentUser.email}
              </p>

            </div>

            <ChevronDown
              size={16}
              className={`transition-transform ${
                dropdownOpen
                  ? "rotate-180"
                  : ""
              }`}
            />

          </button>

          {/* ========================== */}
          {/* DROPDOWN */}
          {/* ========================== */}

          {dropdownOpen && (

            <>

              {/* Overlay */}

              <div
                className="fixed inset-0 z-10"
                onClick={() =>
                  setDropdownOpen(false)
                }
              />

              {/* Menu */}

              <div className="
                absolute
                right-0
                z-20
                mt-3
                w-56
                overflow-hidden
                rounded-xl
                border
                bg-white
                shadow-lg
              ">

                {/* Switch Buyer */}

                <button
                  type="button"
                  onClick={handleSwitchToBuyer}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    text-sm
                    text-green-700
                    hover:bg-green-50
                  "
                >

                  <ArrowLeftRight size={17} />

                  Switch to Buyer Mode

                </button>

                {/* Divider */}

                <div className="border-t" />

                {/* Profile */}

                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile");
                  }}
                  className="
                    w-full
                    px-4
                    py-3
                    text-left
                    text-sm
                    hover:bg-gray-50
                  "
                >
                  My Profile
                </button>

                {/* Shop Settings */}

                <button
                  type="button"
                  className="
                    w-full
                    px-4
                    py-3
                    text-left
                    text-sm
                    hover:bg-gray-50
                  "
                >
                  Shop Settings
                </button>

                {/* Divider */}

                <div className="border-t" />

                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    w-full
                    px-4
                    py-3
                    text-left
                    text-sm
                    text-red-600
                    hover:bg-red-50
                  "
                >
                  Logout
                </button>

              </div>

            </>

          )}

        </div>

      </div>

    </header>
  );
};

export default Topbar;