import { useState, useEffect, useCallback } from "react";
import { getCategories } from "../services/marketplaceApi";

export default function useMarketplaceCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCategories(signal);
      const categoryData = response?.data ?? response?.categories ?? response ?? [];

      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (err) {
      if (err.name === "AbortError") return;

      console.error("Fetch categories error:", err);
      setError(err?.message || "Failed to load categories.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal);

    return () => controller.abort();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}
