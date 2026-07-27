import { Link } from "react-router-dom";
import { useAuthContext } from "../../../../context/authContext";

export default function HeroButtons() {
    const { user, seller } = useAuthContext();

    const sellerStatus = seller?.status?.toLowerCase();
    console.log(sellerStatus)

    const canBecomeSeller =
        !user || 
        !seller ||
        sellerStatus === "rejected";

    return (
        <div className="mt-10 flex gap-5">

            <Link
                to="/products"
                className="
                    rounded-xl
                    bg-green-700
                    px-8
                    py-4
                    text-white
                    font-semibold
                    hover:bg-green-800
                    transition
                "
            >
                Shop Now
            </Link>

            {canBecomeSeller && (
                <Link
                    to="/become-seller"
                    className="
                        rounded-xl
                        border-2
                        border-green-700
                        bg-white
                        px-8
                        py-4
                        text-green-700
                        font-semibold
                        hover:bg-green-700
                        hover:text-white
                        transition
                    "
                >
                    Become Seller
                </Link>
            )}

        </div>
    );
}