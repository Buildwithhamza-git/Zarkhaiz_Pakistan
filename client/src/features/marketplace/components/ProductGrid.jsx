import ProductCard from "./ProductCard";
import ProductHeader from "./ProductHeader";
import Pagination from "./Pagination";
import LoadingProducts from "./LoadingProducts";
import EmptyProducts from "./EmptyProducts";

export default function ProductGrid({
    products,
    loading,
    page,
    perPage,
    total,
    totalPages,
    onPageChange,
    onViewDetails,
    onAddToCart,
}) {
    if (loading) {
        return <LoadingProducts count={perPage} />;
    }

    if (!products || products.length === 0) {
        return <EmptyProducts />;
    }

    return (
        <div>
            <ProductHeader page={page} perPage={perPage} total={total} />

            <div
                className="
                    grid grid-cols-1 gap-4
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    2xl:grid-cols-6
                "
            >
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onViewDetails={onViewDetails}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
    );
}