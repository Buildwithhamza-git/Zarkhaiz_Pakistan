import { useCallback, useEffect, useState } from "react";

import { getSellerWishlistStats } from "../api/wishlistApi";

export function useSellerWishlistStats() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getSellerWishlistStats();
      const data = response?.data;

      setItems(data?.items || []);
      setTotal(data?.total || 0);
    } catch (err) {
      setError(err?.message || "Failed to load wishlist stats.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    items,
    total,
    loading,
    error,
    refetch,
  };
}
