import { Eye, ShoppingCart, Package } from "lucide-react";

import ProductBadge from "./ProductBadge";
import ProductRating from "./ProductRating";

import {
  formatPKR,
  getProductDisplayData,
} from "../utils/productDisplay";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
  addingToCart = false,
}) {
  const display = getProductDisplayData(product, {
    apiUrl: API_URL,
  });


  const productId =
    product?._id ||
    product?.id;


  const handleAddToCart = () => {
    if (!productId) {
      console.error(
        "Cannot add product to cart: Product ID is missing.",
        product
      );

      return;
    }

    if (display.outOfStock) {
      return;
    }

    if (addingToCart) {
      return;
    }

    onAddToCart?.(product);
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


      <div className="relative h-48 overflow-hidden bg-gray-100">

        <img
          src={display.imageUrl}
          alt={display.productName}
          className="
            h-full
            w-full
            object-cover
            transition
            duration-500
            group-hover:scale-105
          "
        />

        {/* Featured Badge */}

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {display.featured && (
            <ProductBadge type="featured" />
          )}
        </div>

        {/* Product Status */}

        <div
          className="
            absolute
            right-3
            top-3
            rounded-full
            bg-white/90
            px-2.5
            py-1
            text-[11px]
            font-semibold
            uppercase
            tracking-wide
            text-gray-700
            shadow-sm
          "
        >
          {display.status}
        </div>

      </div>


      <div className="flex flex-1 flex-col p-4">

        {/* Category + Stock */}

        <div className="mb-2 flex items-center justify-between gap-2">

          <span
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-green-700
            "
          >
            {display.categoryName}
          </span>

          {display.outOfStock ? (
            <span
              className="
                rounded-full
                bg-red-50
                px-2.5
                py-1
                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                text-red-600
              "
            >
              Out of stock
            </span>
          ) : (
            <span
              className="
                rounded-full
                bg-emerald-50
                px-2.5
                py-1
                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                text-emerald-600
              "
            >
              In stock
            </span>
          )}

        </div>

        {/* Product Name */}

        <h3
          className="
            min-h-[48px]
            line-clamp-2
            text-lg
            font-semibold
            text-gray-900
          "
        >
          {display.productName}
        </h3>

        {/* Description */}

        <p
          className="
            mt-2
            line-clamp-2
            text-sm
            leading-6
            text-gray-600
          "
        >
          {display.description}
        </p>

        {/* ==========================================
            Price + Quantity
        ========================================== */}

        <div className="mt-3 flex items-center justify-between">

          <div>

            <p className="text-2xl font-bold text-green-700">
              Rs. {formatPKR(display.price)}
            </p>

            <p className="text-xs text-gray-500">
              Per {display.unit}
            </p>

          </div>

          <div
            className="
              rounded-full
              bg-gray-100
              px-2.5
              py-1
              text-xs
              font-medium
              text-gray-600
            "
          >
            {display.quantity} {display.unit}
          </div>

        </div>

        {/* Rating */}

        <div className="mt-3">

          <ProductRating
            rating={display.averageRating}
            reviews={display.totalReviews}
          />

        </div>

        {/* ==========================================
            Actions
        ========================================== */}

        <div className="mt-auto flex items-center gap-2 pt-4">

          {/* View Details */}

          <button
            type="button"
            onClick={() => onViewDetails?.(product)}
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

          {/* Add To Cart */}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              display.outOfStock ||
              addingToCart
            }
            aria-label={
              display.outOfStock
                ? "Product is out of stock"
                : "Add product to cart"
            }
            className={`
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-white
              transition

              ${
                display.outOfStock
                  ? "cursor-not-allowed bg-gray-400"
                  : addingToCart
                  ? "cursor-wait bg-green-600"
                  : "bg-green-700 hover:bg-green-800"
              }
            `}
          >

            {addingToCart ? (
              <span
                className="
                  h-5
                  w-5
                  animate-spin
                  rounded-full
                  border-2
                  border-white
                  border-t-transparent
                "
              />
            ) : (
              <ShoppingCart size={18} />
            )}

          </button>

        </div>

        {/* ==========================================
            Delivery Information
        ========================================== */}

        <div
          className="
            mt-3
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-gray-100
            bg-gray-50
            px-3
            py-2
            text-sm
            text-gray-600
          "
        >
          <Package
            size={15}
            className="text-green-600"
          />

          <span>
            Fast delivery and secure checkout
          </span>
        </div>

      </div>

    </div>
  );
}