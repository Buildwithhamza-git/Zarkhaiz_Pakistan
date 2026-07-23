import { SearchX } from "lucide-react";

export default function EmptyProducts({
    title = "No products found",
    message = "Try adjusting your filters or search term to find what you're looking for.",
}) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
                <SearchX size={26} />
            </div>

            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            <p className="mt-1.5 max-w-sm text-sm text-gray-500">{message}</p>
        </div>
    );
}
