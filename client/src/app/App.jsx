import { Routes, Route, Navigate } from "react-router-dom";

import SignupPage from "../features/auth/pages/signup";
import VerifyOtpPage from "../features/auth/pages/verifyotp";
import LoginPage from "../features/auth/pages/LoginPage";
import HomePage from "../features/Home/pages/Homepage";
import ResetPasswordPage from "../features/auth/pages/resetpage";
import ForgotPasswordPage from "../features/auth/pages/forgetpage";
import VerifyResetOtpPage from "../features/auth/pages/verifyresetotppage";
import SellerDashboardPage from "../features/seller/pages/sellerDashboardLayout";
import SellerRegistrationPage from "../features/seller/pages/SellerRegistrationPage";
import BecomeSellerPage from "../features/sellerOnboarding/pages/BecomeSellerPage";
import Dashboard from "../features/seller/component/dashboard/dashboard";
import ProductsPage from "../features/seller/component/products/productsPages";
import AddProductPage from "../features/seller/component/products/ProductForm";
import SellerPendingApproval from "../features/seller/pages/sellerPendingApproval";
import MarketplaceProductsPage from "../features/marketplace/layouts/ProductsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<MarketplaceProductsPage />} />
      <Route path="/verify-reset-otp" element={<VerifyResetOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/become-seller" element={<BecomeSellerPage />} />
      <Route path="/seller-registration" element={<SellerRegistrationPage />} />
      <Route path="/seller/pending" element={<SellerPendingApproval />}/>

      <Route path="/seller" element={<SellerDashboardPage />}>
        <Route index element={<Navigate to="dashboard" replace />}/>
        <Route path="dashboard" element={<Dashboard/>}/>
        <Route path="products" element={<ProductsPage/>}/>
        <Route path="products/add" element={<AddProductPage />}/>
      </Route>

    </Routes>

  );
}