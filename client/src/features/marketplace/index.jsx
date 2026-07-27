import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductGrid from "./components/ProductGrid";
import ProductDetails from "./components/ProductDetails";
import ProductAddedModal from "./components/ProductAddedModal";

import { getProducts } from "./services/marketplaceApi";

import { useCartContext } from "../../context/cartContext";

const PRODUCTS_PER_PAGE = 9;

export default function ProductsContent({ filters, setFilters }) {
  const { slug } = useParams();

  // ======================================
  // Cart
  // ======================================

  const {
    addToCart,
    actionLoading,
  } = useCartContext();

  // ======================================
  // Products
  // ======================================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    page: 1,
  });

  // ======================================
  // Product Details
  // ======================================

  const [selectedProduct, setSelectedProduct] = useState(null);

  // ======================================
  // Cart Modal
  // ======================================

  const [showCartModal, setShowCartModal] = useState(false);

  // ======================================
  // Search
  // ======================================

  const [debouncedSearch, setDebouncedSearch] = useState(
    filters.search
  );

  // ======================================
  // URL Category → Filters
  // ======================================

  useEffect(() => {
    if (slug) {
      setFilters((prev) => ({
        ...prev,
        category: slug,
      }));
    }
  }, [slug, setFilters]);

  // ======================================
  // Debounce Search
  // ======================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // ======================================
  // Reset Page When Filters Change
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
          page:
            response.pagination?.page ??
            response.pagination?.currentPage ??
            1,

          total:
            response.pagination?.total ??
            response.pagination?.totalProducts ??
            0,

          totalPages:
            response.pagination?.totalPages ?? 1,
        });
      } catch (error) {
        console.error(
          "Failed to fetch products:",
          error
        );

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
  // View Product Details
  // ======================================

  const handleViewDetails = (product) => {
    console.log("Selected Product:", product);

    setSelectedProduct(product);
  };

  // ======================================
  // Back From Details
  // ======================================

  const handleBack = () => {
    setSelectedProduct(null);
  };

  // ======================================
  // Add Product To Cart
  // ======================================

  const handleAddToCart = async (product) => {
    if (!product?._id) {
      console.error(
        "Cannot add product: product ID is missing.",
        product
      );

      return;
    }

    try {
      console.log(
        "Adding product to cart:",
        product._id
      );

      await addToCart(product._id, 1);

      setShowCartModal(true);
    } catch (error) {
      console.error(
        "Failed to add product to cart:",
        error
      );

      alert(
        error?.message ||
          "Unable to add this product to cart."
      );
    }
  };

  // ======================================
  // Pagination
  // ======================================

  const handlePageChange = (nextPage) => {
    if (nextPage < 1) return;

    if (nextPage > pagination.totalPages) {
      return;
    }

    setPage(nextPage);

    setSelectedProduct(null);

    window.scrollTo({
      top: 250,
      behavior: "smooth",
    });
  };

  // ======================================
  // Render
  // ======================================

  return (
    <>
      {selectedProduct ? (
        <ProductDetails
          product={selectedProduct}
          onBack={handleBack}
          onAddToCart={handleAddToCart}
          addingToCart={actionLoading}
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
          onAddToCart={handleAddToCart}
          addingToCart={actionLoading}
        />
      )}

      <ProductAddedModal
        open={showCartModal}
        onClose={() => setShowCartModal(false)}
      />
    </>
  );
}