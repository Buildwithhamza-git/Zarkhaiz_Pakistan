import { ArrowLeft, CheckCircle2, PackageX, ShoppingCart, User } from "lucide-react";

import ProductRating from "./ProductRating";
import ProductBadge from "./ProductBadge";
import Button from "../../../shared/components/ui/button";

function formatPKR(amount) {
    if (amount === null || amount === undefined) return null;
    return new Intl.NumberFormat("en-PK").format(amount);
}

export default function ProductDetails({ product, onBack, onAddToCart }) {
    if (!product) return null;

    const {
        title,
        category,
        image,
        description,
        price,
        oldPrice,
        rating,
        reviews,
        badge,
        stock,
        seller,
        specifications,
    } = product;

    const discountPercent =
        oldPrice && oldPrice > price
            ? Math.round(((oldPrice - price) / oldPrice) * 100)
            : null;

    const isOutOfStock = stock === 0;
    const isLowStock = !isOutOfStock && stock <= 10;

    const handleAddToCart = () => {
        onAddToCart?.(product);
    };

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <button
                type="button"
                onClick={onBack}
                className="
                    mb-5 inline-flex items-center gap-2
                    rounded-lg px-3 py-2 text-sm font-medium text-gray-700
                    transition-colors duration-200
                    hover:bg-gray-100
                    focus:outline-none focus:ring-2 focus:ring-green-500
                "
            >
                <ArrowLeft size={17} />
                Back to Products
            </button>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="relative overflow-hidden rounded-2xl bg-gray-50">
                    <img
                        src={image}
                        alt={title}
                        className="aspect-square w-full object-cover"
                    />

                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {badge === "featured" && <ProductBadge type="featured" />}
                        {discountPercent && (
                            <ProductBadge type="discount" value={discountPercent} />
                        )}
                    </div>
                </div>

                <div className="flex flex-col">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                        {category}
                    </p>

                    <h1 className="mt-1.5 text-2xl font-bold text-gray-900 sm:text-3xl">
                        {title}
                    </h1>

                    <div className="mt-3">
                        <ProductRating rating={rating} reviews={reviews} size={16} />
                    </div>

                    <div className="mt-4 flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-green-700">
                            Rs. {formatPKR(price)}
                        </span>

                        {oldPrice && (
                            <span className="text-lg text-gray-400 line-through">
                                Rs. {formatPKR(oldPrice)}
                            </span>
                        )}
                    </div>

                    <p className="mt-4 leading-relaxed text-gray-600">{description}</p>

                    <div className="mt-5 flex flex-wrap items-center gap-4 border-y border-gray-100 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <User size={15} className="text-gray-400" />
                            <span>
                                Sold by <span className="font-medium text-gray-900">{seller}</span>
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-sm">
                            {isOutOfStock ? (
                                <>
                                    <PackageX size={15} className="text-red-500" />
                                    <span className="font-medium text-red-600">Out of Stock</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2
                                        size={15}
                                        className={isLowStock ? "text-yellow-500" : "text-green-600"}
                                    />
                                    <span
                                        className={`font-medium ${
                                            isLowStock ? "text-yellow-600" : "text-green-700"
                                        }`}
                                    >
                                        {isLowStock ? `Only ${stock} left in stock` : "In Stock"}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {specifications && Object.keys(specifications).length > 0 && (
                        <div className="mt-5">
                            <h2 className="mb-3 text-sm font-semibold text-gray-900">
                                Specifications
                            </h2>

                            <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                                {Object.entries(specifications).map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between border-b border-gray-100 py-1.5 text-sm sm:justify-start sm:gap-2"
                                    >
                                        <dt className="text-gray-500">{key}</dt>
                                        <dd className="font-medium text-gray-900">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            disabled={isOutOfStock}
                            leftIcon={<ShoppingCart size={18} />}
                            onClick={handleAddToCart}
                            className="hover:-translate-y-0.5"
                        >
                            Add To Cart
                        </Button>

                        <Button variant="outline" size="lg" fullWidth onClick={onBack}>
                            Back to Products
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}