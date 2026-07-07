import AuthLayout from "../../../shared/layouts/AuthLayout";
import AuthCard from "../../../shared/components/ui/AuthCard";

import ResetPasswordForm from "../components/resetform";

export default function ResetPasswordPage() {
    return (
        <AuthLayout>
            <AuthCard
                title="Reset Password"
                subtitle="Create your new password"
                className="max-w-lg mx-auto"
            >
                <ResetPasswordForm />
            </AuthCard>
        </AuthLayout>
    );
}