import AuthLayout from "../../../shared/layouts/AuthLayout";
import AuthCard from "../../../shared/components/ui/AuthCard";
import ForgotPasswordForm from "../components/forgetform";

export default function ForgotPasswordPage() {
    return (
        <AuthLayout>
            <AuthCard
                title="Forgot Password"
                subtitle="Enter your email to receive an OTP"
                className="max-w-lg mx-auto"
            >
                <ForgotPasswordForm />
            </AuthCard>
            </AuthLayout>
    );
}