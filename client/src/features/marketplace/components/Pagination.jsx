import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageNumbers(current, total) {
    const pages = [];
    const window = 1;

    for (let i = 1; i <= total; i++) {
        const isEdge = i === 1 || i === total;
        const isNearCurrent = Math.abs(i - current) <= window;

        if (isEdge || isNearCurrent) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== "...") {
            pages.push("...");
        }
    }

    return pages;
}

export default function Pagination({ page, totalPages, onPageChange }) {
    if (!totalPages || totalPages <= 1) return null;

    const pages = getPageNumbers(page, totalPages);

    return (
        <nav
            aria-label="Products pagination"
            className="mt-8 flex items-center justify-center gap-1.5"
        >
            <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
                className="
                    flex h-9 w-9 items-center justify-center rounded-lg
                    border border-gray-200 text-gray-600
                    transition-colors duration-200
                    hover:bg-gray-50
                    disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent
                "
            >
                <ChevronLeft size={16} />
            </button>

            {pages.map((p, i) =>
                p === "..." ? (
                    <span
                        key={`ellipsis-${i}`}
                        className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        onClick={() => onPageChange(p)}
                        aria-current={p === page ? "page" : undefined}
                        className={`
                            flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium
                            transition-colors duration-200
                            ${
                                p === page
                                    ? "bg-green-700 text-white shadow-sm"
                                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                            }
                        `}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
                className="
                    flex h-9 w-9 items-center justify-center rounded-lg
                    border border-gray-200 text-gray-600
                    transition-colors duration-200
                    hover:bg-gray-50
                    disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent
                "
            >
                <ChevronRight size={16} />
            </button>
        </nav>
    );
}