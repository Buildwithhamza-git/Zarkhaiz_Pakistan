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
    closeMobileMenu();

    // If already on home → scroll directly
    if (window.location.pathname === "/") {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to home with hash
      navigate("/#about");
    }
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

    if (isRejected) {
      navigate("/become-seller");
      return;
    }
  };

  const sellerButtonText = () => {
    if (!user) return "Become Seller";
    if (!seller) return "Become Seller";
    if (isPending) return "Application Pending";
    if (isRejected) return "Reapply";

    return "Seller Dashboard";
  };

  // ==========================================
  // MODERN STYLING
  // ==========================================

  const navClassName = mobile
    ? "flex flex-col gap-1 px-2 py-3"
    : "hidden items-center gap-1 lg:flex";

  const itemClassName = mobile
    ? "w-full rounded-xl px-4 py-2.5 text-left font-medium transition"
    : "rounded-full px-4 py-2 text-sm font-medium transition";

  const activeClassName = mobile
    ? "bg-green-700 text-white shadow-sm shadow-green-700/20"
    : "bg-green-700 text-white shadow-sm shadow-green-700/25";

  const inactiveClassName = mobile
    ? "text-gray-600 hover:bg-green-50 hover:text-green-700"
    : "text-gray-600 hover:bg-green-50 hover:text-green-700";

  const statusClassName = () => {
    if (isPending) return "text-amber-600";
    if (isRejected) return "text-red-600";

    return "text-green-700";
  };

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
              isActive ? activeClassName : inactiveClassName
            }`
          }
        >
          {link.name}
        </NavLink>
      ))}

      {/* About */}
      <button
        onClick={handleAboutClick}
        className={`${itemClassName} ${inactiveClassName}`}
      >
        About
      </button>

      {/* Seller Button */}
      {isApproved ? (
        <NavLink
          to="/seller/dashboard"
          onClick={closeMobileMenu}
          isActive={(_, location) =>
            location.pathname.startsWith("/seller")
          }
          className={({ isActive }) =>
            `${itemClassName} ${
              isActive ? activeClassName : inactiveClassName
            }`
          }
        >
          Seller Dashboard
        </NavLink>
      ) : (
        <button
          onClick={handleSellerAction}
          className={`${itemClassName} ${inactiveClassName} ${statusClassName()}`}
        >
          {sellerButtonText()}
        </button>
      )}
    </nav>
  );
}
