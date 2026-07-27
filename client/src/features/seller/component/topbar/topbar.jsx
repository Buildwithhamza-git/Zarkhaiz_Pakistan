import React, { useState } from "react";
import {
  Menu,
  Search,
  CloudSun,
  Mail,
  Bell,
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

  // ✅ Logout handler
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6">
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </header>
    );
  }

  const currentUser = {
    name: seller?.user
      ? `${seller.user.firstname} ${seller.user.lastname}`
      : "Loading...",
    email: seller?.user?.email || "",
    role: "Seller",
    avatar: seller?.user?.profilePicture
      ? `http://localhost:5000/uploads/profile/${seller.user.profilePicture}`
      : null,
  };

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

      {/* LEFT */}
      <div className="flex flex-1 items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-600 hover:text-green-700"
        >
          <Menu size={22} />
        </button>

        <div className="hidden sm:block w-full max-w-sm">
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

      {/* RIGHT */}
      <div className="flex items-center gap-3 sm:gap-5">

        {/* Weather */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-1.5">
          <CloudSun size={20} className="text-yellow-500" />
          <div>
            <p className="text-sm font-semibold text-gray-700">
              28°C <span className="text-gray-400">Sunny</span>
            </p>
            <p className="text-[11px] text-gray-400">
              {seller?.city || "Pakistan"}
            </p>
          </div>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2"
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt=""
                className="h-9 w-9 rounded-full"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-white">
                {initials}
              </span>
            )}

            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold">{currentUser.name}</p>
              <p className="text-[11px] text-gray-400">
                {currentUser.email}
              </p>
            </div>

            <ChevronDown size={16} />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0"
                onClick={() => setDropdownOpen(false)}
              />

              <div className="absolute right-0 mt-3 w-48 rounded-xl border bg-white shadow-lg">
                <button className="w-full px-4 py-3 text-left hover:bg-gray-50">
                  My Profile
                </button>

                <button className="w-full px-4 py-3 text-left hover:bg-gray-50">
                  Shop Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50"
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