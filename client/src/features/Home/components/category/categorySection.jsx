import { Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CategoryCard from "./categorycard";
import { CATEGORIES } from "./categorydata";

export default function CategorySection() {
    const navigate = useNavigate();

    const goToProducts = () => navigate("/products");

    return (
        <section className="px-4 sm:px-6 lg:px-10 pt-24 sm:pt-28 pb-8">
            <h2 className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-bold text-gray-900 mb-8">
                <Sprout size={20} className="text-green-600" />
                Shop by Categories
                <Sprout size={20} className="text-green-600" />
            </h2>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-8 sm:gap-x-8 lg:gap-x-10">
                {CATEGORIES.map((category) => (
                    <CategoryCard
                        key={category.id}
                        name={category.name}
                        image={category.image}
                        onClick={goToProducts}
                    />
                ))}
            </div>
        </section>
    );
}