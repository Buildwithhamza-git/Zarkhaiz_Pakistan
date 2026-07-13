import { MapPin, ShoppingCart, User, Star } from "lucide-react";

function RatingStars({ rating = 0, reviewCount, size = 14 }) {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {stars.map((star) => (
                    <Star
                        key={star}
                        size={size}
                        className={
                            star <= Math.round(rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                        }
                    />
                ))}
            </div>

            {reviewCount !== undefined && (
                <span className="text-xs text-gray-500">({reviewCount})</span>
            )}
        </div>
    );
}

export default function ProductCard({
    image,
    name,
    rating,
    reviewCount,
    price,
    unit = "kg",
    seller,
    location,
    onClick,
    onAddToCart,
}) {
    const handleAddToCart = (e) => {
        e.stopPropagation();
        onAddToCart?.();
    };

    return (
        <article
            onClick={onClick}
            className="
                w-[210px]
                sm:w-[220px]
                md:w-[230px]
                lg:w-full
                flex-shrink-0
                lg:flex-shrink
                snap-start
                rounded-2xl
                border
                border-gray-100
                bg-white
                shadow-sm
                overflow-hidden
                cursor-pointer
                transition-all
                duration-200
                hover:shadow-lg
                hover:-translate-y-0.5
            "
        >
            <img
                src={image}
                alt={name}
                className="h-36 sm:h-40 w-full object-cover"
                loading="lazy"
            />

            <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-base truncate">
                    {name}
                </h3>

                <div className="mt-1.5">
                    <RatingStars rating={rating} reviewCount={reviewCount} />
                </div>

                <p className="mt-2 text-green-700 font-bold text-lg">
                    Rs. {price} / {unit}
                </p>

                <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <User size={13} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{seller}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 min-w-0">
                            <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">{location}</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            aria-label={`Add ${name} to cart`}
                            className="
                                flex-shrink-0
                                flex
                                items-center
                                justify-center
                                w-9
                                h-9
                                rounded-lg
                                bg-green-700
                                text-white
                                hover:bg-green-800
                                transition-colors
                                duration-200
                            "
                        >
                            <ShoppingCart size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}