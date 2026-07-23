import React from "react";
import {
  Pencil,
  Trash2,
  Package,
  Star,
} from "lucide-react";

const statusStyles = {
  Active:
    "bg-green-100 text-green-700",

  Inactive:
    "bg-gray-100 text-gray-600",

  "Out of Stock":
    "bg-red-100 text-red-600",
};

const ProductCard = ({
  product,
  onEdit,
  onDelete,
}) => {
  const image =
    product.images?.[0] ||
    "https://placehold.co/500x350?text=No+Image";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* Image */}

      <div className="relative">

        <img
          src={image}
          alt={product.name}
          className="h-44 w-full object-cover"
        />

        {product.featured && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
            <Star
              size={13}
              fill="currentColor"
            />
            Featured
          </div>
        )}

        <div
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
            statusStyles[
              product.status
            ]
          }`}
        >
          {product.status}
        </div>

      </div>

      {/* Content */}

      <div className="space-y-3 p-4">

        <div>

          <h2 className="truncate text-lg font-semibold text-gray-800">
            {product.name}
          </h2>

          <p className="text-sm text-gray-500">
            {product.category?.name ||
              product.category}
          </p>

        </div>

        {/* Price */}

        <div className="flex items-center justify-between">

          <span className="text-2xl font-bold text-green-700">
            Rs. {product.price}
          </span>

          <span className="text-gray-500">
            / {product.unit}
          </span>

        </div>

        {/* Stock */}

        <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">

          <Package
            size={18}
            className="text-gray-500"
          />

          <span className="text-sm text-gray-600">

            Stock

          </span>

          <span className="ml-auto font-semibold text-gray-800">

            {product.quantity}{" "}
            {product.unit}

          </span>

        </div>

        {/* Actions */}

        <div className="grid grid-cols-2 gap-3 pt-1">

          <button
            onClick={() =>
              onEdit(product)
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-2 font-medium text-green-700 transition hover:bg-green-100"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            onClick={() =>
              onDelete(product)
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2 font-medium text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={16} />
            Delete
          </button>

        </div>

      </div>

    </div>
  );
};

export default ProductCard;