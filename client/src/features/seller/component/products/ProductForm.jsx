import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../../../shared/components/ui/input";
import Button from "../../../../shared/components/ui/button";

import { productSchema } from "../../validations/product.form.schema";
import { getCategories } from "../../services/categoryApi";

const units = [
  "kg","g","ton","litre","ml","bag","packet","piece","dozen",
];

const statuses = [
  "Active","Inactive","Out of Stock",
];

const ProductForm = ({ product, onSubmit, onCancel }) => {

  const [categories, setCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ FILE STATE (IMPORTANT FIX)
  const [files, setFiles] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      quantity: "",
      unit: "kg",
      status: "Active",
      featured: false,
    },
  });

  // =============================
  // Load Categories
  // =============================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  // =============================
  // Edit Mode
  // =============================
  useEffect(() => {

    if (!product) {
      reset({
        name: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
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
      quantity: product.quantity,
      unit: product.unit,
      status: product.status,
      featured: product.featured,
    });

    if (product.images?.length) {
      setImagePreviews(product.images);
    }

  }, [product, reset]);

  // =============================
  // Image Change
  // =============================
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    console.log("FILES SELECTED:", selectedFiles);

    setFiles(selectedFiles);

    const previews = selectedFiles.map(file =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);
  };

  // =============================
  // Submit
  // =============================
  const submitHandler = async (data) => {

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("price", data.price);
      formData.append("quantity", data.quantity);
      formData.append("unit", data.unit);
      formData.append("status", data.status);
      formData.append("featured", data.featured);

      // ✅ APPEND IMAGES FROM STATE (FINAL FIX)
      if (files.length > 0) {
        files.forEach(file => {
          formData.append("images", file);
        });
      }

      // ✅ DEBUG
      console.log("FORMDATA:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      await onSubmit(formData);

    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">

      {/* Images */}
      <div>
        <label className="mb-2 block text-sm font-semibold">
          Product Images
        </label>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {/* Preview */}
      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-5 gap-3">
          {imagePreviews.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="preview"
              className="h-24 w-full rounded-lg border object-cover"
            />
          ))}
        </div>
      )}

      {/* Name */}
      <Input label="Product Name" {...register("name")} />
      <p className="text-sm text-red-500">{errors.name?.message}</p>

      {/* Description */}
      <textarea
        rows={4}
        {...register("description")}
        className="w-full border p-3"
      />
      <p className="text-sm text-red-500">{errors.description?.message}</p>

      {/* Category */}
      <select {...register("category")} className="w-full border p-3">
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Price & Quantity */}
      <Input type="number" label="Price" {...register("price")} />
      <Input type="number" label="Quantity" {...register("quantity")} />

      {/* Unit */}
      <select {...register("unit")} className="w-full border p-3">
        {units.map(u => <option key={u}>{u}</option>)}
      </select>

      {/* Status */}
      <select {...register("status")} className="w-full border p-3">
        {statuses.map(s => <option key={s}>{s}</option>)}
      </select>

      {/* Featured */}
      <label className="flex gap-2">
        <input type="checkbox" {...register("featured")} />
        Featured Product
      </label>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Product"}
        </Button>
      </div>

    </form>
  );
};

export default ProductForm;