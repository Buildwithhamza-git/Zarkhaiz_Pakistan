import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../../context/authContext";
import { useSellerContext } from "../../../../context/sellerContext";

const links = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
];

export default function NavLinks({ mobile = false, onNavigate }) {
  const navigate = useNavigate();

  const { user } = useAuthContext();
  const { seller, isApproved, isPending, isRejected } = useSellerContext();

  const closeMobileMenu = () => {
    if (onNavigate) onNavigate();
  };

  // ✅ About scroll (Asfand feature)
  const handleAboutClick = () => {
    const aboutSection = document.getElementById("about");

    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }

    closeMobileMenu();
  };

  // ✅ Seller logic (YOUR feature - better)
  const handleSellerAction = () => {
    closeMobileMenu();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!seller) {
      navigate("/become-seller");
      return;
    }

    if (isPending) {
      navigate("/seller/pending");
      return;
    }

    if (isApproved) {
      navigate("/seller/dashboard");
      return;
    }

    if (isRejected) {
      navigate("/become-seller");
      return;
    }
  };

  const sellerButtonText = () => {
    if (!user) return "Become Seller";
    if (!seller) return "Become Seller";
    if (isPending) return "Application Pending";
    if (isApproved) return "Seller Dashboard";
    if (isRejected) return "Reapply";

    return "Become Seller";
  };

  // UI classes (Asfand responsive feature)
  const navClassName = mobile
    ? "flex flex-col gap-1 py-3"
    : "hidden items-center gap-8 lg:flex";

  const itemClassName = mobile
    ? "w-full rounded-lg px-4 py-3 text-left font-medium transition"
    : "font-medium transition";

  return (
    <nav className={navClassName}>
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          end={link.path === "/"}
          onClick={closeMobileMenu}
          className={({ isActive }) =>
            `${itemClassName} ${
              isActive
                ? "text-green-700 bg-green-50 lg:bg-transparent"
                : "text-gray-700 hover:text-green-700 hover:bg-green-50 lg:hover:bg-transparent"
            }`
          }
        >
          {link.name}
        </NavLink>
      ))}

      {/* About */}
      <button
        onClick={handleAboutClick}
        className={`${itemClassName} text-gray-700 hover:text-green-700`}
      >
        About
      </button>

      {/* Seller Button */}
      <button
        onClick={handleSellerAction}
        className={`${itemClassName} ${
          isApproved
            ? "text-green-700"
            : isPending
            ? "text-yellow-600"
            : isRejected
            ? "text-red-600"
            : "text-gray-700 hover:text-green-700"
        }`}
      >
        {sellerButtonText()}
      </button>
    </nav>
  );
}