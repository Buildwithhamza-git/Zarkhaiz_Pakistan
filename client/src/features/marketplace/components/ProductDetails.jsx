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
import { formatPKR, getProductDisplayData, getStockMeta } from "../utils/productDisplay";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [liked, setLiked] = useState(false);

  if (!product) return null;

  const display = getProductDisplayData(product, { apiUrl: API_URL });
  const stockMeta = getStockMeta(display.quantity, display.unit);

  const gallery = Array.isArray(product?.images)
    ? product.images.filter(Boolean)
    : [];

  const imageList = gallery.length > 0 ? gallery : [display.imageUrl];

  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
      >
        <ArrowLeft size={17} />
        Back to Products
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
            <img
              src={imageList[selectedImage] && typeof imageList[selectedImage] === "string" && /^(https?:|data:)/i.test(imageList[selectedImage])
                ? imageList[selectedImage]
                : `${API_URL}/${String(imageList[selectedImage] || display.imageUrl).replace(/\\/g, "/").replace(/^\/+/, "")}`}
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
              {imageList.map((image, index) => {
                const thumbUrl = typeof image === "string" && /^(https?:|data:)/i.test(image)
                  ? image
                  : `${API_URL}/${String(image || display.imageUrl).replace(/\\/g, "/").replace(/^\/+/, "")}`;

                return (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-xl border ${selectedImage === index ? "border-green-600" : "border-gray-200"}`}
                  >
                    <img src={thumbUrl} alt={`${display.productName} ${index + 1}`} className="h-20 w-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-green-700">
              {display.categoryName}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
              {display.status}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            {display.productName}
          </h1>

          <div className="mt-3">
            <ProductRating rating={display.averageRating} reviews={display.totalReviews} />
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-bold text-green-700">Rs. {formatPKR(display.price)}</span>
            <span className="text-sm text-gray-500">Per {display.unit}</span>
          </div>

          <p className="mt-5 leading-7 text-gray-600">{display.description}</p>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <PackageCheck size={16} className="text-green-600" />
              <span className={`text-sm font-semibold ${stockMeta.tone}`}>{stockMeta.label}</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-3 text-sm text-gray-600">
                <div className="flex items-center gap-2 font-semibold text-gray-800">
                  <Truck size={15} className="text-green-600" />
                  Fast Dispatch
                </div>
                <p className="mt-1">Secure packing and same-day handling for verified sellers.</p>
              </div>
              <div className="rounded-xl bg-white p-3 text-sm text-gray-600">
                <div className="flex items-center gap-2 font-semibold text-gray-800">
                  <ShieldCheck size={15} className="text-green-600" />
                  Buyer Protection
                </div>
                <p className="mt-1">Trusted checkout with reliable return support for genuine products.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-green-700">
                <Store size={18} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Sold by {display.sellerName}</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={14} className="text-gray-400" />
                  {display.sellerLocation}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Star size={15} className="text-yellow-500" />
                4.8 seller rating · 98% positive feedback
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                <span className="rounded-full bg-white px-2.5 py-1">Verified seller</span>
                <span className="rounded-full bg-white px-2.5 py-1">Fast response</span>
                <span className="rounded-full bg-white px-2.5 py-1">Secure checkout</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={display.outOfStock}
              leftIcon={<ShoppingCart size={18} />}
              onClick={() => onAddToCart(product)}
            >
              Add to cart
            </Button>
            <Button variant="outline" size="lg" fullWidth onClick={onBack}>
              Continue shopping
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between lg:hidden">
        <div>
          <p className="text-lg font-semibold text-gray-900">Rs. {formatPKR(display.price)}</p>
          <p className="text-sm text-gray-500">Free delivery • Secure checkout</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiked((value) => !value)}
            className={`flex h-11 w-11 items-center justify-center rounded-full border ${liked ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 bg-white text-gray-500"}`}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
          </button>
          <Button variant="primary" size="lg" leftIcon={<ShoppingCart size={18} />} onClick={() => onAddToCart(product)}>
            Buy now
          </Button>
        </div>
      </div>
    </div>
  );
}