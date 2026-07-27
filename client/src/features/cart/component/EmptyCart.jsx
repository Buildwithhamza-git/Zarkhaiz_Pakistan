import React from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyCart() {
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">

        <ShoppingCart
          size={36}
          className="text-green-700"
        />

      </div>

      <h2 className="mt-6 text-2xl font-bold text-gray-900">
        Your cart is empty
      </h2>

      <p className="mx-auto mt-2 max-w-md text-gray-500">
        You haven't added any products yet.
        Explore our marketplace and find
        agricultural products you need.
      </p>

      <button
        type="button"
        onClick={() =>
          navigate("/products")
        }
        className="mt-6 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
      >
        Continue Shopping
      </button>

    </div>
  );
}