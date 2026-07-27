import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import FeaturedFilter from "./FeaturedFilter";

export default function Sidebar({ filters, setFilters }) {
  return (
    <aside className="w-full lg:w-[260px] shrink-0 space-y-5">

      <CategoryFilter
        filters={filters}
        setFilters={setFilters}
      />

      <PriceFilter
        filters={filters}
        setFilters={setFilters}
      />

      <FeaturedFilter
        filters={filters}
        setFilters={setFilters}
      />

    </aside>
  );
}