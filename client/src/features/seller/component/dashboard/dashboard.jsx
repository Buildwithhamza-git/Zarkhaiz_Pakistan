import React from "react";
import { useSellerContext } from "../../../../context/sellerContext";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./Dashboardstats";
import SalesOverview from "./SalesOverview";
import RecentOrders from "./RecentOrders";
import StoreStatus from "./StoreStatus";

const Dashboard = () => {
  const { seller, stats, loading } = useSellerContext();

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
      
    
      <SalesOverview  />
    
      <RecentOrders  />

      <StoreStatus/>

      {/* Store Status */}

      {/* Earnings */}

      {/* Reviews */}

      {/* Top Products */}

      {/* Quick Actions */}
    </div>
  );
};

export default Dashboard;