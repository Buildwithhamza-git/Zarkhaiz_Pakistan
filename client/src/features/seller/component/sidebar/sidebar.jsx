import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ClipboardList,
  Users,
  Star,
  Wallet,
  Banknote,
  BarChart3,
  Tag,
  MessageSquare,
  Store,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Crown,
  X,
} from "lucide-react";

import Logo from "../../../../shared/components/ui/logo";
import Button from "../../../../shared/components/ui/button";
import heroImg from "../../../../assets/images/hero/img1.png";

const menuItems = [
  { label: "Dashboard", to: "/seller/dashboard", icon: LayoutDashboard },
  { label: "Products", to: "/seller/products", icon: Package },
  { label: "Orders", to: "/seller/orders", icon: ClipboardList, badge: 8 },
  { label: "Customers", to: "/seller/customers", icon: Users },
  { label: "Reviews", to: "/seller/reviews", icon: Star },
  { label: "Earnings", to: "/seller/earnings", icon: Wallet },
  { label: "Payouts", to: "/seller/payouts", icon: Banknote },
  { label: "Analytics", to: "/seller/analytics", icon: BarChart3 },
  { label: "Coupons & Discounts", to: "/seller/coupons", icon: Tag },
  { label: "Messages", to: "/seller/messages", icon: MessageSquare, badge: 3 },
  { label: "Shop Settings", to: "/seller/settings/shop", icon: Store },
  { label: "Profile Settings", to: "/seller/settings/profile", icon: UserCog },
];

const Sidebar = ({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-30
          h-screen
          bg-white
          border-r border-gray-100
          flex flex-col
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo / Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          {!collapsed ? (
            <Logo size="sm" />
          ) : (
            <div className="mx-auto text-2xl">🌾</div>
          )}

          <button
            onClick={onCloseMobile}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map(({ label, to, icon: Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `
                group relative flex items-center gap-3 rounded-xl px-3 py-2.5
                text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-green-700 text-white shadow-sm"
                    : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={19}
                    className={isActive ? "text-white" : "text-gray-500 group-hover:text-green-700"}
                  />

                  {!collapsed && <span className="flex-1 truncate">{label}</span>}

                  {badge && !collapsed && (
                    <span
                      className={`
                        flex h-5 min-w-5 items-center justify-center rounded-full
                        px-1.5 text-[11px] font-semibold
                        ${isActive ? "bg-white text-green-700" : "bg-green-600 text-white"}
                      `}
                    >
                      {badge}
                    </span>
                  )}

                  {badge && collapsed && (
                    <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-green-600" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Become Premium Seller */}
        {!collapsed && (
          <div className="relative mx-3 mb-3 h-40 overflow-hidden rounded-2xl">
            <img
              src={heroImg}
              alt="Upgrade to premium seller"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-green-800/60 to-green-700/20" />

            <div className="relative z-10 flex h-full flex-col justify-start p-4">
              <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-green-900">
                <Crown size={15} />
              </span>

              <h4 className="text-sm font-semibold text-white">
                Become Premium Seller
              </h4>

              <p className="mt-1 text-xs text-green-50/90 leading-snug">
                Get more visibility and increase your sales
              </p>

              <Button
                type="button"
                variant="primary"
                size="sm"
                className="mt-3 w-fit !bg-white !text-green-800 hover:!bg-green-50 focus:!ring-white"
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        )}

        {/* Collapse toggle (desktop) */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center justify-center mx-3 mb-4 h-8 w-8 self-end rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;