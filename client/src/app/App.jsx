import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Home
import HomePage from "../features/Home/pages/Homepage";

// Auth
import SignupPage from "../features/auth/pages/signup";
import LoginPage from "../features/auth/pages/LoginPage";
import VerifyOtpPage from "../features/auth/pages/verifyotp";
import ForgotPasswordPage from "../features/auth/pages/forgetpage";
import VerifyResetOtpPage from "../features/auth/pages/verifyresetotppage";
import ResetPasswordPage from "../features/auth/pages/resetpage";

// Seller onboarding
import BecomeSellerPage from "../features/sellerOnboarding/pages/BecomeSellerPage";
import SellerRegistrationPage from "../features/seller/pages/SellerRegistrationPage";
import SellerPendingApproval from "../features/seller/pages/sellerPendingApproval";

// Seller dashboard
import SellerDashboardPage from "../features/seller/pages/sellerDashboardLayout";
import Dashboard from "../features/seller/component/dashboard/dashboard";
import ProductsPage from "../features/seller/component/products/productsPages";
import AddProductPage from "../features/seller/component/products/ProductForm";
import ProfilePage from "../features/profile/pages/ProfilePage";

// Marketplace
import ProductsPages from "../features/marketplace/pages/productspage";

// Routes
import ProtectedRoute from "../routes/Protectedroutes";
import SellerRoute from "../routes/SellerRoutes";

import CartPage from "../features/cart/component/CartPage";

export default function App() {
  return (
    <>
      {/* ===================== */}
      {/* Global Toast Container */}
      {/* ===================== */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
            padding: "12px 16px",
          },
          success: {
            iconTheme: {
              primary: "#16a34a",
              secondary: "#fff",
            },
            style: {
              background: "#f0fdf4",
              color: "#15803d",
              border: "1px solid #bbf7d0",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#fff",
            },
            style: {
              background: "#fef2f2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
            },
          },
        }}
      />

      <Routes>
        {/* ===================== */}
        {/* Public Routes         */}
        {/* ===================== */}

        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPages />} />
        <Route path="/products/product/:id" element={<ProductsPages />} />
        <Route path="/products/:id" element={<ProductsPages />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* ===================== */}
        {/* Logged In Routes       */}
        {/* ===================== */}

        <Route element={<ProtectedRoute />}>
          <Route path="/become-seller" element={<BecomeSellerPage />} />
          <Route path="/seller-registration" element={<SellerRegistrationPage />} />
          <Route path="/seller/pending" element={<SellerPendingApproval />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        {/* ===================== */}
        {/* Seller Routes          */}
        {/* ===================== */}

        <Route element={<SellerRoute />}>
          <Route path="/seller" element={<SellerDashboardPage />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/add" element={<AddProductPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}