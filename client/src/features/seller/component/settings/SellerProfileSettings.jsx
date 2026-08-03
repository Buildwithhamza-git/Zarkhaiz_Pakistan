import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  Loader2,
  Save,
  Store,
  CreditCard,
  ShieldCheck,
  Lock,
} from "lucide-react";

import { useSellerContext } from "../../../../context/sellerContext";
import { updateSellerProfile } from "../../services/sellerApi";
import { sellerProfileSettingsSchema } from "../../validations/sellerSettings.schema";
import Button from "../../../../shared/components/ui/button";
import ImageUpload from "../../../../shared/components/ui/imageUploader";

const PROVINCES = [
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "Gilgit Baltistan",
  "AJK",
];

const defaultValues = {
  logo: "",
  storeName: "",
  description: "",
  province: "",
  city: "",
  address: "",
  bankName: "",
  accountTitle: "",
  iban: "",
  jazzCash: "",
  easyPaisa: "",
};

const inputClass = (hasError) => `
  mt-2 w-full rounded-xl border p-3 outline-none transition
  ${
    hasError
      ? "border-red-500"
      : "border-gray-300 focus:border-green-600"
  }
`;

const formatCNIC = (cnic) => {
  if (!cnic) return "";
  return cnic.length === 13
    ? `${cnic.slice(0, 5)}-${cnic.slice(5, 12)}-${cnic.slice(12)}`
    : cnic;
};

export default function SellerProfileSettings() {
  const { seller, loading, refreshSeller } = useSellerContext();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(sellerProfileSettingsSchema),
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    if (seller) {
      reset({
        logo: seller.logo || "",
        storeName: seller.storeName || "",
        description: seller.description || "",
        province: seller.province || "",
        city: seller.city || "",
        address: seller.address || "",
        bankName: seller.bankName || "",
        accountTitle: seller.accountTitle || "",
        iban: seller.iban || "",
        jazzCash: seller.jazzCash || "",
        easyPaisa: seller.easyPaisa || "",
      });
    }
  }, [seller, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      if (data.logo instanceof File) {
        formData.append("logo", data.logo);
      }

      const textFields = [
        "storeName",
        "description",
        "province",
        "city",
        "address",
        "bankName",
        "accountTitle",
        "iban",
        "jazzCash",
        "easyPaisa",
      ];

      textFields.forEach((key) => {
        formData.append(key, data[key] ?? "");
      });

      await updateSellerProfile(formData);

      await refreshSeller();

      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err?.message || "Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin text-green-700" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-gray-500">
          Seller profile not found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
          <Store size={22} />
        </span>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Profile Settings
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Update your store and payment details.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        {/* ==========================================
            STORE INFORMATION
        ========================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-700">
              <Store size={18} />
            </span>
            <div>
              <h2 className="font-bold text-gray-900">
                Store Information
              </h2>
              <p className="text-xs text-gray-500">
                This is shown on your public store page.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <ImageUpload
                label="Store Logo"
                value={watch("logo")}
                onChange={(file) =>
                  setValue("logo", file, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                error={errors.logo?.message}
              />
            </div>

            <div>
              <label className="font-medium">Store Name</label>
              <input
                type="text"
                placeholder="Green Valley Store"
                {...register("storeName")}
                className={inputClass(errors.storeName)}
              />
              {errors.storeName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.storeName.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium">Province</label>
              <select
                {...register("province")}
                className={inputClass(errors.province)}
              >
                <option value="">Select Province</option>
                {PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.province.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium">City</label>
              <input
                type="text"
                placeholder="Lahore"
                {...register("city")}
                className={inputClass(errors.city)}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium">Store Address</label>
              <input
                type="text"
                placeholder="Shop #12, Main Bazaar"
                {...register("address")}
                className={inputClass(errors.address)}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="font-medium">
                Store Description
              </label>
              <textarea
                rows="4"
                {...register("description")}
                placeholder="Write a short description about your store..."
                className={`${inputClass(errors.description)} resize-none`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ==========================================
            BUSINESS & VERIFICATION (READ ONLY)
        ========================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <ShieldCheck size={18} />
            </span>
            <div>
              <h2 className="font-bold text-gray-900">
                Business &amp; Verification
              </h2>
              <p className="text-xs text-gray-500">
                Identity details cannot be changed after approval.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="font-medium">Business Type</label>
              <input
                type="text"
                value={seller.businessType || ""}
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="font-medium">CNIC</label>
              <input
                type="text"
                value={formatCNIC(seller.cnic) || ""}
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-500 outline-none"
              />
            </div>
          </div>

          <p className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <Lock size={13} />
            To change these, contact support.
          </p>
        </section>

        {/* ==========================================
            PAYMENT DETAILS
        ========================================== */}

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-700">
              <CreditCard size={18} />
            </span>
            <div>
              <h2 className="font-bold text-gray-900">
                Payment Details
              </h2>
              <p className="text-xs text-gray-500">
                Where payouts are sent. Provide bank, JazzCash or
                EasyPaisa.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="font-medium">Bank Name</label>
              <input
                type="text"
                placeholder="Meezan Bank"
                {...register("bankName")}
                className={inputClass(errors.bankName)}
              />
              {errors.bankName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.bankName.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium">Account Title</label>
              <input
                type="text"
                placeholder="John Doe"
                {...register("accountTitle")}
                className={inputClass(errors.accountTitle)}
              />
              {errors.accountTitle && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.accountTitle.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium">IBAN</label>
              <input
                type="text"
                placeholder="PK36MEZN0000000000000000"
                {...register("iban")}
                className={inputClass(errors.iban)}
              />
              {errors.iban && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.iban.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium">JazzCash</label>
              <input
                type="text"
                placeholder="03XXXXXXXXX"
                {...register("jazzCash")}
                className={inputClass(errors.jazzCash)}
              />
              {errors.jazzCash && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.jazzCash.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium">EasyPaisa</label>
              <input
                type="text"
                placeholder="03XXXXXXXXX"
                {...register("easyPaisa")}
                className={inputClass(errors.easyPaisa)}
              />
              {errors.easyPaisa && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.easyPaisa.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ==========================================
            ACTIONS
        ========================================== */}

        <div className="flex justify-end">
          <Button
            type="submit"
            size="md"
            className="px-8"
            loading={isSubmitting}
            disabled={!isDirty || isSubmitting}
            leftIcon={<Save size={17} />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
