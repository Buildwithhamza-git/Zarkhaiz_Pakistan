import { NavLink, useNavigate } from "react-router-dom";
import { getSellerProfile } from "../../../seller/services/sellerApi";

const links = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },

    { name: "About", path: "/about" },
];

export default function NavLinks() {

    const navigate = useNavigate();

    const handleBecomeSeller = async () => {
        try {

            const response = await getSellerProfile();

            if (!response.seller) {
                navigate("/become-seller");
                return;
            }

            switch (response.seller.status) {

                case "pending":
                    navigate("/seller/pending");
                    break;

                case "approved":
                    navigate("/seller/dashboard");
                    break;

                case "rejected":
                    navigate("/become-seller");
                    break;

                default:
                    navigate("/become-seller");
            }

        } catch (error) {
            console.error(error);
            if (error.message === "Unauthorized") {
                navigate("/login");
                return;
            }
            if (error.status === 401) {
                navigate("/login");
                return;
            }
            navigate("/become-seller");
        }
    };

    return (
        <div className="hidden lg:flex items-center gap-8">

            {links.map((link) => (
                <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                        `font-medium transition ${isActive
                            ? "text-green-700"
                            : "text-gray-700 hover:text-green-700"
                        }`
                    }
                >
                    {link.name}
                </NavLink>
            ))}

            <button
                onClick={handleBecomeSeller}
                className="font-medium text-gray-700 hover:text-green-700 transition"
            >
                Become Seller
            </button>

        </div>
    );
}