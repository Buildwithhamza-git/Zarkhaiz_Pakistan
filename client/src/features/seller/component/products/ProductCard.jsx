import React from "react";
import { Pencil, Trash2, Package, Sparkles } from "lucide-react";

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-gray-100 text-gray-600",
  "Out of Stock": "bg-red-50 text-red-600",
};

const ProductCard = ({ product, onEdit, onDelete }) => {
  const safeProduct = product || {};
 const image =
  safeProduct?.images?.[0]?.url ||
  "https://placehold.co/500x350?text=No+Image";
  const productName = safeProduct.name || "Unnamed Product";
  const categoryName = safeProduct.category?.name || safeProduct.category || "Uncategorized";
  const price = Number(safeProduct.price ?? 0);
  const quantity = Number(safeProduct.stock ?? safeProduct.quantity ?? 0);
  const unit = safeProduct.unit || "unit";
  const status = safeProduct.status || "Active";
  const featured = Boolean(safeProduct.featured);
  const isOutOfStock = quantity <= 0;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img src={image} alt={productName} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {featured && (
            <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-[11px] font-semibold text-yellow-700">
              <Sparkles size={12} />
              Featured
            </div>
          )}
        </div>

        <div className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[status] || statusStyles.Active}`}>
          {status}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-green-700">{categoryName}</p>
        <h3 className="mt-2 min-h-[48px] text-lg font-semibold text-gray-900 line-clamp-2">{productName}</h3>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-green-700">Rs. {price}</p>
            <p className="text-xs text-gray-500">Per {unit}</p>
          </div>
          <div className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            {quantity} {unit}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-600">
          <Package size={15} className="text-green-600" />
          <span>{isOutOfStock ? "Out of stock" : "Ready for customers"}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => onEdit(product)} className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100">
            <Pencil size={15} />
            Edit
          </button>
          <button onClick={() => onDelete(product)} className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100">
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;