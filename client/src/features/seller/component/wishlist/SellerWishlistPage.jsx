import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Heart,
  Search,
  Users,
  Bell,
} from "lucide-react";

import ProductRating from "../../../marketplace/components/ProductRating";
import { useSellerWishlistStats } from "../../../wishlist/hooks/useSellerWishlistStats";
import {
  formatPKR,
  getProductDisplayData,
} from "../../../marketplace/utils/productDisplay";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SellerWishlistPage() {
  const navigate = useNavigate();

  const { items, total, loading, error } = useSellerWishlistStats();

  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;

    const query = search.trim().toLowerCase();

    return items.filter((item) =>
      (item.product?.name || "").toLowerCase().includes(query)
    );
  }, [items, search]);

  return (
    <div className="flex flex-col">
      {/* =============== HEADER =============== */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Wishlist</h1>
          <p className="text-sm text-gray-500">
            Products your buyers have added to their wishlists.
          </p>
        </div>

        {total > 0 && (
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            {total} {total === 1 ? "product" : "products"}
          </span>
        )}
      </div>

      {/* =============== SEARCH =============== */}
      {!loading && items.length > 0 && (
        <div className="mb-4 relative max-w-sm">
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
      )}

      {/* =============== ERROR =============== */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =============== CONTENT =============== */}
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
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Heart size={28} className="text-red-400" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            No wishlist activity yet
          </h3>

          <p className="mt-1 max-w-sm text-sm text-gray-500">
            When buyers add one of your products to their wishlist — and
            especially when they notify you — the product and how many users
            are interested will appear here.
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            No matches found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <SellerWishlistCard
              key={item._id}
              item={item}
              onView={() =>
                navigate(`/products/product/${item._id}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SellerWishlistCard({ item, onView }) {
  const product = item.product || {};
  const productId = item._id;

  const display = getProductDisplayData(product, { apiUrl: API_URL });

  const users = item.users || 0;
  const notifiedUsers = item.notifiedUsers || 0;

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

        {/* Notified badge */}
        {notifiedUsers > 0 && (
          <div
            className="
              absolute right-3 top-3
              flex items-center gap-1
              rounded-full bg-amber-500 px-2.5 py-1
              text-[11px] font-semibold text-white shadow-sm
            "
          >
            <Bell size={12} />
            Notified
          </div>
        )}
      </div>

      {/* =============== CONTENT =============== */}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-700">
          {display.categoryName}
        </span>

        <h3 className="mt-1 min-h-[48px] line-clamp-2 text-lg font-semibold text-gray-900">
          {display.productName}
        </h3>

        <div className="mt-2">
          <ProductRating
            rating={display.averageRating}
            reviews={display.totalReviews}
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-2xl font-bold text-green-700">
            Rs. {formatPKR(display.price)}
          </p>
          <p className="text-xs text-gray-500">Per {display.unit}</p>
        </div>

        {/* =============== INTEREST STATS =============== */}
        <div className="mt-4 flex items-center gap-2">
          <div
            className="
              flex flex-1 items-center justify-center gap-1.5
              rounded-xl bg-red-50 px-3 py-2.5 text-sm
            "
          >
            <Users size={15} className="text-red-500" />
            <span className="font-semibold text-red-600">{users}</span>
            <span className="text-red-400">
              {users === 1 ? "user" : "users"} wishlisted
            </span>
          </div>

          <div
            className="
              flex flex-1 items-center justify-center gap-1.5
              rounded-xl bg-amber-50 px-3 py-2.5 text-sm
            "
          >
            <Bell size={15} className="text-amber-500" />
            <span className="font-semibold text-amber-600">
              {notifiedUsers}
            </span>
            <span className="text-amber-400">notified</span>
          </div>
        </div>

        {/* =============== ACTION =============== */}
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={onView}
            className="
              flex w-full items-center justify-center gap-2
              rounded-xl border border-green-700 px-3 py-2.5
              text-sm font-semibold text-green-700
              transition hover:bg-green-700 hover:text-white
            "
          >
            <Eye size={16} />
            View product
          </button>
        </div>
      </div>
    </div>
  );
}
