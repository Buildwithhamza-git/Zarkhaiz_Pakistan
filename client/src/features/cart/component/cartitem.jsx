import React from "react";
import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// ==========================================
// Get Product Image
// ==========================================

const getProductImage = (product) => {
  const firstImage = product?.images?.[0];

  // Your Product schema stores images as:
  // { url: String, alt: String }

  const image =
    typeof firstImage === "string"
      ? firstImage
      : firstImage?.url ||
        product?.image ||
        product?.productImage;

  if (!image || typeof image !== "string") {
    return null;
  }

  // Already a complete URL
  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  // Backend relative path
  return `${API_URL}/${image.replace(/^\/+/, "")}`;
};

// ==========================================
// Cart Item
// ==========================================

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  disabled = false,
}) {
  const product = item?.product || {};

  const quantity =
    Number(item?.quantity || 1);

  const price =
    Number(
      product?.price ??
        item?.price ??
        0
    );

  const image =
    getProductImage(product);

  const productName =
    product?.name ||
    product?.productName ||
    "Product";

  const sellerName =
    product?.seller?.storeName ||
    product?.seller?.user?.firstname ||
    "Seller";

  const itemTotal =
    price * quantity;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row">

      {/* ==========================================
          Product Image
          ========================================== */}

      <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-28">
        {image ? (
          <img
            src={image}
            alt={productName}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display =
                "none";
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* ==========================================
          Product Information
          ========================================== */}

      <div className="flex min-w-0 flex-1 flex-col">

        <div className="flex items-start justify-between gap-4">

          <div>
            <h3 className="line-clamp-2 font-semibold text-gray-900">
              {productName}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Seller: {sellerName}
            </p>
          </div>

          {/* Remove */}

          <button
            type="button"
            onClick={() =>
              onRemove(product?._id)
            }
            disabled={disabled}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            title="Remove item"
          >
            <Trash2 size={18} />
          </button>

        </div>

        {/* ==========================================
            Bottom Section
            ========================================== */}

        <div className="mt-auto flex flex-col gap-4 pt-5 sm:flex-row sm:items-end sm:justify-between">

          {/* Price */}

          <div>
            <p className="text-sm text-gray-500">
              Price
            </p>

            <p className="font-semibold text-green-700">
              Rs.{" "}
              {price.toLocaleString()}
            </p>
          </div>

          {/* Quantity */}

          <div className="flex items-center gap-3">

            {/* Decrease */}

            <button
              type="button"
              disabled={
                disabled ||
                quantity <= 1
              }
              onClick={() =>
                onDecrease(
                  product?._id,
                  quantity - 1
                )
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus size={16} />
            </button>

            <span className="min-w-8 text-center font-medium">
              {quantity}
            </span>

            {/* Increase */}

            <button
              type="button"
              disabled={disabled}
              onClick={() =>
                onIncrease(
                  product?._id,
                  quantity + 1
                )
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={16} />
            </button>

          </div>

          {/* Total */}

          <div className="text-left sm:text-right">

            <p className="text-sm text-gray-500">
              Total
            </p>

            <p className="font-bold text-gray-900">
              Rs.{" "}
              {itemTotal.toLocaleString()}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}