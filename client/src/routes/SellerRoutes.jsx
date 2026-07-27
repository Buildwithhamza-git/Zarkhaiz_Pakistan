import { Navigate, Outlet } from "react-router-dom";
import { useSellerContext } from "../context/sellerContext";

export default function SellerRoute() {
  const { seller, loading } = useSellerContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  // ❌ Not a seller
  if (!seller) {
    return <Navigate to="/become-seller" replace />;
  }

  // ⏳ Pending
  if (seller.status === "pending") {
    return <Navigate to="/seller/pending" replace />;
  }

  // ❌ Rejected
  if (seller.status === "rejected") {
    return <Navigate to="/seller-registration" replace />;
  }

  // ✅ Approved
  return <Outlet />;
}