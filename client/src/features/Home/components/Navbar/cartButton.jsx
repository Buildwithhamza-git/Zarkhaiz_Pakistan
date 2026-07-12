import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartButton() {
    const navigate = useNavigate();

    // Later this will come from Redux/Context/API
    const cartCount = 3;

    return (
        <button
            onClick={() => navigate("/cart")}
            className="
                relative
                flex
                items-center
                justify-center
                w-11
                h-11
                rounded-full
                hover:bg-green-50
                transition
            "
        >
            <ShoppingCart
                size={23}
                className="text-gray-700"
            />

            {cartCount > 0 && (
                <span
                    className="
                        absolute
                        -top-1
                        -right-1
                        w-5
                        h-5
                        rounded-full
                        bg-red-500
                        text-white
                        text-[11px]
                        font-semibold
                        flex
                        items-center
                        justify-center
                    "
                >
                    {cartCount}
                </span>
            )}
        </button>
    );
}