import { createContext, useContext, useEffect, useState } from "react";

import {
  getProducts,
  getCategories,
} from "../features/marketplace/services/marketplaceApi";

const MarketplaceContext = createContext();

export default function MarketplaceProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    featured: "",
    minPrice: "",
    maxPrice: "",
    sort: "latest",
    page: 1,
    limit: 12,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 12,
  });

  // ==========================
  // Categories
  // ==========================

  const fetchCategories = async () => {
    try {
      const response = await getCategories();

      setCategories(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================
  // Products
  // ==========================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await getProducts(filters);

      setProducts(response.data || []);

      setPagination(
        response.pagination || {
          page: 1,
          totalPages: 1,
          total: 0,
          limit: 12,
        }
      );
    } catch (error) {
      console.error(error);

      setProducts([]);

      setPagination({
        page: 1,
        totalPages: 1,
        total: 0,
        limit: 12,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        categories,
        loading,

        filters,
        setFilters,

        pagination,

        fetchProducts,
        fetchCategories,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export const useMarketplace = () =>
  useContext(MarketplaceContext);