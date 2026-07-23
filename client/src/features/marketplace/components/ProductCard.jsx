import { Eye, PackageX, ShoppingCart } from "lucide-react";

import ProductBadge from "./ProductBadge";
import ProductRating from "./ProductRating";

function formatPKR(amount) {
    if (amount === null || amount === undefined) return null;
    return new Intl.NumberFormat("en-PK").format(amount);
}

export default function ProductCard({ product, onViewDetails, onAddToCart }) {
    const {
        title,
        category,
        image,
        price,
        oldPrice,
        rating,
        reviews,
        badge,
        stock,
    } = product;

    const discountPercent =
        oldPrice && oldPrice > price
            ? Math.round(((oldPrice - price) / oldPrice) * 100)
            : null;

    const isOutOfStock = stock === 0;

    const handleViewDetails = () => {
        onViewDetails?.(product);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        onAddToCart?.(product);
    };

    return (
        <article
            className="
                group flex flex-col
                rounded-2xl border border-gray-100 bg-white
                shadow-sm overflow-hidden
                transition-all duration-300
                hover:shadow-lg hover:-translate-y-1 hover:border-gray-200
            "
        >
            <div className="relative overflow-hidden aspect-square bg-gray-50">
                <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    className="
                        h-full w-full object-cover
                        transition-transform duration-500 ease-out
                        group-hover:scale-110
                    "
                />

                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                    {badge === "featured" && <ProductBadge type="featured" />}
                    {discountPercent && (
                        <ProductBadge type="discount" value={discountPercent} />
                    )}
                </div>

                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
                        <span className="flex items-center gap-1.5 rounded-md bg-gray-900/85 px-3 py-1.5 text-xs font-semibold text-white">
                            <PackageX size={14} />
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-green-700">
                    {category}
                </p>

                <h3 className="line-clamp-1 text-sm font-semibold text-gray-900" title={title}>
                    {title}
                </h3>

                <ProductRating rating={rating} reviews={reviews} />

                <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-base font-bold text-green-700">
                        Rs. {formatPKR(price)}
                    </span>

                    {oldPrice && (
                        <span className="text-xs text-gray-400 line-through">
                            Rs. {formatPKR(oldPrice)}
                        </span>
                    )}
                </div>

                <div className="mt-2.5 flex items-stretch gap-2">
                    <button
                        type="button"
                        onClick={handleViewDetails}
                        disabled={isOutOfStock}
                        className="
                            flex-[3] inline-flex items-center justify-center gap-1.5
                            rounded-lg border border-green-700
                            px-3 py-2 text-sm font-medium text-green-700
                            transition-colors duration-200
                            hover:bg-green-700 hover:text-white
                            disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent
                            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
                        "
                    >
                        <Eye size={15} />
                        View Details
                    </button>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        aria-label={`Add ${title} to cart`}
                        className="
                            flex-1 inline-flex items-center justify-center
                            rounded-lg bg-green-700 text-white
                            transition-all duration-200
                            hover:bg-green-800 active:scale-95
                            disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:active:scale-100
                            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
                        "
                    >
                        <ShoppingCart size={17} />
                    </button>
                </div>
            </div>
        </article>
    );
}