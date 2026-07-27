import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  Truck,
} from "lucide-react";

import ProductRating from "./ProductRating";
import ProductBadge from "./ProductBadge";
import Button from "../../../shared/components/ui/button";
import {
  formatPKR,
  getProductDisplayData,
  getStockMeta,
} from "../utils/productDisplay";

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [liked, setLiked] = useState(false);
  

  if (!product) return null;

  const display = getProductDisplayData(product);
  const stockMeta = getStockMeta(display.quantity, display.unit);

  
  // ✅ FIXED IMAGE HANDLING
  const gallery =
    product?.images?.map((img) => img?.url).filter(Boolean) || [];

  const imageList =
    gallery.length > 0
      ? gallery
      : [
          display?.imageUrl ||
            "https://placehold.co/500x500?text=No+Image",
        ];

  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        <ArrowLeft size={17} />
        Back to Products
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ================= IMAGE SECTION ================= */}
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
            <img
              src={imageList[selectedImage]}
              alt={display.productName}
              className="aspect-square w-full object-cover"
            />

            {display.featured && (
              <div className="absolute left-4 top-4">
                <ProductBadge type="featured" />
              </div>
            )}
          </div>

          {imageList.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {imageList.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-xl border ${
                    selectedImage === index
                      ? "border-green-600"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${display.productName} ${index + 1}`}
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= DETAILS SECTION ================= */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-green-700">
              {display.categoryName}
            </span>

            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-gray-600">
              {display.status}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            {display.productName}
          </h1>

          <div className="mt-3">
            <ProductRating
              rating={display.averageRating}
              reviews={display.totalReviews}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-bold text-green-700">
              Rs. {formatPKR(display.price)}
            </span>
            <span className="text-sm text-gray-500">
              Per {display.unit}
            </span>
          </div>

          <p className="mt-5 text-gray-600 leading-7">
            {display.description}
          </p>

          {/* STOCK INFO */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <PackageCheck
                size={16}
                className="text-green-600"
              />
              <span
                className={`text-sm font-semibold ${stockMeta.tone}`}
              >
                {stockMeta.label}
              </span>
            </div>
          </div>

          {/* SELLER */}
          <div className="mt-6 rounded-2xl border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-green-700">
                <Store size={18} />
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  Sold by {display.sellerName}
                </p>

                <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} />
                  {display.sellerLocation}
                </p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<ShoppingCart size={18} />}
              onClick={() => onAddToCart(product)}
            >
              Add to cart
            </Button>

            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={onBack}
            >
              Continue shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}