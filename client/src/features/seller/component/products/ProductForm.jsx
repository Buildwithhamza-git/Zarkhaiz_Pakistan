import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ChevronDown,
  ImagePlus,
  Info,
  Package,
  Save,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";

import Button from "../../../../shared/components/ui/button";
import { productSchema } from "../../validations/product.form.schema";
import { getCategories } from "../../services/categoryApi";

const units = ["kg", "g", "ton", "litre", "ml", "bag", "packet", "piece", "dozen"];
const statuses = ["Active", "Inactive", "Out of Stock"];
const MAX_IMAGES = 5;

// =============================
// Backend error mapper
// =============================

const mapBackendErrors = (errorResponse) => {
  const fieldErrors = {};

  if (errorResponse?.errors) {
    errorResponse.errors.forEach((err) => {
      const field = err.field || err.path?.[0];
      if (field) fieldErrors[field] = err.message;
    });
  }

  return fieldErrors;
};

// =============================
// Small presentational helpers
// =============================

const Field = ({ label, required, hint, error, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-baseline justify-between">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {hint && <span className="text-xs text-gray-400">{hint}</span>}
    </div>
    {children}
    {error && (
      <p className="flex items-center gap-1 text-xs font-medium text-red-500">
        <AlertCircle size={13} />
        {error}
      </p>
    )}
  </div>
);

const inputClass = (hasError) => `
  w-full
  rounded-xl
  border
  bg-white
  px-4
  py-2.5
  text-sm
  text-gray-900
  outline-none
  transition
  duration-200
  placeholder:text-gray-400
  ${
    hasError
      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
      : "border-gray-200 hover:border-gray-300 focus:border-green-600 focus:ring-4 focus:ring-green-100"
  }
`;

const selectClass = (hasError) => `
  ${inputClass(hasError)}
  appearance-none
  pr-10
  cursor-pointer
`;

const SectionHeader = ({ step, icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-sm shadow-green-600/25">
      <Icon size={18} />
    </span>
    <div>
      <h3 className="text-sm font-semibold text-gray-900">
        <span className="mr-1.5 text-gray-400">{step}.</span>
        {title}
      </h3>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);

// =============================
// Main form
// =============================

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      unit: "kg",
      status: "Active",
      featured: false,
    },
  });

  const nameCount = useWatch({ control, name: "name" })?.trim().length || 0;
  const descriptionCount =
    useWatch({ control, name: "description" })?.trim().length || 0;

  // Auto scroll + focus first error
  useEffect(() => {
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      const el = document.querySelector(`[name="${firstError}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setFocus(firstError);
      }
    }
  }, [errors, setFocus]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!product) {
      reset({
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        unit: "kg",
        status: "Active",
        featured: false,
      });
      setImagePreviews([]);
      setFiles([]);
      return;
    }

    reset({
      name: product.name,
      description: product.description,
      category: product.category?._id,
      price: product.price,
      stock: product.stock ?? product.quantity,
      unit: product.unit,
      status: product.status,
      featured: product.featured,
    });

    if (product.images?.length) {
      const imgs = product.images.map((img) =>
        typeof img === "string" ? img : img.url
      );
      setImagePreviews(imgs);
    }
  }, [product, reset]);

  const handleRemoveImage = (index) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);

    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(
      0,
      Math.max(0, MAX_IMAGES - imagePreviews.length)
    );

    if (selectedFiles.length === 0) return;

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    const newPreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  const submitHandler = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("stock", data.stock);
      formData.append("unit", data.unit);
      formData.append("status", data.status);
      formData.append("featured", data.featured);

      // Preserve existing images (only the ones still shown, i.e. non-blob URLs)
      const existingImages = imagePreviews.filter(
        (img) => !img.startsWith("blob:")
      );

      if (existingImages.length > 0) {
        formData.append(
          "existingImages",
          JSON.stringify(existingImages)
        );
      }

      if (files.length > 0) {
        files.forEach((file) => formData.append("images", file));
      }

      await onSubmit(formData);

    } catch (err) {
      console.log(err);

      // authFetch throws the response body directly
      const backendErrors = mapBackendErrors(err);

      Object.entries(backendErrors).forEach(([field, message]) => {
        setError(field, {
          type: "server",
          message,
        });
      });

      if (!err?.errors) {
        alert(err?.message || "Something went wrong");
      }

    } finally {
      setLoading(false);
    }
  };

  const isFull = imagePreviews.length >= MAX_IMAGES;

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      noValidate
      className="bg-white"
    >
      {/* ============================
          Form intro
      ============================ */}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-1 pb-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-green-50 text-green-700">
            <Package size={22} />
          </span>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {product ? "Update your product" : "Create a new product"}
            </h3>
            <p className="text-xs text-gray-500">
              Fill in the details below. Fields marked{" "}
              <span className="font-medium text-red-500">*</span> are required.
            </p>
          </div>
        </div>
      </div>

      {/* ============================
          1. Basic information
      ============================ */}

      <section className="mt-6 space-y-5">
        <SectionHeader
          step={1}
          icon={Tag}
          title="Basic information"
          subtitle="What are you selling?"
        />

        <div className="grid gap-5">
          <Field
            label="Product name"
            required
            error={errors.name?.message}
            hint={`${nameCount}/100`}
          >
            <input
              {...register("name")}
              className={inputClass(!!errors.name)}
              placeholder="e.g. Premium organic fertilizer"
              maxLength={100}
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Category" required error={errors.category?.message}>
              <div className="relative">
                <select
                  {...register("category")}
                  className={selectClass(!!errors.category)}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </Field>

            <Field label="Status">
              <div className="relative">
                <select {...register("status")} className={selectClass(false)}>
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </Field>
          </div>

          <Field
            label="Description"
            required
            error={errors.description?.message}
            hint={`${descriptionCount}/3000`}
          >
            <textarea
              rows={4}
              {...register("description")}
              className={`${inputClass(!!errors.description)} resize-none`}
              placeholder="Tell buyers about quality, delivery, usage, and benefits."
              maxLength={3000}
            />
          </Field>
        </div>
      </section>

      {/* ============================
          2. Pricing & stock
      ============================ */}

      <section className="mt-8 space-y-5">
        <SectionHeader
          step={2}
          icon={Sparkles}
          title="Pricing & stock"
          subtitle="Set the price, quantity and availability."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Price" required error={errors.price?.message}>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-medium text-gray-400">
                Rs.
              </span>
              <input
                type="number"
                min="1"
                step="any"
                {...register("price")}
                className={`${inputClass(!!errors.price)} pl-12`}
                placeholder="0"
              />
            </div>
          </Field>

          <Field label="Stock" required error={errors.stock?.message}>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1"
                {...register("stock")}
                className={`${inputClass(!!errors.stock)} pr-12`}
                placeholder="0"
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-gray-400">
                qty
              </span>
            </div>
          </Field>

          <Field label="Unit" error={errors.unit?.message}>
            <div className="relative">
              <select {...register("unit")} className={selectClass(!!errors.unit)}>
                {units.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </Field>

          <Field label="Visibility">
            <label className="flex h-full min-h-[42px] cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 transition hover:border-green-300">
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  Feature this product
                </span>
                <span className="block text-xs text-gray-500">
                  More visibility in the marketplace.
                </span>
              </div>
              <input
                type="checkbox"
                {...register("featured")}
                className="peer sr-only"
              />
              <span className="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors duration-200 peer-checked:bg-green-600">
                <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
              </span>
            </label>
          </Field>
        </div>
      </section>

      {/* ============================
          3. Product images
      ============================ */}

      <section className="mt-8 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <SectionHeader
            step={3}
            icon={ImagePlus}
            title="Product images"
            subtitle="Show your product clearly to build trust."
          />
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isFull
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {imagePreviews.length}/{MAX_IMAGES}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {imagePreviews.map((img, index) => (
            <div
              key={`${img}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
            >
              <img
                src={img}
                alt={`preview-${index}`}
                className="h-full w-full object-cover"
              />

              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                aria-label={`Remove image ${index + 1}`}
                className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-red-500 text-white shadow-sm transition hover:bg-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {!isFull && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-center transition hover:border-green-500 hover:bg-green-50">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-green-100 text-green-700">
                <ImagePlus size={20} />
              </span>
              <span className="text-xs font-semibold text-gray-700">
                Add more
              </span>
              <span className="px-3 text-[11px] text-gray-500">
                PNG, JPG or WEBP
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {isFull && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-green-700">
            <Info size={14} />
            Maximum {MAX_IMAGES} images reached. Remove one to add another.
          </p>
        )}
      </section>

      {/* ============================
          Footer actions
      ============================ */}

      <div className="sticky bottom-0 z-10 -mx-6 mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 bg-white/95 px-6 py-4 backdrop-blur sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          leftIcon={<X size={16} />}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          leftIcon={loading ? null : <Save size={16} />}
        >
          {loading
            ? "Saving..."
            : product
              ? "Update product"
              : "Save product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
