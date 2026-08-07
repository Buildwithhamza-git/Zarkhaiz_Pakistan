import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Eye, MapPin, ShoppingCart, Trash2 } from "lucide-react";

import ProductRating from "../../marketplace/components/ProductRating";
import RemoveWishlistModal from "./RemoveWishlistModal";

import {
  formatPKR,
  getProductDisplayData,
} from "../../marketplace/utils/productDisplay";
import { formatDateTime } from "../../order/utils/orderDisplay";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function WishlistCard({
  item,
  onAddToCart,
  onNotifyMe,
  onRemove,
  addingToCart = false,
  notifying = false,
  removing = false,
}) {
  const navigate = useNavigate();

  const [confirmRemove, setConfirmRemove] = useState(false);

  const product = item?.product || {};
  const productId = product?._id || product?.id;

  const display = getProductDisplayData(product, { apiUrl: API_URL });

  const handleRemove = async () => {
    await onRemove?.(productId);
    setConfirmRemove(false);
  };

  return (
    <div
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-3xl
        border
        border-gray-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* =============== IMAGE =============== */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={display.imageUrl}
          alt={display.productName}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Remove Wishlist */}
        <button
          type="button"
          onClick={() => setConfirmRemove(true)}
          disabled={removing}
          aria-label="Remove from wishlist"
          className="
            absolute right-3 top-3
            flex h-9 w-9 items-center justify-center
            rounded-full bg-white/90 text-red-500 shadow-sm backdrop-blur-sm
            transition hover:scale-110 hover:bg-red-50
            disabled:cursor-not-allowed disabled:opacity-60
          "
        >
          <Trash2 size={16} />
        </button>

        {/* Status */}
        <div
          className="
            absolute left-3 top-3
            rounded-full bg-white/90 px-2.5 py-1
            text-[11px] font-semibold uppercase tracking-wide text-gray-700 shadow-sm
          "
        >
          {display.status}
        </div>
      </div>

      {/* =============== CONTENT =============== */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category + Stock */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-700">
            {display.categoryName}
          </span>

          {display.outOfStock ? (
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-600">
              Out of stock
            </span>
          ) : (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
              In stock
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="min-h-[48px] line-clamp-2 text-lg font-semibold text-gray-900">
          {display.productName}
        </h3>

        {/* Seller */}
        <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin size={12} />
          Sold by {display.sellerName}
        </p>

        {/* Rating */}
        <div className="mt-3">
          <ProductRating rating={display.averageRating} reviews={display.totalReviews} />
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-2xl font-bold text-green-700">
            Rs. {formatPKR(display.price)}
          </p>
          <p className="text-xs text-gray-500">Per {display.unit}</p>
        </div>

        {/* Wishlist Date */}
        <p className="mt-2 text-xs text-gray-400">
          Wishlisted on {formatDateTime(item?.createdAt)}
        </p>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 pt-4">
          {/* View Details */}
          <button
            type="button"
            onClick={() => navigate(`/products/product/${productId}`)}
            className="
              flex
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-green-700
              px-3
              py-2.5
              text-sm
              font-semibold
              text-green-700
              transition
              hover:bg-green-700
              hover:text-white
            "
          >
            <Eye size={16} />
            View details
          </button>

          {/* Add To Cart / Notify Me */}
          {display.outOfStock ? (
            <button
              type="button"
              onClick={() => onNotifyMe?.(productId)}
              disabled={notifying}
              aria-label="Notify me when back in stock"
              className="
                flex h-11 w-11 shrink-0 items-center justify-center
                rounded-xl bg-amber-500 text-white transition
                hover:bg-amber-600
                disabled:cursor-wait disabled:opacity-70
              "
            >
              {notifying ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Bell size={18} />
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart?.(product, 1)}
              disabled={addingToCart}
              aria-label="Add product to cart"
              className="
                flex h-11 w-11 shrink-0 items-center justify-center
                rounded-xl bg-green-700 text-white transition
                hover:bg-green-800
                disabled:cursor-wait disabled:opacity-70
              "
            >
              {addingToCart ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <ShoppingCart size={18} />
              )}
            </button>
          )}
        </div>
      </div>

      <RemoveWishlistModal
        open={confirmRemove}
        productName={display.productName}
        busy={removing}
        onConfirm={handleRemove}
        onCancel={() => setConfirmRemove(false)}
      />
    </div>
  );
}