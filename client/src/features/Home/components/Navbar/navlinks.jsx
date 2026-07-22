import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentSeller } from "../../../seller/services/sellerApi";

const links = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },

    { name: "About", path: "/about" },
];

export default function NavLinks() {

    const navigate = useNavigate();

 const handleBecomeSeller = async () => {
    try {
        const response = await getCurrentSeller();

        console.log("SELLER RESPONSE:", response);

        const seller = response?.data?.seller;

        if (!seller) {
            navigate("/become-seller");
            return;
        }

        const status = seller.status;

        if (status === "pending") {
            navigate("/seller/pending");
        } else if (status === "approved") {
            navigate("/seller/dashboard");
        } else if (status === "rejected") {
            navigate("/become-seller");
        } else {
            navigate("/become-seller");
        }

    } catch (error) {
        console.error(error);

        if (error.message === "Unauthorized" || error.status === 401) {
            navigate("/login");
            return;
        }

        if (error.status === 404) {
            navigate("/become-seller");
            return;
        }

        navigate("/seller/pending");
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