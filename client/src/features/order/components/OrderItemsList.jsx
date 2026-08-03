import { formatMoney, getItemTotal } from "../utils/orderDisplay";

const resolveImage = (image) => {
  if (!image) return null;

  if (/^(https?:|data:)/i.test(image)) return image;

  return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${String(
    image
  ).replace(/\\/g, "/").replace(/^\/+/, "")}`;
};

export default function OrderItemsList({ items }) {
  if (!items?.length) {
    return (
      <p className="text-sm text-gray-500">No items in this order.</p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {items.map((item, index) => {
        const imageUrl = resolveImage(item.image);
        const key = item._id || item.product?._id || index;

        return (
          <li
            key={key}
            className="flex items-center gap-4 py-4"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.name || "Product"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                  No image
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-800">
                {item.name}
              </p>

              <p className="mt-0.5 text-xs text-gray-500">
                {item.quantity} × {formatMoney(item.price)}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-gray-800">
                {formatMoney(getItemTotal(item))}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
