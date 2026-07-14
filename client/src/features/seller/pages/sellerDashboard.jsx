import React, { useState } from "react";

import Sidebar from "../component/sidebar/sidebar";
import Topbar from "../component/topbar/topbar";
import Dashboard from "../component/dashboard/dashboard";

const SellerDashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    // On large screens toggle collapse, on mobile toggle drawer
    if (window.innerWidth >= 1024) {
      setCollapsed((prev) => !prev);
    } else {
      setMobileOpen((prev) => !prev);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onToggleSidebar={handleToggleSidebar} />

        <main className="flex-1 p-4 sm:p-6">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default SellerDashboardPage;