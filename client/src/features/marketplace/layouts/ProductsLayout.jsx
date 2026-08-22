<<<<<<< HEAD
import { useState } from "react";
=======
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
>>>>>>> origin/hamza

import Navbar from "../../Home/components/Navbar/Navbar";

import HeroSection from "./HeroSection";
import ProductsContent from "./ProductsContent";

import SearchBar from "../filters/SearchBar";
import CategoryTabs from "../filters/CategoryTabs";
import Sidebar from "../filters/Sidebar";

import "../styles/marketplace.css";

<<<<<<< HEAD
export default function ProductsLayout() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    featured: "",
    minPrice: 0,
    maxPrice: 50000,
    sort: "newest",
    view: "grid",
  });

  return (
    <div className="min-h-screen bg-[#F8FAF7]">
      <Navbar />

      <HeroSection />

      <div className="mx-auto max-w-7xl px-6">
        {/* Search */}
        <div className="relative z-10 -mt-8 space-y-4">
=======
const DEFAULT_FILTERS = {
  search: "",
  category: "",
  featured: "",
  minPrice: 0,
  maxPrice: 50000,
  sort: "newest",
  view: "grid",
};

export default function ProductsPage() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  // ==========================================
  // Initial URL -> Filters
  // ==========================================

  const getFiltersFromUrl = () => ({
    search:
      searchParams.get("search") || "",

    category:
      searchParams.get("category") || "",

    featured:
      searchParams.get("featured") || "",

    minPrice: Number(
      searchParams.get("minPrice") ??
        DEFAULT_FILTERS.minPrice
    ),

    maxPrice: Number(
      searchParams.get("maxPrice") ??
        DEFAULT_FILTERS.maxPrice
    ),

    sort:
      searchParams.get("sort") ||
      DEFAULT_FILTERS.sort,

    view:
      searchParams.get("view") ||
      DEFAULT_FILTERS.view,
  });

  const [filters, setFilters] =
    useState(getFiltersFromUrl);

  // ==========================================
  // Track first render
  // ==========================================

  const isFirstRender = useRef(true);

  // ==========================================
  // URL -> React State
  // ==========================================

  useEffect(() => {
    const urlFilters =
      getFiltersFromUrl();

    setFilters((current) => {
      if (
        JSON.stringify(current) ===
        JSON.stringify(urlFilters)
      ) {
        return current;
      }

      return urlFilters;
    });
  }, [searchParams]);

  // ==========================================
  // React State -> URL
  //
  // IMPORTANT:
  // Page is preserved here.
  // ==========================================

  useEffect(() => {
    const params =
      new URLSearchParams();

    // ------------------------------------------
    // Preserve current page
    // ------------------------------------------

    const currentPage =
      searchParams.get("page");

    if (
      currentPage &&
      Number(currentPage) > 1
    ) {
      params.set(
        "page",
        currentPage
      );
    }

    // ------------------------------------------
    // Search
    // ------------------------------------------

    if (filters.search?.trim()) {
      params.set(
        "search",
        filters.search.trim()
      );
    }

    // ------------------------------------------
    // Category
    // ------------------------------------------

    if (filters.category) {
      params.set(
        "category",
        filters.category
      );
    }

    // ------------------------------------------
    // Featured
    // ------------------------------------------

    if (filters.featured) {
      params.set(
        "featured",
        filters.featured
      );
    }

    // ------------------------------------------
    // Minimum price
    // ------------------------------------------

    if (
      Number(filters.minPrice) !==
      DEFAULT_FILTERS.minPrice
    ) {
      params.set(
        "minPrice",
        String(filters.minPrice)
      );
    }

    // ------------------------------------------
    // Maximum price
    // ------------------------------------------

    if (
      Number(filters.maxPrice) !==
      DEFAULT_FILTERS.maxPrice
    ) {
      params.set(
        "maxPrice",
        String(filters.maxPrice)
      );
    }

    // ------------------------------------------
    // Sort
    // ------------------------------------------

    if (
      filters.sort !==
      DEFAULT_FILTERS.sort
    ) {
      params.set(
        "sort",
        filters.sort
      );
    }

    // ------------------------------------------
    // View
    // ------------------------------------------

    if (
      filters.view !==
      DEFAULT_FILTERS.view
    ) {
      params.set(
        "view",
        filters.view
      );
    }

    const nextQuery =
      params.toString();

    const currentQuery =
      searchParams.toString();

    // ------------------------------------------
    // Avoid unnecessary navigation
    // ------------------------------------------

    if (
      nextQuery !== currentQuery
    ) {
      setSearchParams(
        params,
        {
          replace: true,
        }
      );
    }

    isFirstRender.current = false;
  }, [
    filters,
    searchParams,
    setSearchParams,
  ]);

  // ==========================================
  // Reset page when marketplace filters change
  // ==========================================

  const previousFilters = useRef(filters);

  useEffect(() => {
    if (isFirstRender.current) {
      return;
    }

    const previous =
      previousFilters.current;

    const filtersChanged =
      previous.search !== filters.search ||
      previous.category !== filters.category ||
      previous.featured !== filters.featured ||
      Number(previous.minPrice) !==
        Number(filters.minPrice) ||
      Number(previous.maxPrice) !==
        Number(filters.maxPrice) ||
      previous.sort !== filters.sort;

    if (filtersChanged) {
      const currentPage =
        Number(searchParams.get("page"));

      if (
        Number.isInteger(currentPage) &&
        currentPage > 1
      ) {
        const params =
          new URLSearchParams(
            searchParams
          );

        params.delete("page");

        setSearchParams(
          params,
          {
            replace: true,
          }
        );
      }
    }

    previousFilters.current =
      filters;
  }, [
    filters,
    searchParams,
    setSearchParams,
  ]);

  // ==========================================
  // Scroll to top on initial marketplace load
  // ==========================================

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="min-h-screen bg-[#F8FAF7]">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <Navbar />

      {/* ======================================
          HERO
      ====================================== */}

      <HeroSection />

      {/* ======================================
          MARKETPLACE CONTAINER
      ====================================== */}

      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        "
      >

        {/* ====================================
            SEARCH + CATEGORY TABS
        ==================================== */}

        <div
          className="
            relative
            z-10
            -mt-8
            space-y-4
          "
        >

>>>>>>> origin/hamza
          <SearchBar
            filters={filters}
            setFilters={setFilters}
          />

          <CategoryTabs
            filters={filters}
            setFilters={setFilters}
          />
<<<<<<< HEAD
        </div>

        {/* Main Layout */}
        <div className="flex gap-6 py-8">

          {/* Left Sidebar */}
          <Sidebar
            filters={filters}
            setFilters={setFilters}
          />

          {/* Products */}
          <main className="flex-1">
            <ProductsPage
              filters={filters}
            />
          </main>

        </div>
      </div>
=======

        </div>

        {/* ====================================
            MARKETPLACE CONTENT
        ==================================== */}

        <div
          className="
            flex
            flex-col
            gap-6
            py-8
            lg:flex-row
          "
        >

          {/* ==================================
              SIDEBAR FILTERS
          ================================== */}

          <Sidebar
            filters={filters}
            setFilters={setFilters}
          />

          {/* ==================================
              PRODUCTS
          ================================== */}

          <main className="min-w-0 flex-1">

            <ProductsContent
              filters={filters}
            />

          </main>

        </div>

      </div>

>>>>>>> origin/hamza
    </div>
  );
}