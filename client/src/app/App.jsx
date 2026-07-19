import { Routes, Route, Navigate } from "react-router-dom";

import SignupPage from "../features/auth/pages/signup";
import VerifyOtpPage from "../features/auth/pages/verifyotp";
import LoginPage from "../features/auth/pages/LoginPage";
import HomePage from "../features/Home/pages/Homepage";
import ResetPasswordPage from "../features/auth/pages/resetpage";
import ForgotPasswordPage from "../features/auth/pages/forgetpage";
import VerifyResetOtpPage from "../features/auth/pages/verifyresetotppage";
import BecomeSellerPage from "../features/seller/pages/becomesellerpage";
import SellerDashboardPage from "../features/seller/pages/sellerDashboard";
import Dashboard from "../features/seller/component/dashboard/dashboard";
import ProductsPage from "../features/seller/pages/productsPages";
import { ProductsProvider } from "../context/productsContext";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/verify-reset-otp" element={<VerifyResetOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/become-seller" element={<BecomeSellerPage />} />

      {/* Seller layout (Sidebar + Topbar persist, inner page changes) */}
      <Route
        path="/seller"
        element={
          <ProductsProvider>
            <SellerDashboardPage />
          </ProductsProvider>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductsPage />} />
      </Route>
    </Routes>
  );
}