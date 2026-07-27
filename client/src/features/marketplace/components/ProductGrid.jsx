import ProductCard from "./ProductCard";
import ProductHeader from "./ProductHeader";
import Pagination from "./Pagination";
import LoadingProducts from "./LoadingProducts";
import EmptyProducts from "./EmptyProducts";

export default function ProductGrid({
  products,
  loading,
  page,
  perPage = 9,
  total = 0,
  totalPages,
  onPageChange,
  onViewDetails,
  onAddToCart,
  addingToCart = false,
  view = "grid",
}) {
  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return <LoadingProducts count={perPage} />;
  }

  // ==========================================
  // Empty
  // ==========================================

  if (!products || products.length === 0) {
    return <EmptyProducts />;
  }

  // ==========================================
  // Product Grid
  // ==========================================

  return (
    <div className="space-y-6">

      <ProductHeader
        page={page}
        perPage={perPage}
        total={total}
      />

      <div
        className={
          view === "list"
            ? "flex flex-col gap-5"
            : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        }
      >

        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            view={view}
            onViewDetails={onViewDetails}
            onAddToCart={onAddToCart}
            addingToCart={addingToCart}
          />
        ))}

      </div>

      {/* ==========================================
          Pagination
      ========================================== */}

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

    </div>
  );
}