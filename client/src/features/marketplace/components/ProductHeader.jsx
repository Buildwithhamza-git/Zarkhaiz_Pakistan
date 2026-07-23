export default function ProductHeader({ page, perPage, total }) {
    if (!total) return null;

    const start = (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, total);

    return (
        <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                    {start} – {end}
                </span>{" "}
                of <span className="font-semibold text-gray-900">{total}</span> products
            </p>
        </div>
    );
}