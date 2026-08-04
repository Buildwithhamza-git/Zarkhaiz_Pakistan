import { ArrowRight, Trash2 } from "lucide-react";

export default function CartSummary({
  totalItems,
  subtotal,
  onClearCart,
  onCheckout,
  disabled = false,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold text-gray-900">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4">

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Items
          </span>

          <span className="font-medium text-gray-900">
            {totalItems}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Subtotal
          </span>

          <span className="font-medium text-gray-900">
            Rs.{" "}
            {subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Delivery
          </span>

          <span className="font-medium text-green-700">
            Calculated at checkout
          </span>
        </div>

        <div className="border-t border-gray-200 pt-4">

          <div className="flex justify-between">

            <span className="font-semibold text-gray-900">
              Estimated Total
            </span>

            <span className="text-xl font-bold text-green-700">
              Rs.{" "}
              {subtotal.toLocaleString()}
            </span>

          </div>

        </div>

      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onCheckout}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Proceed to Checkout
        <ArrowRight size={18} />
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={onClearCart}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 size={16} />
        Clear Cart
      </button>

    </div>
  );
}
