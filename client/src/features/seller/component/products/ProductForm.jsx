import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../../../shared/components/ui/input";
import Button from "../../../../shared/components/ui/button";

import { productSchema } from "../../validations/product.form.schema";
import { getCategories } from "../../services/categoryApi";

const units = [
  "kg",
  "g",
  "ton",
  "litre",
  "ml",
  "bag",
  "packet",
  "piece",
  "dozen",
];

const statuses = [
  "Active",
  "Inactive",
  "Out of Stock",
];

const ProductForm = ({
  product,
  onSubmit,
  onCancel,
}) => {

  const [categories, setCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
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
  // Image Preview
  // =============================

  const images = watch("images");

  useEffect(() => {

    if (!images || images.length === 0) return;

    const previews = [];

    Array.from(images).forEach(file => {
      previews.push(URL.createObjectURL(file));
    });

    setImagePreviews(previews);

  }, [images]);

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

      if (data.images) {
        Array.from(data.images).forEach(image => {
          formData.append("images", image);
        });
      }

      await onSubmit(formData);

    } finally {

      setLoading(false);

    }

  };

  return (

    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-5"
    >

      {/* Images */}

      <div>

        <label className="mb-2 block text-sm font-semibold">
          Product Images
        </label>

        <input
          type="file"
          multiple
          accept="image/*"
          {...register("images")}
          className="w-full rounded-lg border border-dashed border-gray-300 p-3"
        />

      </div>

      {imagePreviews.length > 0 && (

        <div className="grid grid-cols-5 gap-3">

          {imagePreviews.map((image, index) => (

            <img
              key={index}
              src={image}
              alt="preview"
              className="h-24 w-full rounded-lg border object-cover"
            />

          ))}

        </div>

      )}

      {/* Name */}

      <Input
        label="Product Name"
        {...register("name")}
      />

      <p className="text-sm text-red-500">
        {errors.name?.message}
      </p>

      {/* Description */}

      <div>

        <label className="mb-2 block text-sm font-semibold">
          Description
        </label>

        <textarea
          rows={4}
          {...register("description")}
          className="w-full rounded-lg border border-gray-300 p-3"
        />

        <p className="mt-1 text-sm text-red-500">
          {errors.description?.message}
        </p>

      </div>

      {/* Category + Status */}

      <div className="grid grid-cols-2 gap-5">

        <div>

          <label className="mb-2 block text-sm font-semibold">
            Category
          </label>

          <select
            {...register("category")}
            className="w-full rounded-lg border border-gray-300 p-3"
          >

            <option value="">
              Select Category
            </option>

            {categories.map(category => (

              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>

            ))}

          </select>

          <p className="mt-1 text-sm text-red-500">
            {errors.category?.message}
          </p>

        </div>

        <div>

          <label className="mb-2 block text-sm font-semibold">
            Status
          </label>

          <select
            {...register("status")}
            className="w-full rounded-lg border border-gray-300 p-3"
          >

            {statuses.map(status => (

              <option
                key={status}
                value={status}
              >
                {status}
              </option>

            ))}

          </select>

        </div>

      </div>

      {/* Price Quantity Unit */}

      <div className="grid grid-cols-3 gap-5">

        <div>

          <Input
            label="Price"
            type="number"
            {...register("price")}
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.price?.message}
          </p>

        </div>

        <div>

          <Input
            label="Quantity"
            type="number"
            {...register("quantity")}
          />

          <p className="mt-1 text-sm text-red-500">
            {errors.quantity?.message}
          </p>

        </div>

        <div>

          <label className="mb-2 block text-sm font-semibold">
            Unit
          </label>

          <select
            {...register("unit")}
            className="w-full rounded-lg border border-gray-300 p-3"
          >

            {units.map(unit => (

              <option
                key={unit}
                value={unit}
              >
                {unit}
              </option>

            ))}

          </select>

        </div>

      </div>

      {/* Featured */}

      <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">

        <label className="flex items-start gap-3">

          <input
            type="checkbox"
            {...register("featured")}
            className="mt-1"
          />

          <div>

            <h4 className="font-medium">
              Featured Product
            </h4>

            <p className="text-sm text-gray-600">
              Featured products appear at the top of the marketplace.
              Approval and payment are required before activation.
            </p>

          </div>

        </label>

      </div>

      {/* Buttons */}

      <div className="flex justify-end gap-3">

        <Button
          variant="ghost"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : product
              ? "Update Product"
              : "Add Product"}
        </Button>

      </div>

    </form>

  );

};

export default ProductForm;