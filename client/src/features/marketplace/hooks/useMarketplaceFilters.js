import { useCallback, useMemo } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

export const DEFAULT_FILTERS = {
  search: "",
  category: "",
  featured: "",
  minPrice: "",
  maxPrice: "",
  sort: "latest",
  page: 1,
  view: "grid",
};

// Detect if we are on a product detail page
const isProductDetailRoute = (pathname) =>
  /\/products\/product\//.test(pathname) || /\/products\/[^/]+$/.test(pathname);

export default function useMarketplaceFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract filters from URL
  const filters = useMemo(() => {
    return {
      search: searchParams.get("search") || DEFAULT_FILTERS.search,
      category: searchParams.get("category") || DEFAULT_FILTERS.category,
      featured: searchParams.get("featured") || DEFAULT_FILTERS.featured,
      minPrice: searchParams.get("minPrice") || DEFAULT_FILTERS.minPrice,
      maxPrice: searchParams.get("maxPrice") || DEFAULT_FILTERS.maxPrice,
      sort: searchParams.get("sort") || DEFAULT_FILTERS.sort,
      page: Number(searchParams.get("page")) || DEFAULT_FILTERS.page,
      view: searchParams.get("view") || DEFAULT_FILTERS.view,
    };
  }, [searchParams]);

  // Build a URLSearchParams from filter updates
  const buildNextParams = useCallback(
    (newFilters, currentFilters, prevParams, resetPage = true) => {
      const nextParams = new URLSearchParams(prevParams);

      const updated =
        typeof newFilters === "function" ? newFilters(currentFilters) : newFilters;

      Object.entries(updated).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          !(key === "page" && Number(value) === 1) &&
          !(key === "sort" && value === DEFAULT_FILTERS.sort) &&
          !(key === "view" && value === DEFAULT_FILTERS.view)
        ) {
          nextParams.set(key, String(value));
        } else {
          nextParams.delete(key);
        }
      });

      // Reset page to 1 when non-page filters change
      if (resetPage && updated.page === undefined) {
        nextParams.delete("page");
      }

      return nextParams;
    },
    []
  );

  // Update URL search parameters — if on a product detail page, navigate back to /products
  const updateFilters = useCallback(
    (newFilters, { replace = false, resetPage = true } = {}) => {
      const nextParams = buildNextParams(newFilters, filters, searchParams, resetPage);
      const queryString = nextParams.toString();
      const nextUrl = queryString ? `/products?${queryString}` : "/products";

      if (isProductDetailRoute(location.pathname)) {
        // Navigate back to product list with applied filters
        navigate(nextUrl, { replace });
      } else {
        setSearchParams(nextParams, { replace });
      }
    },
    [filters, searchParams, location.pathname, navigate, setSearchParams, buildNextParams]
  );

  const updateSingleFilter = useCallback(
    (key, value) => {
      updateFilters({ [key]: value });
    },
    [updateFilters]
  );

  const resetFilters = useCallback(() => {
    if (isProductDetailRoute(location.pathname)) {
      navigate("/products", { replace: true });
    } else {
      setSearchParams(new URLSearchParams(), { replace: true });
    }
  }, [location.pathname, navigate, setSearchParams]);

  const setPage = useCallback(
    (pageNumber) => {
      updateFilters({ page: pageNumber }, { resetPage: false });
    },
    [updateFilters]
  );

  return {
    filters,
    setFilters: updateFilters,
    updateSingleFilter,
    resetFilters,
    setPage,
  };
}
