import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Package, Sparkles, UploadCloud } from "lucide-react";

import Button from "../../../../shared/components/ui/button";
import { productSchema } from "../../validations/product.form.schema";
import { getCategories } from "../../services/categoryApi";

const units = ["kg", "g", "ton", "litre", "ml", "bag", "packet", "piece", "dozen"];
const statuses = ["Active", "Inactive", "Out of Stock"];

// 🔥 BACKEND ERROR MAPPER
const mapBackendErrors = (errorResponse) => {
  const fieldErrors = {};

  if (errorResponse?.errors) {
    errorResponse.errors.forEach((err) => {
      const field = err.path?.[0];
      if (field) fieldErrors[field] = err.message;
    });
  }

  return fieldErrors;
};

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

  // 🔥 AUTO SCROLL + FOCUS FIRST ERROR
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
    const selectedFiles = Array.from(e.target.files);

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    const newPreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews((prev) => [...prev, ...newPreviews]);
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

      if (files.length > 0) {
        files.forEach((file) => formData.append("images", file));
      }

      await onSubmit(formData);

    } catch (err) {
      console.log(err);

      const backendErrors = mapBackendErrors(err.response?.data);

      Object.entries(backendErrors).forEach(([field, message]) => {
        setError(field, {
          type: "server",
          message,
        });
      });

      if (!err.response?.data?.errors) {
        alert(err.response?.data?.message || "Something went wrong");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="bg-white">
      {/* UI untouched */}
      <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-linear-to-br from-green-50 to-emerald-50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
              <Package size={20} />
              Product essentials
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Add the core details buyers need to trust and discover your listing.
            </p>
          </div>

          <div className="space-y-4 rounded-3xl border border-gray-200 p-5">
            <div className="flex items-center justify-between ">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Basic information</h3>
                <p className="text-sm text-gray-500">Name, category, and short description.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Product name</label>
              <input
                {...register("name")}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600"
                placeholder="e.g. Premium organic fertilizer"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea
                rows={5}
                {...register("description")}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600"
                placeholder="Tell buyers about quality, delivery, usage, and benefits."
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Category</label>
                <select {...register("category")} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600">
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Status</label>
                <select {...register("status")} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600">
                  {statuses.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Camera size={16} className="text-green-600" />
              Product images
            </div>
            <p className="mt-2 text-sm text-gray-500">Upload clear visuals that help shoppers make faster decisions.</p>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center transition hover:border-green-500 hover:bg-green-50">
              <UploadCloud size={24} className="text-green-600" />
              <span className="mt-3 text-sm font-semibold text-gray-700">Click to upload images</span>
              <span className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP up to 5 images</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>

            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {imagePreviews.map((img, index) => (
                  <div
                    key={`${img}-${index}`}
                    className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white group"
                  >
                    <img
                      src={img}
                      alt={`preview-${index}`}
                      className="h-32 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />

                    {/* REMOVE BUTTON */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Sparkles size={16} className="text-yellow-500" />
              Pricing & stock
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Price</label>
                <input type="number" {...register("price")} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600" />
                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Stock</label>
                <input type="number" {...register("stock")} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600" />
                {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Unit</label>
                <select {...register("unit")} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600">
                  {units.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>

              <div className="space-y-2 rounded-2xl border border-gray-100 bg-gray-50 p-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <input type="checkbox" {...register("featured")} className="h-4 w-4 rounded border-gray-300 text-green-600" />
                  Feature this product
                </label>
                <p className="text-xs text-gray-500">Highlight your product for more visibility in the marketplace.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : product ? "Update product" : "Save product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;