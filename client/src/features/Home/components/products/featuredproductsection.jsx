import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ProductCard from "./productcard";
import { getFeaturedProducts } from "./productdata";
import Loader from "../../../../shared/components/ui/Loader";

export default function FeaturedProductSection() {
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const fetchFeaturedCrops = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getFeaturedProducts();

                if (isMounted) {
                    setCrops(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err?.message || "Failed to load featured crops.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchFeaturedCrops();

        return () => {
            isMounted = false;
        };
    }, []);

    const scrollByCards = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        const cardWidth = container.firstChild
            ? container.firstChild.offsetWidth + 16
            : 240;

        container.scrollBy({
            left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
            behavior: "smooth",
        });
    };

    const goToProducts = () => navigate("/products");

    return (
        <section className="px-4 sm:px-6 lg:px-10 py-8">
            <div className="flex items-center justify-between mb-5">
                <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-900">
                    Featured Crops
                    <Sprout size={20} className="text-green-600" />
                </h2>

                <button
                    type="button"
                    onClick={goToProducts}
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-green-700 transition-colors duration-200"
                >
                    View All
                    <ArrowRight size={15} />
                </button>
            </div>

            {loading && (
                <div className="py-10">
                    <Loader text="Loading featured crops..." />
                </div>
            )}

            {!loading && error && (
                <div className="py-10 text-center text-sm text-red-600">
                    {error}
                </div>
            )}

            {!loading && !error && crops.length === 0 && (
                <div className="py-10 text-center text-sm text-gray-500">
                    No featured crops available right now.
                </div>
            )}

            {!loading && !error && crops.length > 0 && (
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => scrollByCards("left")}
                        aria-label="Scroll left"
                        className="hidden sm:flex lg:hidden absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 items-center justify-center w-9 h-9 rounded-full bg-gray-900/80 text-white hover:bg-gray-900 transition-colors duration-200"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <div
                        ref={scrollRef}
                        className="
                            flex
                            gap-4
                            overflow-x-auto
                            scroll-smooth
                            snap-x
                            snap-mandatory
                            pb-2
                            [&::-webkit-scrollbar]:hidden
                            [-ms-overflow-style:none]
                            [scrollbar-width:none]
                            lg:grid
                            lg:grid-cols-5
                            lg:overflow-visible
                            lg:pb-0
                        "
                    >
                        {crops.map((crop) => (
                            <ProductCard
                                key={crop.id}
                                image={crop.image}
                                name={crop.name}
                                rating={crop.rating}
                                reviewCount={crop.reviewCount}
                                price={crop.price}
                                unit={crop.unit}
                                seller={crop.seller}
                                location={crop.location}
                                onClick={goToProducts}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => scrollByCards("right")}
                        aria-label="Scroll right"
                        className="hidden sm:flex lg:hidden absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 items-center justify-center w-9 h-9 rounded-full bg-gray-900/80 text-white hover:bg-gray-900 transition-colors duration-200"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </section>
    );
}