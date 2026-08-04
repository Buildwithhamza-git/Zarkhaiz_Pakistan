import { useState } from "react";
import { Heart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useWishlistContext } from "../../../context/wishlistContext";
import { useAuthContext } from "../../../context/authContext";

import WishlistConfirmModal from "./WishlistConfirmModal";

export default function WishlistButton({
  productId,
  productName = "this product",
  size = 18,
  className = "",
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const { token } = useAuthContext();

  const {
    isWishlisted,
    addToWishlist,
    removeFromWishlist,
    wishlistActionId,
  } = useWishlistContext();

  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const wishlisted = isWishlisted(productId);
  const isBusy = busy || wishlistActionId === productId;

  // ==========================================
  // Toggle handler
  // ==========================================

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!productId) return;

    if (!token) {
      navigate("/login", {
        state: {
          from: location.pathname + location.search,
          message: "Please login to use your wishlist.",
        },
      });
      return;
    }

    if (wishlisted) {
      handleRemove();
    } else {
      setShowConfirm(true);
    }
  };

  // ==========================================
  // Remove (already wishlisted → unheart)
  // ==========================================

  const handleRemove = async () => {
    try {
      setBusy(true);
      await removeFromWishlist(productId);
      toast.success("Removed from wishlist.");
    } catch (err) {
      toast.error(err?.message || "Failed to remove from wishlist.");
    } finally {
      setBusy(false);
    }
  };

  // ==========================================
  // Confirm add (Yes, Notify Seller / No, Just Save)
  // ==========================================

  const handleConfirm = async (notifySeller) => {
    try {
      setBusy(true);
      await addToWishlist(productId, notifySeller);
      setShowConfirm(false);
      toast.success(
        notifySeller
          ? "Added to wishlist. Seller notified!"
          : "Added to wishlist."
      );
    } catch (err) {
      toast.error(err?.message || "Failed to add to wishlist.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isBusy}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wishlisted}
        className={`
          group/heart
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          bg-white/90
          shadow-sm
          backdrop-blur-sm
          transition-all
          duration-200
          hover:scale-110
          hover:shadow-md
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${className}
        `}
      >
        <Heart
          size={size}
          className={`
            transition-all
            duration-200
            ${
              wishlisted
                ? "scale-110 fill-red-500 text-red-500"
                : "fill-transparent text-gray-500 group-hover/heart:text-red-400"
            }
          `}
        />
      </button>

      <WishlistConfirmModal
        open={showConfirm}
        productName={productName}
        busy={isBusy}
        onNotify={() => handleConfirm(true)}
        onSaveOnly={() => handleConfirm(false)}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}