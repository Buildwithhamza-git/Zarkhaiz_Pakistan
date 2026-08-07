import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  ShoppingCart,
  Star,
  Store,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import ProductRating from "./ProductRating";
import ProductBadge from "./ProductBadge";
import WishlistButton from "../../wishlist/components/WishlistButton";
import ReviewSection from "../../review/components/ReviewSection";
import Button from "../../../shared/components/ui/button";
import { useAuthContext } from "../../../context/authContext";
import { useChat } from "../../chat/context/chatContext";
import {
  formatPKR,
  getProductDisplayData,
  getStockMeta,
} from "../utils/productDisplay";

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
  addingToCart = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const { startConversation } = useChat();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const display = getProductDisplayData(product);
  const stockMeta = getStockMeta(display.quantity, display.unit);
  const maxQty = display.quantity; // available stock
  const productId = product?._id || product?.id;

  const gallery =
    product?.images
      ?.map((img) => (typeof img === "string" ? img : img?.url))
      .filter(Boolean) || [];

  const imageList =
    gallery.length > 0
      ? gallery
      : [display?.imageUrl || "https://placehold.co/500x500?text=No+Image"];

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => Math.min(maxQty || 1, q + 1));
  const handleQtyInput = (e) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= (maxQty || 1)) {
      setQuantity(val);
    }
  };

  const handleChatWithSeller = async () => {
    const seller = product?.seller;

    if (!seller?._id) return;

    if (!user) {
      navigate("/login", {
        state: {
          from: location.pathname + location.search,
          message: "Please login to chat with the seller.",
        },
      });
      return;
    }

    await startConversation({
      sellerId: seller._id,
      productId: product._id,
      productName: product.name,
      initialMessage: `Hi, I'm interested in ${product.name}. Is it available?`,
    });
  };

  const scrollToReviews = () => {
    document
      .getElementById("reviews")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <button
        onClick={onBack}
        type="button"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
      >
        <ArrowLeft size={17} />
        Back to Products
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* ================= IMAGE SECTION ================= */}
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50">
            <img
              src={imageList[selectedImage] || imageList[0]}
              alt={display.productName}
              className="aspect-square w-full object-cover"
            />

            {display.featured && (
              <div className="absolute left-4 top-4">
                <ProductBadge type="featured" />
              </div>
            )}

            <div className="absolute right-4 top-4">
              <WishlistButton
                productId={productId}
                productName={display.productName}
                size={20}
                className="h-11 w-11"
              />
            </div>
          </div>

          {imageList.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {imageList.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-xl border transition ${
                    selectedImage === index
                      ? "border-green-600 ring-2 ring-green-100"
                      : "border-gray-200 hover:border-green-300"
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

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <ProductRating
              rating={display.averageRating}
              reviews={display.totalReviews}
              onClick={scrollToReviews}
            />

            <button
              type="button"
              onClick={scrollToReviews}
              className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3.5 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-100"
            >
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              Write a Review
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-bold text-green-700">
              Rs. {formatPKR(display.price)}
            </span>
            <span className="text-sm text-gray-500">Per {display.unit}</span>
          </div>

          <p className="mt-5 leading-7 text-gray-600">{display.description}</p>

          {/* STOCK INFO */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <PackageCheck size={16} className="text-green-600" />
              <span className={`text-sm font-semibold ${stockMeta.tone}`}>
                {stockMeta.label}
              </span>
            </div>
          </div>

          {/* QUANTITY SELECTOR */}
          {!display.outOfStock && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-gray-700">
                Quantity
              </p>

              <div className="flex items-center gap-3">
                <div className="flex items-center overflow-hidden rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={decreaseQty}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>

                  <input
                    type="number"
                    min="1"
                    max={maxQty || 1}
                    value={quantity}
                    onChange={handleQtyInput}
                    className="h-10 w-14 border-x border-gray-200 text-center text-sm font-semibold text-gray-900 outline-none focus:bg-green-50"
                  />

                  <button
                    type="button"
                    onClick={increaseQty}
                    disabled={quantity >= (maxQty || 1)}
                    aria-label="Increase quantity"
                    className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <span className="text-sm text-gray-500">
                  of {maxQty} {display.unit} available
                </span>
              </div>

              {/* Running subtotal */}
              {quantity > 1 && (
                <p className="mt-2 text-sm text-gray-500">
                  Subtotal:{" "}
                  <span className="font-semibold text-green-700">
                    Rs. {formatPKR(display.price * quantity)}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* SELLER INFO */}
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

            <button
              type="button"
              onClick={handleChatWithSeller}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100 hover:text-green-800"
            >
              <MessageCircle size={17} />
              Chat with Seller
            </button>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={display.outOfStock || addingToCart}
              leftIcon={<ShoppingCart size={18} />}
              onClick={() => onAddToCart(product, quantity)}
            >
              {addingToCart
                ? "Adding to Cart..."
                : display.outOfStock
                ? "Out of Stock"
                : `Add ${quantity > 1 ? `${quantity} × ` : ""}to Cart`}
            </Button>

            <Button variant="outline" size="lg" fullWidth onClick={onBack}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>

      {/* ================= REVIEWS SECTION ================= */}
      <ReviewSection
        productId={productId}
        productName={display.productName}
        productImage={imageList[0]}
      />
    </div>
  );
}