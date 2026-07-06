import Logo from "../../shared/components/ui/logo";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center px-4">

            <div className="w-full max-w-4xl">

                <div className="mb-10 mt-10 flex justify-center">
                    <Logo />
                </div>

                {children}

            </div>

        </div>
    );
}