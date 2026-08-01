import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AlertCircle, RefreshCw } from "lucide-react";

import ProductGrid from "../components/ProductGrid";
import ProductDetails from "../components/ProductDetails";
import LoadingProducts from "../components/LoadingProducts";

import useMarketplaceProducts from "../hooks/useMarketplaceProducts";
import { useCartContext } from "../../../context/cartContext";
import { useAuthContext } from "../../../context/authContext";

export default function ProductsContent({ filters, setPage }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { id: productId } = useParams();

  const { addToCart } = useCartContext();
  const { token } = useAuthContext();

  const {
    products,
    loading,
    error,
    pagination,
    selectedProduct,
    fetchProduct,
    detailsLoading,
    detailsError,
    refreshProducts,
  } = useMarketplaceProducts(filters);

  const [addingToCartId, setAddingToCartId] = useState(null);

  // ==========================================
  // Scroll to top on filter or page change
  // ==========================================
  const prevFiltersRef = useRef(null);

  useEffect(() => {
    const filtersStr = JSON.stringify(filters);
    if (prevFiltersRef.current !== null && prevFiltersRef.current !== filtersStr) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    prevFiltersRef.current = filtersStr;
  }, [filters]);

  // Scroll to top when product detail opens or closes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  // ==========================================
  // Load Product Details when productId changes
  // ==========================================
  useEffect(() => {
    if (!productId) return;
    fetchProduct(productId);
  }, [productId, fetchProduct]);

  // ==========================================
  // Navigation handlers
  // ==========================================
  const handleViewDetails = (product) => {
    const id = product._id || product.id;
    navigate(`/products/product/${id}`, {
      state: { returnTo: location.pathname + location.search },
    });
  };

  const handleBack = () => {
    if (location.state?.returnTo) {
      navigate(location.state.returnTo);
    } else {
      navigate("/products");
    }
  };

  // ==========================================
  // Add to Cart handler
  // ==========================================
  const handleAddToCart = async (product, quantity = 1) => {
    const pId = product._id || product.id;
    if (!pId) return;

    // Redirect to login if not authenticated
    if (!token) {
      navigate("/login", {
        state: {
          from: location.pathname + location.search,
          message: "Please login to add items to your cart.",
        },
      });
      return;
    }

    try {
      setAddingToCartId(pId);
      await addToCart(pId, quantity);
      toast.success("Product added to cart successfully!");
    } catch (err) {
      const message = err?.message || "";

      if (message === "You cannot purchase your own product.") {
        toast.error("You cannot buy your own product! 🚫");
      } else if (message.includes("out of stock")) {
        toast.error("Sorry, this product is out of stock.");
      } else if (message.includes("units are available")) {
        toast.error(message);
      } else {
        toast.error(message || "Failed to add product to cart.");
      }
    } finally {
      setAddingToCartId(null);
    }
  };

  // ==========================================
  // Pagination with scroll to top
  // ==========================================
  const handlePageChange = (page) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ==========================================
  // Product Detail Loading State
  // ==========================================
  if (productId && detailsLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
        <p className="mt-4 text-sm font-medium text-gray-600">Loading product details...</p>
      </div>
    );
  }

  // ==========================================
  // Product Detail Error State
  // ==========================================
  if (productId && detailsError) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50 p-8 text-center text-red-700">
        <AlertCircle size={40} className="mb-3 text-red-500" />
        <h3 className="text-lg font-bold">Product Not Found</h3>
        <p className="mt-1 text-sm text-red-600">{detailsError}</p>
        <button
          onClick={handleBack}
          className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  // ==========================================
  // Product Details View
  // ==========================================
  if (productId && selectedProduct) {
    return (
      <ProductDetails
        product={selectedProduct}
        onBack={handleBack}
        onAddToCart={handleAddToCart}
        addingToCart={addingToCartId === (selectedProduct._id || selectedProduct.id)}
      />
    );
  }

  // ==========================================
  // Products Error State
  // ==========================================
  if (error) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <AlertCircle size={32} />
        </div>
        <h3 className="mt-4 text-lg font-bold text-gray-900">Failed to Load Products</h3>
        <p className="mt-1 max-w-md text-sm text-gray-500">{error}</p>
        <button
          onClick={refreshProducts}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  // ==========================================
  // Products Grid View
  // ==========================================
  return (
    <ProductGrid
      products={products}
      loading={loading}
      page={pagination.page}
      perPage={pagination.limit}
      total={pagination.total}
      totalPages={pagination.totalPages}
      view={filters.view || "grid"}
      onPageChange={handlePageChange}
      onViewDetails={handleViewDetails}
      onAddToCart={handleAddToCart}
      addingToCart={addingToCartId}
    />
  );
}