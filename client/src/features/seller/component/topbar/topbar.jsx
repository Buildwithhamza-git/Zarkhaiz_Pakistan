import React, { useState } from "react";
import { Menu, Search, CloudSun, Mail, Bell, ChevronDown } from "lucide-react";

import Input from "../../../../shared/components/ui/input";

const Topbar = ({ onToggleSidebar, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

  const currentUser = user || {
    name: "Fazal Rehman",
    role: "Seller",
    avatar: null,
  };

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 py-3 sm:px-6">
      {/* Left: toggle + search */}
      <div className="flex flex-1 items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-600 hover:text-green-700 transition-colors"
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

      {/* Right: weather, icons, profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Weather */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-1.5">
          <CloudSun size={20} className="text-yellow-500" />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-700">
              28°C <span className="font-normal text-gray-400">Sunny</span>
            </p>
            <p className="text-[11px] text-gray-400">Lahore, Punjab</p>
          </div>
        </div>

        {/* Messages */}
        <button className="relative text-gray-500 hover:text-green-700 transition-colors">
          <Mail size={20} />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-semibold text-white">
            3
          </span>
        </button>

        {/* Notifications */}
        <button className="relative text-gray-500 hover:text-green-700 transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
            12
          </span>
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2"
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-sm font-semibold text-white">
                {initials}
              </span>
            )}

            <div className="hidden sm:block text-left leading-tight">
              <p className="text-sm font-semibold text-gray-800">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-gray-400">{currentUser.role}</p>
            </div>

            <ChevronDown
              size={16}
              className={`hidden sm:block text-gray-400 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-3 w-44 rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
                <button className="block w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50">
                  My Profile
                </button>
                <button className="block w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50">
                  Shop Settings
                </button>
                <button className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50">
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