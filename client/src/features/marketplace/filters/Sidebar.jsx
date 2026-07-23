import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import FeaturedFilter from "./FeaturedFilter";

const Sidebar = () => {
  return (
    <aside className="w-full shrink-0 space-y-6 lg:w-72">
      <CategoryFilter />
      <PriceFilter />
      <FeaturedFilter />
    </aside>
  );
};

export default Sidebar;