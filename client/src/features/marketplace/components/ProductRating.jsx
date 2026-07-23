import { Star } from "lucide-react";

export default function ProductRating({ rating = 0, reviews, size = 14, showReviews = true }) {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
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

            <span className="text-xs font-medium text-gray-600">{rating.toFixed(1)}</span>

            {showReviews && reviews !== undefined && (
                <span className="text-xs text-gray-400">({reviews})</span>
            )}
        </div>
    );
}