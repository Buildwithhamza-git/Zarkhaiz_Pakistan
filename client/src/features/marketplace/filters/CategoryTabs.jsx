import useMarketplaceCategories from "../hooks/useMarketplacecategory";

export default function CategoryTabs({ filters, setFilters }) {
    const { categories, loading } =
        useMarketplaceCategories();

    if (loading) {
        return (
            <div className="flex gap-3 overflow-x-auto pb-1">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="
                            h-11
                            w-28
                            animate-pulse
                            rounded-xl
                            bg-gray-200
                        "
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto pb-1">

            {/* All Categories */}

            <button
                type="button"
                onClick={() =>
                    setFilters((prev) => ({
                        ...prev,
                        category: "",
                    }))
                }
                className={`
                    flex
                    shrink-0
                    items-center
                    gap-2
                    rounded-xl
                    border
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    transition

                    ${
                        filters.category === ""
                            ? "border-green-600 bg-green-600 text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:text-green-700"
                    }
                `}
            >
                All Categories
            </button>


            {/* Backend Categories */}

            {categories.map((category) => (

                <button
                    key={category._id}
                    type="button"
                    onClick={() =>
                        setFilters((prev) => ({
                            ...prev,
                            category: category.slug,
                        }))
                    }
                    className={`
                        flex
                        shrink-0
                        items-center
                        gap-2
                        rounded-xl
                        border
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        transition

                        ${
                            filters.category === category.slug
                                ? "border-green-600 bg-green-600 text-white"
                                : "border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:text-green-700"
                        }
                    `}
                >
                    {category.name}
                </button>

            ))}

        </div>
    );
}