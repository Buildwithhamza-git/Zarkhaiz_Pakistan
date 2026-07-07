import { Routes, Route, Navigate } from "react-router-dom";

import SignupPage from "../features/auth/pages/signup";
import VerifyOtpPage from "../features/auth/pages/verifyotp";
import LoginPage from "../features/auth/pages/LoginPage";
import HomePage from "../features/Home/pages/Homepage";
import DashboardPage from "../features/Dashboard/pages/Dashboardpage";
import ResetPasswordPage from "../features/auth/pages/resetpage";

export default function App() {
    return (
        <Routes>

        <Route path="/" element={<HomePage/>}  />

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/signup" element={<SignupPage />}/>

        <Route path="/verify-otp" element={<VerifyOtpPage />}/>

        <Route path="/login" element={<LoginPage />}/>

        <Route path="/dashboard" element={<DashboardPage />} />

        </Routes>
    );
}