import AuthLayout from "../../../shared/layouts/AuthLayout";
import AuthCard from "../../../shared/components/ui/AuthCard";
import RegisterForm from "../components/RegisterForm";

export default function SignupPage() {
    return (
        <AuthLayout>
            <AuthCard
                title="Create Account"
                subtitle="Join Zarkhaiz Pakistan"
            >
                <RegisterForm />
            </AuthCard>
        </AuthLayout>
    );
}