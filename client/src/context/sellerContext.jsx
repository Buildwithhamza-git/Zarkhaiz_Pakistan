import { createContext, useContext, useEffect, useState } from "react";

import {
  getCurrentSeller,
  getSellerDashboard,
} from "../features/seller/services/sellerApi";

const SellerContext = createContext();

export default function SellerProvider({ children }) {
  const [seller, setSeller] = useState(null);

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Seller Status
  const isSeller = !!seller;
  const isApproved = seller?.status === "approved";
  const isPending = seller?.status === "pending";
  const isRejected = seller?.status === "rejected";

  // Load Seller Information
  const refreshSeller = async () => {
    try {
      const response = await getCurrentSeller();
      console.log("SELLER RESPONSE:", response);

      if (response.data) {
        setSeller(response.data.seller);
      } else {
        setSeller(null);
      }
    } catch (err) {
      setSeller(null);
      setError(err.message || "Failed to load seller.");
    }
  };

  // Load Dashboard (Approved sellers only)
  const refreshDashboard = async () => {
    try {
      const response = await getSellerDashboard();

      setStats(response.data.stats || {});
    } catch (err) {
      setError(err.message || "Failed to load dashboard.");
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        await refreshSeller();
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <SellerContext.Provider
      value={{
        seller,
        stats,
        loading,
        error,

        isSeller,
        isApproved,
        isPending,
        isRejected,

        refreshSeller,
        refreshDashboard,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
}

export const useSellerContext = () => useContext(SellerContext);