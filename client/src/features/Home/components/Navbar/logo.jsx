import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";

export default function Logo() {
    return (
        <Link
            to="/"
            className="flex items-center gap-3 cursor-pointer"
        >
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Sprout
                    size={28}
                    className="text-green-700"
                />
            </div>

            <div>
                <h1 className="text-2xl font-bold text-green-800">
                    Zarkhaiz
                </h1>

                <h2 className="text-xs font-bold text-yellow-600">
                    Pakistan
                </h2>

                <p className="text-xs text-gray-500">
                    • Grow Together
                </p>
            </div>
        </Link>
    );
}