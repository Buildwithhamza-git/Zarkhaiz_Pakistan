import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronRight, Heart, Search } from "lucide-react";

import Navbar from "../../Home/components/Navbar/Navbar";
import Container from "../../../shared/layouts/Container";

import { useWishlistContext } from "../../../context/wishlistContext";
import { useCartContext } from "../../../context/cartContext";

import WishlistCard from "../components/WishlistCard";
import EmptyWishlist from "../components/EmptyWishlist";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price", label: "Price" },
  { value: "rating", label: "Rating" },
  { value: "name", label: "Name" },
];

export default function WishlistPage() {
  const {
    items,
    loading,
    error,
    wishlistActionId,
    removeFromWishlist,
    notifySellerForProduct,
  } = useWishlistContext();

  const { addToCart } = useCartContext();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [addingToCartId, setAddingToCartId] = useState(null);
  const [notifyingId, setNotifyingId] = useState(null);

  // ==========================================
  // Search + Sort (client-side, wishlist is
  // typically small so no need to hit the API)
  // ==========================================

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((item) =>
        (item.product?.name || "").toLowerCase().includes(query)
      );
    }

    switch (sort) {
      case "price":
        result.sort(
          (a, b) => (a.product?.price || 0) - (b.product?.price || 0)
        );
        break;

      case "rating":
        result.sort(
          (a, b) =>
            (b.product?.averageRating || 0) -
            (a.product?.averageRating || 0)
        );
        break;

      case "name":
        result.sort((a, b) =>
          (a.product?.name || "").localeCompare(b.product?.name || "")
        );
        break;

      default:
        result.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    return result;
  }, [items, search, sort]);

  // ==========================================
  // Add to Cart
  // ==========================================

  const handleAddToCart = async (product, quantity = 1) => {
    const productId = product?._id || product?.id;
    if (!productId) return;

    try {
      setAddingToCartId(productId);
      await addToCart(productId, quantity);
      toast.success("Product added to cart successfully!");
    } catch (err) {
      toast.error(err?.message || "Failed to add product to cart.");
    } finally {
      setAddingToCartId(null);
    }
  };

  // ==========================================
  // Notify Me (out of stock products)
  // ==========================================

  const handleNotifyMe = async (productId) => {
    try {
      setNotifyingId(productId);
      await notifySellerForProduct(productId);
      toast.success("We'll notify the seller you're interested!");
    } catch (err) {
      toast.error(err?.message || "Failed to notify seller.");
    } finally {
      setNotifyingId(null);
    }
  };

  // ==========================================
  // Remove
  // ==========================================

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      toast.success("Removed from wishlist.");
    } catch (err) {
      toast.error(err?.message || "Failed to remove from wishlist.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <Navbar />

      <main>
        <Container className="px-4 py-10 sm:px-6 sm:py-14">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link to="/" className="transition hover:text-green-700">
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="font-medium text-gray-700">Wishlist</span>
          </nav>

          {/* Header */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100">
              <Heart size={22} className="text-red-500" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Wishlist
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Toolbar */}
          {!loading && items.length > 0 && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-sm">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search wishlist products"
                  className="
                    w-full rounded-xl border border-gray-200 bg-white
                    py-2.5 pl-10 pr-4 text-sm text-gray-700
                    outline-none transition
                    focus:border-green-500 focus:ring-2 focus:ring-green-100
                  "
                />
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="
                  rounded-xl border border-gray-200 bg-white
                  px-4 py-2.5 text-sm font-medium text-gray-700
                  outline-none transition
                  focus:border-green-500 focus:ring-2 focus:ring-green-100
                "
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort by: {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Content */}
          <div className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-96 animate-pulse rounded-3xl bg-gray-200"
                  />
                ))}
              </div>
            ) : items.length === 0 ? (
              <EmptyWishlist />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => {
                  const productId = item.product?._id || item.product?.id;

                  return (
                    <WishlistCard
                      key={item._id || productId}
                      item={item}
                      onAddToCart={handleAddToCart}
                      onNotifyMe={handleNotifyMe}
                      onRemove={handleRemove}
                      addingToCart={addingToCartId === productId}
                      notifying={
                        notifyingId === productId ||
                        wishlistActionId === productId
                      }
                      removing={wishlistActionId === productId}
                    />
                  );
                })}
              </div>
            )}
          </div>

        </Container>
      </main>

    </div>
  );
}