import {
    ArrowRight,
    Leaf,
    Sprout,
    Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import CategoryCard from "./categorycard";
import { CATEGORIES } from "./categorydata";

export default function CategorySection() {
    const navigate = useNavigate();

    const goToProducts = () => {
        navigate("/products");
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-green-50/40 to-white px-4 py-20 sm:px-6 lg:px-10">

            {/* Background decoration */}

            <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-green-200/30 blur-3xl" />

            <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-lime-200/30 blur-3xl" />


            <div className="relative mx-auto max-w-7xl">

                {/* Header */}

                <div className="mx-auto max-w-2xl text-center">

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">

                        <Sparkles
                            size={14}
                            className="text-lime-600"
                        />

                        Explore Zarkhaiz Marketplace

                    </div>


                    <div className="flex items-center justify-center gap-3">

                        <Leaf
                            size={20}
                            className="hidden text-green-600 sm:block"
                        />

                        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">

                            Shop by{" "}

                            <span className="text-green-700">
                                Category
                            </span>

                        </h2>

                        <Leaf
                            size={20}
                            className="hidden text-green-600 sm:block"
                        />

                    </div>


                    <p className="mt-4 text-sm leading-6 text-gray-500 sm:text-base">
                        Discover quality agricultural products from trusted
                        sellers and find everything you need to grow better.
                    </p>

                </div>


                {/* Categories */}

                <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

                    {Array.isArray(CATEGORIES) &&
                        CATEGORIES.map((category) => (

                            <CategoryCard
                                key={category.id}
                                name={category.name}
                                image={category.image}
                                onClick={goToProducts}
                            />

                        ))}

                </div>


                {/* CTA */}

                <div className="mt-12 flex justify-center">

                    <button
                        type="button"
                        onClick={goToProducts}
                        className="
                            group
                            inline-flex
                            items-center
                            gap-3
                            rounded-full
                            bg-green-700
                            px-6
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            shadow-lg
                            transition
                            hover:bg-green-800
                            active:scale-95
                        "
                    >

                        <Sprout size={18} />

                        Browse All Products

                        <ArrowRight
                            size={17}
                            className="transition-transform group-hover:translate-x-1"
                        />

                    </button>

                </div>


                {/* Trust section */}

                <div className="
                    mx-auto
                    mt-12
                    flex
                    max-w-3xl
                    flex-col
                    items-center
                    justify-center
                    gap-5
                    rounded-3xl
                    border
                    border-green-100
                    bg-white
                    px-6
                    py-5
                    shadow-sm
                    sm:flex-row
                    sm:gap-8
                ">

                    <div className="flex items-center gap-3">

                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-green-100
                        ">
                            <Sprout
                                size={18}
                                className="text-green-700"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-900">
                                Agriculture Focused
                            </p>

                            <p className="text-[11px] text-gray-500">
                                Products for every grower
                            </p>
                        </div>

                    </div>


                    <div className="hidden h-8 w-px bg-gray-200 sm:block" />


                    <div className="flex items-center gap-3">

                        <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-lime-100
                        ">
                            <Leaf
                                size={18}
                                className="text-lime-700"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-900">
                                Trusted Marketplace
                            </p>

                            <p className="text-[11px] text-gray-500">
                                Connecting buyers & sellers
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}