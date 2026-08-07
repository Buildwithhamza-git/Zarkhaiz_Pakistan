import StarRating from "./StarRating";

export default function ReviewSummary({
  stats,
  selectedRating = "",
  onSelectRating,
}) {
  const averageRating = stats?.averageRating || 0;
  const totalReviews = stats?.totalReviews || 0;
  const distribution = stats?.distribution || {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex flex-col gap-8 sm:flex-row">
        {/* ============ AVERAGE ============ */}
        <div className="flex shrink-0 flex-col items-center justify-center sm:w-48">
          <p className="text-5xl font-extrabold text-gray-900">
            {averageRating.toFixed(1)}
          </p>

          <div className="mt-2">
            <StarRating rating={averageRating} size={18} />
          </div>

          <p className="mt-2 text-sm text-gray-500">
            {totalReviews}{" "}
            {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* ============ DISTRIBUTION ============ */}
        <div className="w-full flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const percentage = totalReviews
              ? (distribution[star] / totalReviews) * 100
              : 0;

            const isSelected = Number(selectedRating) === star;

            return (
              <button
                key={star}
                type="button"
                onClick={() =>
                  onSelectRating?.(isSelected ? "" : String(star))
                }
                className={`
                  flex w-full items-center gap-3 rounded-lg px-2 py-1
                  transition ${
                    isSelected
                      ? "bg-green-50 ring-1 ring-green-200"
                      : "hover:bg-gray-50"
                  }
                `}
                title={`Filter reviews by ${star} star`}
              >
                <span className="w-6 text-sm font-medium text-gray-600">
                  {star}★
                </span>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-8 text-right text-xs text-gray-400">
                  {distribution[star]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
