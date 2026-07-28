import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../../Home/components/Navbar/Navbar";
import HeroSection from "./HeroSection";

import SearchBar from "../filters/SearchBar";
import CategoryTabs from "../filters/CategoryTabs";
import Sidebar from "../filters/Sidebar";

import ProductsPage from "../pages/ProductsPage";

import "../styles/marketplace.css";

const DEFAULT_FILTERS = {
    search: "",
    category: "",
    featured: "",
    minPrice: 0,
    maxPrice: 50000,
    sort: "newest",
    view: "grid",
};

export default function ProductsLayout() {

    const [searchParams, setSearchParams] =
        useSearchParams();


    // =====================================================
    // Read filters from URL
    // =====================================================

    const getFiltersFromUrl = () => {

        return {
            search:
                searchParams.get("search") || "",

            category:
                searchParams.get("category") || "",

            featured:
                searchParams.get("featured") || "",

            minPrice:
                Number(
                    searchParams.get("minPrice") ??
                    DEFAULT_FILTERS.minPrice
                ),

            maxPrice:
                Number(
                    searchParams.get("maxPrice") ??
                    DEFAULT_FILTERS.maxPrice
                ),

            sort:
                searchParams.get("sort") ||
                DEFAULT_FILTERS.sort,

            view:
                searchParams.get("view") ||
                DEFAULT_FILTERS.view,
        };
    };


    // =====================================================
    // Initial filters
    // =====================================================

    const [filters, setFilters] = useState(
        getFiltersFromUrl
    );


    // =====================================================
    // URL → React State
    //
    // This handles:
    // - refresh
    // - browser back
    // - browser forward
    // - manually changing URL
    // =====================================================

    useEffect(() => {

        const urlFilters =
            getFiltersFromUrl();

        setFilters((currentFilters) => {

            if (
                JSON.stringify(currentFilters) ===
                JSON.stringify(urlFilters)
            ) {
                return currentFilters;
            }

            return urlFilters;
        });

    }, [searchParams]);


    // =====================================================
    // React State → URL
    // =====================================================

    useEffect(() => {

        const params = new URLSearchParams();


        // Search

        if (filters.search?.trim()) {

            params.set(
                "search",
                filters.search.trim()
            );

        }


        // Category

        if (filters.category) {

            params.set(
                "category",
                filters.category
            );

        }


        // Featured

        if (filters.featured) {

            params.set(
                "featured",
                filters.featured
            );

        }


        // Minimum price

        if (
            Number(filters.minPrice) !==
            DEFAULT_FILTERS.minPrice
        ) {

            params.set(
                "minPrice",
                filters.minPrice
            );

        }


        // Maximum price

        if (
            Number(filters.maxPrice) !==
            DEFAULT_FILTERS.maxPrice
        ) {

            params.set(
                "maxPrice",
                filters.maxPrice
            );

        }


        // Sort

        if (
            filters.sort !==
            DEFAULT_FILTERS.sort
        ) {

            params.set(
                "sort",
                filters.sort
            );

        }


        // View

        if (
            filters.view !==
            DEFAULT_FILTERS.view
        ) {

            params.set(
                "view",
                filters.view
            );

        }


        // =================================================
        // Update URL
        // =================================================

        setSearchParams(
            params,
            {
                replace: true,
            }
        );

    }, [
        filters,
        setSearchParams,
    ]);


    // =====================================================
    // Scroll to top when marketplace page first opens
    // =====================================================

    useEffect(() => {

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });

    }, []);


    return (

        <div
            className="
                min-h-screen
                bg-[#F8FAF7]
            "
        >

            {/* =========================================
                NAVBAR
            ========================================= */}

            <Navbar />


            {/* =========================================
                HERO
            ========================================= */}

            <HeroSection />


            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    sm:px-6
                    lg:px-8
                "
            >

                {/* =====================================
                    SEARCH + CATEGORIES
                ===================================== */}

                <div
                    className="
                        relative
                        z-10
                        -mt-8
                        space-y-4
                    "
                >

                    <SearchBar
                        filters={filters}
                        setFilters={setFilters}
                    />


                    <CategoryTabs
                        filters={filters}
                        setFilters={setFilters}
                    />

                </div>


                {/* =====================================
                    MARKETPLACE CONTENT
                ===================================== */}

                <div
                    className="
                        flex
                        flex-col
                        gap-6
                        py-8
                        lg:flex-row
                    "
                >

                    {/* =================================
                        SIDEBAR
                    ================================= */}

                    <Sidebar
                        filters={filters}
                        setFilters={setFilters}
                    />


                    {/* =================================
                        PRODUCTS
                    ================================= */}

                    <main
                        className="
                            min-w-0
                            flex-1
                        "
                    >

                        <ProductsPage
                            filters={filters}
                        />

                    </main>

                </div>

            </div>

        </div>
    );
}