import AuthLayout from "../../../shared/layouts/AuthLayout";
import AuthCard from "../../../shared/components/ui/AuthCard";
import VerifyResetOtpForm from "../components/verifyresetotp";

export default function VerifyResetOtpPage() {
    return (
        <AuthLayout>
            <AuthCard
                title="Verify OTP"
                subtitle="Enter the verification code sent to your email."
            >
                <VerifyResetOtpForm />
            </AuthCard>
        </AuthLayout>
    );
}