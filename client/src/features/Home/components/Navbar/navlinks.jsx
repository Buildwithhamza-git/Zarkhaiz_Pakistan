import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentSeller } from "../../../seller/services/sellerApi";

const links = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
];

export default function NavLinks({ mobile = false, onNavigate }) {
    const navigate = useNavigate();

    const closeMobileMenu = () => {
        if (onNavigate) {
            onNavigate();
        }
    };

    const handleAboutClick = () => {
        const aboutSection = document.getElementById("about");

        if (!aboutSection) {
            return;
        }

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        aboutSection.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "start",
        });

        closeMobileMenu();
    };

    const handleBecomeSeller = async () => {
        closeMobileMenu();

        try {
            const response = await getCurrentSeller();
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

    const navClassName = mobile
        ? "flex flex-col gap-1 py-3"
        : "hidden items-center gap-8 lg:flex";

    const itemClassName = mobile
        ? "w-full rounded-lg px-4 py-3 text-left font-medium transition"
        : "font-medium transition";

    return (
        <nav className={navClassName} aria-label={mobile ? "Mobile navigation" : "Main navigation"}>
            {links.map((link) => (
                <NavLink
                    key={link.name}
                    to={link.path}
                    end={link.path === "/"}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                        `${itemClassName} ${
                            isActive
                                ? "bg-green-50 text-green-700 lg:bg-transparent"
                                : "text-gray-700 hover:bg-green-50 hover:text-green-700 lg:hover:bg-transparent"
                        }`
                    }
                >
                    {link.name}
                </NavLink>
            ))}

            <button
                type="button"
                onClick={handleAboutClick}
                className={`${itemClassName} text-gray-700 hover:bg-green-50 hover:text-green-700 lg:hover:bg-transparent`}
            >
                About
            </button>

            <button
                type="button"
                onClick={handleBecomeSeller}
                className={`${itemClassName} text-gray-700 hover:bg-green-50 hover:text-green-700 lg:hover:bg-transparent`}
            >
                Become Seller
            </button>
        </nav>
    );
}
