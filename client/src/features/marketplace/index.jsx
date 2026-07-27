import { useEffect, useState } from "react";

import ProductGrid from "./components/ProductGrid";
import ProductDetails from "./components/ProductDetails";
import ProductAddedModal from "./components/ProductAddedModal";

import { getProducts } from "./services/marketplaceApi";

const PRODUCTS_PER_PAGE = 12;

export default function ProductsContent({ filters }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    page: 1,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showCartModal, setShowCartModal] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // ======================================
  // Debounced Search
  // ======================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // ======================================
  // Reset page whenever filters change
  // ======================================

  useEffect(() => {
    setPage(1);
  }, [
    filters.category,
    filters.featured,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    debouncedSearch,
  ]);

  // ======================================
  // Fetch Products
  // ======================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await getProducts({
          page,
          limit: PRODUCTS_PER_PAGE,
          search: debouncedSearch,
          category: filters.category,
          featured: filters.featured,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sort: filters.sort,
        });

        console.log("Marketplace Response:", response);

        setProducts(response.data ?? []);

        setPagination({
          page: response.pagination?.page ?? 1,
          total: response.pagination?.total ?? 0,
          totalPages: response.pagination?.totalPages ?? 1,
        });
      } catch (error) {
        console.error("Failed to fetch products:", error);

        setProducts([]);

        setPagination({
          page: 1,
          total: 0,
          totalPages: 1,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    page,
    debouncedSearch,
    filters.category,
    filters.featured,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
  ]);

  // ======================================
  // Product Details
  // ======================================

  const handleViewDetails = (product) => {

    console.log("Selected Product", product);
    setSelectedProduct(product);
  };

  const handleBack = () => {
    setSelectedProduct(null);
  };

  // ======================================
  // Pagination
  // ======================================

  const handlePageChange = (nextPage) => {
    if (nextPage < 1) return;

    if (nextPage > pagination.totalPages) return;

    setPage(nextPage);

    setSelectedProduct(null);

    window.scrollTo({
      top: 250,
      behavior: "smooth",
    });
  };

  return (
    <>
      {selectedProduct ? (
        <ProductDetails
          product={selectedProduct}
          onBack={handleBack}
          onAddToCart={() => setShowCartModal(true)}
        />
      ) : (
        <ProductGrid
          products={products}
          loading={loading}
          page={pagination.page}
          total={pagination.total}
          totalPages={pagination.totalPages}
          view={filters.view}
          onPageChange={handlePageChange}
          onViewDetails={handleViewDetails}
          onAddToCart={() => setShowCartModal(true)}
        />
      )}

      <ProductAddedModal
        open={showCartModal}
        onClose={() => setShowCartModal(false)}
      />
    </>
  );
}