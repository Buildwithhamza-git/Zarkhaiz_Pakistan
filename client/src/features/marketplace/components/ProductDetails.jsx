import {
  ArrowLeft,
  CheckCircle2,
  PackageX,
  ShoppingCart,
  User,
} from "lucide-react";

import ProductRating from "./ProductRating";
import ProductBadge from "./ProductBadge";
import Button from "../../../shared/components/ui/button";

function formatPKR(amount) {
  if (amount == null) return "";
  return new Intl.NumberFormat("en-PK").format(amount);
}

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
}) {
  if (!product) return null;

  const {
    name,
    description,
    price,
    quantity,
    images = [],
    category,
    seller,
    averageRating,
    totalReviews,
    featured,
    unit,
  } = product;

  const image =
    images.length > 0
      ? images[0]
      : "https://placehold.co/600x600?text=No+Image";

  const isOutOfStock = quantity === 0;
  const isLowStock = quantity > 0 && quantity <= 10;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      <button
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        <ArrowLeft size={17} />
        Back to Products
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

        {/* IMAGE */}

        <div className="relative overflow-hidden rounded-2xl bg-gray-50">
          <img
            src={image}
            alt={name}
            className="aspect-square w-full object-cover"
          />

          {featured && (
            <div className="absolute top-3 left-3">
              <ProductBadge type="featured" />
            </div>
          )}
        </div>

        {/* DETAILS */}

        <div className="flex flex-col">

          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
            {category?.name}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {name}
          </h1>

          <div className="mt-3">
            <ProductRating
              rating={averageRating}
              reviews={totalReviews}
            />
          </div>

          <div className="mt-5">
            <span className="text-3xl font-bold text-green-700">
              Rs. {formatPKR(price)}
            </span>

            <span className="ml-3 text-gray-500">
              / {unit}
            </span>
          </div>

          <p className="mt-5 leading-relaxed text-gray-600">
            {description}
          </p>

          <div className="mt-6 flex flex-wrap gap-5 border-y border-gray-100 py-4">

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User size={15} />
              <span>
                Sold by{" "}
                <strong>
                  {seller?.businessName ||
                    seller?.shopName ||
                    seller?.name ||
                    "Seller"}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">

              {isOutOfStock ? (
                <>
                  <PackageX
                    size={15}
                    className="text-red-500"
                  />

                  <span className="font-medium text-red-600">
                    Out of Stock
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2
                    size={15}
                    className={
                      isLowStock
                        ? "text-yellow-500"
                        : "text-green-600"
                    }
                  />

                  <span
                    className={`font-medium ${
                      isLowStock
                        ? "text-yellow-600"
                        : "text-green-700"
                    }`}
                  >
                    {isLowStock
                      ? `Only ${quantity} left`
                      : "In Stock"}
                  </span>
                </>
              )}

            </div>

          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={isOutOfStock}
              leftIcon={<ShoppingCart size={18} />}
              onClick={() => onAddToCart(product)}
            >
              Add To Cart
            </Button>

            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={onBack}
            >
              Back to Products
            </Button>

          </div>

        </div>
      </div>
    </div>
  );
}