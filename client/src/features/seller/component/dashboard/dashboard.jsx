import React, { useEffect } from "react";

import { useSellerContext } from "../../../../context/sellerContext";

import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./Dashboardstats";
import SalesOverview from "./SalesOverview";
import RecentOrders from "./RecentOrders";
import StoreStatus from "./StoreStatus";

const Dashboard = () => {
  const {
    seller,
    stats,
    loading,
    refreshDashboard,
    isApproved,
  } = useSellerContext();

  useEffect(() => {
    if (isApproved) {
      refreshDashboard();
    }
  }, [isApproved]);

  if (!isApproved) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">
          You are not authorized to access this dashboard.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader seller={seller} />

      <DashboardStats stats={stats} />

      <SalesOverview />

      <RecentOrders />

      <StoreStatus />

      {/* Earnings */}

      {/* Reviews */}

      {/* Top Products */}

      {/* Quick Actions */}
    </div>
  );
};

export default Dashboard;