import { useState } from "react";
import { Star } from "lucide-react";

export default function RatingInput({
  value = 0,
  onChange,
  size = 32,
  disabled = false,
}) {
  const [hover, setHover] = useState(value);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(value)}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          className="transition-all duration-150 hover:scale-110 disabled:cursor-not-allowed"
        >
          <Star
            size={size}
            className={
              star <= hover
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }
          />
        </button>
      ))}
    </div>
  );
}
