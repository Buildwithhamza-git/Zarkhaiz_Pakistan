import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import Card from "../../../../shared/components/ui/Card";
import Badge from "../../../../shared/components/Badge";

const statusColor = {
  Active: "green",
  Inactive: "gray",
  "Out of Stock": "red",
};

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <Card className="flex flex-col overflow-hidden !p-0">
      <img
        src={product.image || "https://via.placeholder.com/300x200?text=Product"}
        alt={product.name}
        className="h-40 w-full object-cover"
      />

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between">
          <h4 className="font-semibold text-gray-800">{product.name}</h4>
          <Badge color={statusColor[product.status] || "gray"}>
            {product.status}
          </Badge>
        </div>

        <p className="text-sm text-gray-500">{product.category}</p>

        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="font-semibold text-green-700">
            Rs. {product.price}
          </span>
          <span className="text-gray-500">
            Qty: {product.quantity} {product.unit}
          </span>
        </div>

        <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
          <button
            onClick={() => onEdit(product)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </Card>
  );
};
export default ProductCard;