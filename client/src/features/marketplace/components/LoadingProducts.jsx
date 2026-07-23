function SkeletonCard() {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
            <div className="aspect-square w-full animate-pulse bg-gray-100" />

            <div className="flex flex-col gap-2 p-3.5">
                <div className="h-2.5 w-16 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                <div className="h-5 w-1/3 animate-pulse rounded bg-gray-100" />
                <div className="mt-1 h-9 w-full animate-pulse rounded-lg bg-gray-100" />
            </div>
        </div>
    );
}

export default function LoadingProducts({ count = 12 }) {
    return (
        <div
            className="
                grid grid-cols-1 gap-4
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                2xl:grid-cols-6
            "
        >
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}