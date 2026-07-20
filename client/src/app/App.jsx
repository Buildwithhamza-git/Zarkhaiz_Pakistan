import { Route, Routes } from "react-router-dom";

import HomePage from "../features/Home/pages/Homepage";
import ForgotPasswordPage from "../features/auth/pages/forgetpage";
import LoginPage from "../features/auth/pages/loginpage";
import ResetPasswordPage from "../features/auth/pages/resetpage";
import SignupPage from "../features/auth/pages/signup";
import VerifyOtpPage from "../features/auth/pages/verifyotp";
import VerifyResetOtpPage from "../features/auth/pages/verifyresetotppage";
import SellerDashboardPage from "../features/seller/pages/sellerDashboard";
import SellerRegistrationPage from "../features/seller/pages/SellerRegistrationPage";
import BecomeSellerPage from "../features/sellerOnboarding/pages/BecomeSellerPage";
import SellerPendingApproval from "../features/seller/pages/sellerPendingApproval";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-reset-otp" element={<VerifyResetOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/become-seller" element={<BecomeSellerPage />} />
      <Route path="/seller-registration" element={<SellerRegistrationPage />} />
      <Route path="/seller" element={<SellerDashboardPage />} />
      <Route path="/seller/pending" element={<SellerPendingApproval />}/>
    </Routes>

  );
}
