import { Eye, ShoppingCart, PackageX } from "lucide-react";
import ProductBadge from "./ProductBadge";
import ProductRating from "./ProductRating";

function formatPKR(amount) {
  if (amount == null) return "";
  return new Intl.NumberFormat("en-PK").format(amount);
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
}) {
 const {
  name,
  category,
  images,
  price,
  quantity,
  averageRating,
  totalReviews,
  featured,
} = product;

  const outOfStock = quantity === 0;

  const imageUrl =
    images?.length > 0
      ? `${API_URL}/${images[0].replace(/\\/g, "/")}`
      : "/placeholder-product.png";

  return (
    <div
      className="
      bg-white
      rounded-2xl
      border border-gray-200
      shadow-sm
      hover:shadow-lg
      transition-all
      duration-300
      overflow-hidden
      flex
      flex-col
      h-full
      "
    >
      {/* IMAGE */}

      <div className="relative h-44 bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition duration-500 hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {featured && <ProductBadge type="featured" />}
        </div>

        {outOfStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="bg-black text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
              <PackageX size={15} />
              Out of Stock
            </div>
          </div>
        )}
      </div>

      {/* BODY */}

      <div className="flex flex-col flex-1 p-4">

        <span className="text-[11px] uppercase tracking-wide font-semibold text-green-700">
          {category?.name}
        </span>

        <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2 min-h-[56px]">
          {name}
        </h3>

        <div className="mt-2">
          <ProductRating
            rating={averageRating}
            reviews={totalReviews}
          />
        </div>

        <div className="mt-3 flex items-end gap-2">

          <span className="text-2xl font-bold text-green-700">
            Rs. {formatPKR(price)}
          </span>

        </div>

        <div className="mt-auto pt-5 flex gap-3">

          <button
            disabled={outOfStock}
            onClick={() => onViewDetails(product)}
            className="
            flex-1
            h-11
            rounded-xl
            border
            border-green-700
            text-green-700
            font-medium
            flex
            items-center
            justify-center
            gap-2
            hover:bg-green-700
            hover:text-white
            transition
            "
          >
            <Eye size={18} />
            View Details
          </button>

          <button
            disabled={outOfStock}
            
            onClick={() => onAddToCart(product)}
            className="
            w-12
            rounded-xl
            bg-green-700
            text-white
            flex
            items-center
            justify-center
            hover:bg-green-800
            transition
            "
          >
            <ShoppingCart size={20} />
          </button>

        </div>

      </div>
    </div>
  );
}