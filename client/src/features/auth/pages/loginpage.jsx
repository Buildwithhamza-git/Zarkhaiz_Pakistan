import AuthLayout from "../../../shared/layouts/AuthLayout";
import AuthCard from "../../../shared/components/ui/AuthCard";
import LoginForm from "../components/loginform";

export default function LoginPage() {
    return (
        <AuthLayout>
            <AuthCard
                title="Welcome Back"
                subtitle="Login to your Zarkhaiz Pakistan account"
                className="max-w-lg mx-auto"
            >
                <LoginForm />
            </AuthCard>
        </AuthLayout>
    );
}