import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyWishlist() {
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <Heart size={36} className="text-red-500" />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-gray-900">
        Your wishlist is empty.
      </h2>

      <p className="mx-auto mt-2 max-w-md text-gray-500">
        Save products you love and keep track of
        them here so you never lose sight of them.
      </p>

      <button
        type="button"
        onClick={() => navigate("/products")}
        className="mt-6 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
      >
        Browse Products
      </button>

    </div>
  );
}