import React, { useState } from "react";
import Input from "../ui/input";
import Button from "../ui/button";

const categories = ["Vegetables", "Fruits", "Grains", "Dairy", "Other"];
const statuses = ["Active", "Inactive", "Out of Stock"];
const units = ["kg", "g", "litre", "ml", "piece", "dozen"];

const ProductForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    category: categories[0],
    price: "",
    quantity: "",
    unit: units[0],
    status: statuses[0],
    image: "",
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // clear error for this field as soon as user edits it
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setForm({ ...form, image: url });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Product name must be at least 2 characters";
    } else if (form.name.trim().length > 20) {
      newErrors.name = "Product name must not exceed 20 characters";
    }

    if (form.price === "" || form.price === null) {
      newErrors.price = "Price is required";
    } else if (isNaN(form.price) || Number(form.price) <= 0) {
      newErrors.price = "Price must be a number greater than 0";
    }

    if (form.quantity === "" || form.quantity === null) {
      newErrors.quantity = "Quantity is required";
    } else if (
      isNaN(form.quantity) ||
      Number(form.quantity) < 0 ||
      !Number.isInteger(Number(form.quantity))
    ) {
      newErrors.quantity = "Quantity must be a whole number, 0 or more";
    }

    if (!form.unit) {
      newErrors.unit = "Please select a unit";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Product Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="block w-full text-sm text-gray-600"
        />
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mt-2 h-24 w-24 rounded-lg object-cover"
          />
        )}
      </div>

      <div>
        <Input
          label="Product Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          maxLength={20}
          required
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 py-3 px-4 text-sm text-gray-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            label="Price (Rs.)"
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-600">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 py-3 px-4 text-sm text-gray-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
              required
            />
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 py-3 px-2 text-sm text-gray-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
            >
              {units.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          {errors.quantity && (
            <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 py-3 px-4 text-sm text-gray-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Add Product
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;