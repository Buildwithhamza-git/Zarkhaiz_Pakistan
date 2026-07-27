import { Grid2x2 } from "lucide-react";
import useMarketplaceCategories from "../hooks/useMarketplacecategory";

export default function CategoryFilter({ filters, setFilters }) {

    const {
        categories,
        loading,
    } = useMarketplaceCategories();

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-5">
                    Categories
                </h3>

                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="h-9 rounded-lg bg-gray-200 animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

            <h3 className="font-bold text-lg text-gray-900 mb-5">
                Categories
            </h3>

            <div className="space-y-1">

                {/* All Categories */}

                <button
                    onClick={() =>
                        setFilters((prev) => ({
                            ...prev,
                            category: "",
                        }))
                    }
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition
                        ${
                            filters.category === ""
                                ? "bg-green-50 text-green-700"
                                : "hover:bg-gray-50 text-gray-700"
                        }`}
                >
                    <Grid2x2 size={16} />

                    <span className="text-sm">
                        All Categories
                    </span>

                </button>

                {/* Backend Categories */}

                {categories.map((category) => (

                    <button
                        key={category._id}
                        onClick={() =>
                            setFilters((prev) => ({
                                ...prev,
                                category: category._id,
                            }))
                        }
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition
                            ${
                                filters.category === category._id
                                    ? "bg-green-50 text-green-700"
                                    : "hover:bg-gray-50 text-gray-700"
                            }`}
                    >
                        <Grid2x2 size={16} />

                        <span className="text-sm">
                            {category.name}
                        </span>

                    </button>

                ))}

            </div>

        </div>
    );
}