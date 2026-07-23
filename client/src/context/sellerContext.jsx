import { createContext, useContext, useEffect, useState } from "react";

import {
  getCurrentSeller,
  getSellerDashboard,
} from "../features/seller/services/sellerApi";

import { useAuthContext } from "./authContext";

const SellerContext = createContext();

export default function SellerProvider({ children }) {
  const { token } = useAuthContext();

  const [seller, setSeller] = useState(null);

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
    pendingOrders: 0,
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================
  // Seller Status
  // ==========================

  const isSeller = !!seller;

  const isApproved = seller?.status === "approved";

  const isPending = seller?.status === "pending";

  const isRejected = seller?.status === "rejected";

  // ==========================
  // Reset Context
  // ==========================
  useEffect(() => {
  console.log("Seller:", seller);
  console.log("Approved:", isApproved);
}, [seller]);

  const resetSeller = () => {
    setSeller(null);

    setStats({
      products: 0,
      orders: 0,
      customers: 0,
      revenue: 0,
      pendingOrders: 0,
    });

    setError("");
  };

  // ==========================
  // Refresh Seller
  // ==========================

  const refreshSeller = async () => {
  try {
    const response = await getCurrentSeller();

    const sellerData = response.data?.seller;

    setSeller(sellerData || null);

    return sellerData;
  } catch (err) {
    setSeller(null);
    return null;
  }
};

  // ==========================
  // Refresh Dashboard
  // ==========================
const refreshDashboard = async () => {
  try {
    const response = await getSellerDashboard();

    setStats(
      response.data?.stats || {
        products: 0,
        orders: 0,
        customers: 0,
        revenue: 0,
        pendingOrders: 0,
      }
    );
  } catch (err) {
    console.log(err);
  }
};

  // ==========================
  // Initialize
  // ==========================

  useEffect(() => {

    const initialize = async () => {

      setLoading(true);

      try {

        if (!token) {
          resetSeller();
          return;
        }

        const sellerData = await refreshSeller();

        if (sellerData?.status === "approved") {
          await refreshDashboard();
        }

      } catch (err) {

        resetSeller();

        setError(err.message || "Failed to load seller.");

      } finally {

        setLoading(false);

      }

    };

    initialize();

  }, [token]);

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
        resetSeller,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
}

export const useSellerContext = () => useContext(SellerContext);