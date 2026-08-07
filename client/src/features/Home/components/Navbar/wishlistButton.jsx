import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useWishlistContext } from "../../../../context/wishlistContext";

export default function WishlistButton() {
    const navigate = useNavigate();

    const {
        totalItems,
        loading,
    } = useWishlistContext();

    const handleWishlistClick = () => {
        navigate("/wishlist");
    };

    return (
        <button
            type="button"
            onClick={handleWishlistClick}
            aria-label={`Wishlist with ${totalItems} items`}
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
            <Heart
                size={22}
                className="text-gray-700"
            />

            {/* Wishlist Count */}
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