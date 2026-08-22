import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Banknote,
  Loader2,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import Navbar from "../../Home/components/Navbar/Navbar";
import Container from "../../../shared/layouts/Container";
import Input from "../../../shared/components/ui/input";
import FormField from "../../../shared/components/ui/Formfield";

import { useCartContext } from "../../../context/cartContext";

import { createOrder } from "../api/orderApi";
import { getProfileApi } from "../../profile/api/profileApi";
import { checkoutSchema, PROVINCES } from "../validations/checkoutValidation";
import OrderItemsList from "../components/OrderItemsList";

const DELIVERY_FEE = 199;
const FREE_DELIVERY_THRESHOLD = 2000;

export default function CheckoutPage() {
  const navigate = useNavigate();

  const { items, subtotal, loading, fetchCart } = useCartContext();

  const [placing, setPlacing] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      country: "Pakistan",
      notes: "",
    },
  });

  // ==========================================
  // Prefill from profile
  // ==========================================

  useEffect(() => {
    const prefill = async () => {
      try {
        const response = await getProfileApi();

        const profile = response?.user;

        if (profile?.firstname || profile?.lastname) {
          setValue(
            "fullName",
            `${profile.firstname || ""} ${
              profile.lastname || ""
            }`.trim()
          );
        }

        if (profile?.phone) {
          setValue("phone", profile.phone);
        }
      } catch {
        // Silent — user can type the address manually.
      }
    };

    prefill();
  }, [setValue]);

  // ==========================================
  // Totals
  // ==========================================

  const deliveryFee = useMemo(
    () => (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE),
    [subtotal]
  );

  const total = subtotal + deliveryFee;

  // ==========================================
  // Submit
  // ==========================================

  const onSubmit = async (data) => {
    setServerError("");
    setPlacing(true);

    try {
      const response = await createOrder({
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          province: data.province,
          postalCode: data.postalCode || "",
          country: data.country,
        },
        paymentMethod: "COD",
        notes: data.notes || "",
      });

      const orderId = response?.data?._id;

      // Sync the navbar cart badge with the cleared cart.
      fetchCart();

      toast.success("Order placed successfully!");

      if (orderId) {
        navigate(`/order-success/${orderId}`, { replace: true });
      } else {
        navigate("/orders", { replace: true });
      }
    } catch (error) {
      const message =
        error?.message ||
        error?.data?.message ||
        "Failed to place your order. Please try again.";

      setServerError(message);

      if (message.toLowerCase().includes("empty")) {
        toast.error("Your cart is empty.");
        navigate("/cart", { replace: true });
      } else {
        toast.error(message);
      }
    } finally {
      setPlacing(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Container className="py-14">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-56 rounded bg-gray-200" />
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="h-96 rounded-2xl bg-gray-200" />
              <div className="h-80 rounded-2xl bg-gray-200" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // ==========================================
  // Empty cart → back to cart
  // ==========================================

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Container className="py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Add some products before checking out.
          </p>
          <Link
            to="/cart"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>
        </Container>
      </div>
    );
  }

  // ==========================================
  // Main
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        <Container className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mb-8">
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-700"
            >
              <ArrowLeft size={16} />
              Back to Cart
            </Link>

            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Checkout
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Complete your order details to place your order.
            </p>
          </div>

          {serverError && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid items-start gap-6 lg:grid-cols-[1fr_380px]"
          >
            {/* ==================================
                SHIPPING ADDRESS
            ================================== */}

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <MapPin size={20} />
                  </span>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Shipping Address
                    </h2>
                    <p className="text-sm text-gray-500">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="grid gap-x-4 sm:grid-cols-2">
                  <FormField
                    label="Full Name"
                    required
                    error={errors.fullName?.message}
                  >
                    <Input
                      placeholder="Full name"
                      {...register("fullName")}
                    />
                  </FormField>

                  <FormField
                    label="Phone"
                    required
                    error={errors.phone?.message}
                  >
                    <Input
                      placeholder="03XX-XXXXXXX"
                      {...register("phone")}
                    />
                  </FormField>

                  <div className="sm:col-span-2">
                    <FormField
                      label="Street Address"
                      required
                      error={errors.address?.message}
                    >
                      <Input
                        placeholder="House no, street, area"
                        {...register("address")}
                      />
                    </FormField>
                  </div>

                  <FormField
                    label="City"
                    required
                    error={errors.city?.message}
                  >
                    <Input
                      placeholder="City"
                      {...register("city")}
                    />
                  </FormField>

                  <FormField
                    label="Province"
                    required
                    error={errors.province?.message}
                  >
                    <select
                      defaultValue=""
                      {...register("province")}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-200 ${
                        errors.province
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="" disabled>
                        Select province
                      </option>
                      {PROVINCES.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField
                    label="Postal Code"
                    error={errors.postalCode?.message}
                  >
                    <Input
                      placeholder="54000"
                      {...register("postalCode")}
                    />
                  </FormField>

                  <FormField
                    label="Country"
                    required
                    error={errors.country?.message}
                  >
                    <Input
                      placeholder="Pakistan"
                      {...register("country")}
                    />
                  </FormField>
                </div>
              </div>

              {/* ==================================
                  PAYMENT
              ================================== */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <Banknote size={20} />
                  </span>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Payment Method
                    </h2>
                    <p className="text-sm text-gray-500">
                      Cash on delivery is currently available.
                    </p>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      defaultChecked
                      className="h-4 w-4 accent-green-700"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      Cash on Delivery (COD)
                    </span>
                  </div>

                  <ShieldCheck
                    size={18}
                    className="text-green-600"
                  />
                </label>
              </div>

              {/* ==================================
                  NOTES
              ================================== */}

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="font-bold text-gray-900">
                  Order Notes (optional)
                </h2>

                <textarea
                  {...register("notes")}
                  rows={3}
                  placeholder="Any delivery instructions..."
                  className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-200"
                />
              </div>
            </div>

            {/* ==================================
                ORDER SUMMARY
            ================================== */}

            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900">
                  Order Summary
                </h2>

                <div className="mt-4">
                  <OrderItemsList items={items} />
                </div>

                <div className="mt-4 space-y-3 border-t border-gray-100 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      Rs. {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery</span>
                    <span
                      className={
                        deliveryFee === 0
                          ? "font-medium text-green-700"
                          : "font-medium text-gray-900"
                      }
                    >
                      {deliveryFee === 0
                        ? "Free"
                        : `Rs. ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-gray-100 pt-3">
                    <span className="font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-xl font-bold text-green-700">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={placing}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {placing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-gray-400">
                  By placing this order you agree to our delivery terms.
                </p>
              </div>
            </div>
          </form>
        </Container>
      </main>
    </div>
  );
}
