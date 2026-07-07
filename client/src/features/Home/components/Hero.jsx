import { useNavigate } from "react-router-dom";
import useAuthContext from "../../../hooks/useAuth";

import Button from "../../../shared/components/ui/Button";

export default function Hero() {
    const navigate = useNavigate();

    const { user } = useAuthContext();

    return (
        <section className="flex items-center justify-center px-6 py-24">

            <div className="max-w-5xl text-center">

                <h1 className="text-5xl md:text-6xl font-extrabold text-green-800 leading-tight">
                    Welcome to
                    <span className="block text-yellow-600">
                        Zarkhaiz Pakistan
                    </span>
                </h1>

                <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-8">
                    Pakistan's digital agriculture marketplace where
                    farmers and sellers connect, trade, and grow
                    together.
                </p>

                {user ? (
                    <>
                        <h2 className="mt-10 text-3xl font-bold text-green-700">
                            Welcome Back,
                        </h2>

                        <p className="mt-2 text-2xl font-semibold text-gray-700">
                            {user.firstname} {user.lastname} 👋
                        </p>

                        <Button
                            className="mt-8 px-10"
                            onClick={() => navigate("/dashboard")}
                        >
                            Go to Dashboard
                        </Button>
                    </>
                ) : (
                    <div className="mt-10 flex justify-center gap-5">

                        <Button
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => navigate("/signup")}
                        >
                            Create Account
                        </Button>

                    </div>
                )}

            </div>

        </section>
    );
}