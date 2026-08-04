import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";

import Navbar from "../../Home/components/Navbar/Navbar";
import Container from "../../../shared/layouts/Container";

import useCart from "../hook/useCart";

import CartItem from "../component/cartitem";
import CartSummary from "../component/cartSummary";
import EmptyCart from "../component/EmptyCart";

export default function CartPage() {
  const navigate = useNavigate();

  const {
    items,
    totalItems,
    subtotal,
    loading,
    actionLoading,
    error,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleIncrease = (productId, quantity) => {
    updateQuantity(productId, quantity);
  };

  const handleDecrease = (productId, quantity) => {
    updateQuantity(productId, quantity);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">

        {/* Navbar */}
        <Navbar />

        {/* Loading content */}
        <Container className="py-10 sm:py-14">

          <div className="animate-pulse">

            <div className="h-8 w-48 rounded bg-gray-200" />

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">

              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-40 rounded-2xl bg-gray-200"
                  />
                ))}
              </div>

              <div className="h-80 rounded-2xl bg-gray-200" />

            </div>

          </div>

        </Container>

      </div>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <Navbar />

      {/* ======================================
          CART CONTENT
      ====================================== */}

      <main>
        <Container className="px-4 py-10 sm:px-6 sm:py-14">

          {/* Header */}

          <div className="mb-8">

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-700"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>

            <div className="mt-5 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                <ShoppingCart
                  size={22}
                  className="text-green-700"
                />
              </div>

              <div>

                <h1 className="text-3xl font-bold text-gray-900">
                  Shopping Cart
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "item"
                    : "items"}{" "}
                  in your cart
                </p>

              </div>

            </div>

          </div>

          {/* ==================================
              ERROR
          ================================== */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ==================================
              EMPTY CART
          ================================== */}

          {items.length === 0 ? (
            <EmptyCart />
          ) : (

            <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">

              {/* ==================================
                  CART ITEMS
              ================================== */}

              <div className="space-y-4">

                {items.map((item, index) => (
                  <CartItem
                    key={
                      item?._id ||
                      item?.product?._id ||
                      index
                    }
                    item={item}
                    disabled={actionLoading}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={removeItem}
                  />
                ))}

              </div>

              {/* ==================================
                  CART SUMMARY
              ================================== */}

              <div className="lg:sticky lg:top-24">

                <CartSummary
                  totalItems={totalItems}
                  subtotal={subtotal}
                  disabled={actionLoading}
                  onClearCart={clearCart}
                  onCheckout={handleCheckout}
                />

              </div>

            </div>

          )}

        </Container>
      </main>

    </div>
  );
}
