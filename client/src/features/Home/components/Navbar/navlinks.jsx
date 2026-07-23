import { NavLink, useNavigate } from "react-router-dom";

import { useAuthContext } from "../../../../context/authContext";
import { useSellerContext } from "../../../../context/sellerContext";

const links = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "About", path: "/about" },
];

export default function NavLinks() {
  const navigate = useNavigate();

  const { user } = useAuthContext();

  const {
    seller,
    isApproved,
    isPending,
    isRejected,
  } = useSellerContext();

  const handleSellerAction = () => {

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
      navigate("/seller/rejected");
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

  return (
    <div className="hidden lg:flex items-center gap-8">
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) =>
            `font-medium transition ${
              isActive
                ? "text-green-700"
                : "text-gray-700 hover:text-green-700"
            }`
          }
        >
          {link.name}
        </NavLink>
      ))}

      <button
        onClick={handleSellerAction}
        className={`font-medium transition ${
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
    </div>
  );
}