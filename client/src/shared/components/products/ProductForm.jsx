import React, { useState } from "react";
import Input from "../ui/input";
import Button from "../ui/button";

const categories = ["Vegetables", "Fruits", "Grains", "Dairy", "Other"];
const statuses = ["Active", "Inactive", "Out of Stock"];

const ProductForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    category: categories[0],
    price: "",
    quantity: "",
    status: statuses[0],
    image: "",
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setForm({ ...form, image: url });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <Input
        label="Product Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />

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
        <Input
          label="Price (Rs.)"
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <Input
          label="Quantity"
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />
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