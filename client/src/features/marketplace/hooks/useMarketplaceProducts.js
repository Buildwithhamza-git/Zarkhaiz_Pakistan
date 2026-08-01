import { useState, useEffect, useCallback, useRef } from "react";
import { getProducts, getProduct } from "../services/marketplaceApi";

const PRODUCTS_PER_PAGE = 9;

export default function useMarketplaceProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    page: filters.page || 1,
    total: 0,
    totalPages: 1,
    limit: PRODUCTS_PER_PAGE,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const activeControllerRef = useRef(null);

  // ==========================================
  // Fetch Products
  // ==========================================
  const fetchProducts = useCallback(async () => {
    // Cancel previous request if still running
    if (activeControllerRef.current) {
      activeControllerRef.current.abort();
    }

    const controller = new AbortController();
    activeControllerRef.current = controller;

    try {
      setLoading(true);
      setError("");

      const params = {
        page: filters.page || 1,
        limit: PRODUCTS_PER_PAGE,
        search: filters.search || "",
        category: filters.category || "",
        featured: filters.featured || "",
        minPrice: filters.minPrice || "",
        maxPrice: filters.maxPrice || "",
        sort: filters.sort || "latest",
      };

      const response = await getProducts(params, controller.signal);

      const productData = response?.data ?? response?.products ?? [];
      const paginationData = response?.pagination ?? {};

      setProducts(Array.isArray(productData) ? productData : []);

      setPagination({
        page: paginationData.currentPage ?? paginationData.page ?? filters.page ?? 1,
        total: paginationData.totalProducts ?? paginationData.total ?? productData.length,
        totalPages: paginationData.totalPages ?? 1,
        limit: paginationData.limit ?? PRODUCTS_PER_PAGE,
      });
    } catch (err) {
      if (err.name === "AbortError") return;

      console.error("Fetch products error:", err);
      setProducts([]);
      setPagination({
        page: 1,
        total: 0,
        totalPages: 1,
        limit: PRODUCTS_PER_PAGE,
      });
      setError(err?.message || "Unable to load products from server.");
    } finally {
      if (activeControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, [
    filters.page,
    filters.search,
    filters.category,
    filters.featured,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
  ]);

  useEffect(() => {
    fetchProducts();

    return () => {
      if (activeControllerRef.current) {
        activeControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  // ==========================================
  // Fetch Single Product Details
  // ==========================================
  const fetchProductDetails = useCallback(async (productId) => {
    if (!productId) {
      setSelectedProduct(null);
      return;
    }

    const controller = new AbortController();

    try {
      setDetailsLoading(true);
      setDetailsError("");

      const response = await getProduct(productId, controller.signal);
      const product = response?.data ?? response?.product ?? response;

      setSelectedProduct(product || null);
    } catch (err) {
      if (err.name === "AbortError") return;

      console.error("Fetch product details error:", err);
      setSelectedProduct(null);
      setDetailsError(err?.message || "Product not found.");
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    pagination,
    selectedProduct,
    detailsLoading,
    detailsError,
    fetchProduct: fetchProductDetails,
    refreshProducts: fetchProducts,
  };
}
