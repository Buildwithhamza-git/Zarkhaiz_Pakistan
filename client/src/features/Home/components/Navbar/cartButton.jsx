import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCartContext } from "../../../../context/cartContext";

export default function CartButton() {
    const navigate = useNavigate();

    const {
        totalItems,
        loading,
    } = useCartContext();

    const handleCartClick = () => {
        navigate("/cart");
    };

    return (
        <button
            type="button"
            onClick={handleCartClick}
            aria-label={`Shopping cart with ${totalItems} items`}
            className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                transition
                hover:bg-green-50
            "
        >
            <ShoppingCart
                size={23}
                className="text-gray-700"
            />

            {/* Cart Count */}
            {!loading && totalItems > 0 && (
                <span
                    className="
                        absolute
                        -right-1
                        -top-1
                        flex
                        h-5
                        min-w-5
                        items-center
                        justify-center
                        rounded-full
                        bg-red-500
                        px-1
                        text-[11px]
                        font-semibold
                        text-white
                    "
                >
                    {totalItems > 99 ? "99+" : totalItems}
                </span>
            )}
        </button>
    );
}