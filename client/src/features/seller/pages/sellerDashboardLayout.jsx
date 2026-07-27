import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../component/sidebar/sidebar";
import Topbar from "../component/topbar/topbar";

const SellerDashboardPage = () => {

    const [collapsed, setCollapsed] =
        useState(false);

    const [mobileOpen, setMobileOpen] =
        useState(false);

    const handleToggleSidebar = () => {

        if (window.innerWidth >= 1024) {

            setCollapsed(
                (prev) => !prev
            );

        } else {

            setMobileOpen(
                (prev) => !prev
            );

        }

    };

    return (

        <div className="flex min-h-screen bg-gray-50">

            <Sidebar
                collapsed={collapsed}
                onToggleCollapse={() =>
                    setCollapsed(
                        (prev) => !prev
                    )
                }
                mobileOpen={mobileOpen}
                onCloseMobile={() =>
                    setMobileOpen(false)
                }
            />

            <div className="flex min-w-0 flex-1 flex-col">

                <Topbar
                    onToggleSidebar={
                        handleToggleSidebar
                    }
                />

                <main className="flex-1 p-4 sm:p-6">

                    <Outlet />

                </main>

            </div>

        </div>

    );

};

export default SellerDashboardPage;