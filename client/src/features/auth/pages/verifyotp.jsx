import AuthLayout from "../../../shared/layouts/AuthLayout";
import AuthCard from "../../../shared/components/ui/AuthCard";
import VerifyOtpForm from "../components/verifyotpform";

export default function VerifyOtpPage() {
    return (
        <AuthLayout>
            <AuthCard
                title="Verify Your Email"
                subtitle="Enter the 6-digit code sent to your inbox"
            >
                <VerifyOtpForm />
            </AuthCard>
        </AuthLayout>
    );
}
