import { Grid2x2, ChevronRight } from "lucide-react";
import useMarketplaceCategories from "../hooks/useMarketplaceCategories";

export default function CategoryFilter({ filters, setFilters }) {
  const { categories = [], loading } = useMarketplaceCategories();

  const CategoryItem = ({ category, level = 0 }) => {
    if (!category) return null;

    const isActive = filters.category === category.slug;
    const hasChildren = Array.isArray(category.children) && category.children.length > 0;

    return (
      <div>
        <button
          type="button"
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              category: isActive ? "" : category.slug,
            }))
          }
          className={`
            group
            flex
            w-full
            items-center
            gap-2.5
            rounded-xl
            py-2
            pr-2
            text-left
            transition-all
            duration-200

            ${
              isActive
                ? "bg-green-50 font-semibold text-green-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
            }
          `}
          style={{
            paddingLeft: `${8 + level * 16}px`,
          }}
        >
          {/* Icon */}
          <span
            className={`
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-lg
              transition
              ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-50 text-gray-400 group-hover:bg-green-50 group-hover:text-green-600"
              }
            `}
          >
            <Grid2x2 size={14} />
          </span>

          {/* Name */}
          <span className="min-w-0 flex-1 truncate text-sm">
            {category.name}
          </span>

          {/* Child indicator */}
          {hasChildren && (
            <ChevronRight
              size={14}
              className="
                shrink-0
                text-gray-300
                transition-transform
                group-hover:translate-x-0.5
              "
            />
          )}
        </button>

        {/* Children */}
        {hasChildren && (
          <div className="space-y-0.5">
            {category.children.map((child) => (
              <CategoryItem
                key={child._id || child.id || child.slug}
                category={child}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 h-6 w-32 animate-pulse rounded-lg bg-gray-200" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-9 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-base font-bold tracking-tight text-gray-900">
          Categories
        </h3>
        <p className="mt-1 text-xs text-gray-400">
          Browse agricultural products
        </p>
      </div>

      <div className="space-y-1">
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
            group
            flex
            w-full
            items-center
            gap-2.5
            rounded-xl
            py-2
            pr-2
            text-left
            transition-all
            duration-200

            ${
              !filters.category
                ? "bg-green-50 font-semibold text-green-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
            }
          `}
        >
          <span
            className={`
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-lg

              ${
                !filters.category
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-50 text-gray-400 group-hover:bg-green-50 group-hover:text-green-600"
              }
            `}
          >
            <Grid2x2 size={14} />
          </span>

          <span className="text-sm">All Categories</span>
        </button>

        {/* Category Tree */}
        <div className="mt-1 space-y-0.5">
          {safeCategories.map((category) => (
            <CategoryItem
              key={category._id || category.id || category.slug}
              category={category}
            />
          ))}
        </div>
      </div>
    </div>
  );
}