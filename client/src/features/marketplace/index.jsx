import { useEffect, useState } from "react";

import ProductGrid from "./components/ProductGrid";
import ProductDetails from "./components/ProductDetails";
import ProductAddedModal from "./components/ProductAddedModal";
import { getProducts, PRODUCTS_PER_PAGE } from "./data/products";

export default function ProductsContent() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showCartModal, setShowCartModal] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            setLoading(true);

            const data = await getProducts({ page, perPage: PRODUCTS_PER_PAGE });

            if (isMounted) {
                setProducts(data.items);
                setPagination({ total: data.total, totalPages: data.totalPages });
                setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, [page]);

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
    };

    const handleBackToGrid = () => {
        setSelectedProduct(null);
    };

    const handlePageChange = (nextPage) => {
        if (nextPage < 1 || nextPage > pagination.totalPages) return;
        setPage(nextPage);
        setSelectedProduct(null);
    };

    const handleAddToCart = () => {
        setShowCartModal(true);
    };

    const handleCloseCartModal = () => {
        setShowCartModal(false);
    };

    return (
        <div className="flex-1">
            {selectedProduct ? (
                <ProductDetails
                    product={selectedProduct}
                    onBack={handleBackToGrid}
                    onAddToCart={handleAddToCart}
                />
            ) : (
                <ProductGrid
                    products={products}
                    loading={loading}
                    page={page}
                    perPage={PRODUCTS_PER_PAGE}
                    total={pagination.total}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    onViewDetails={handleViewDetails}
                    onAddToCart={handleAddToCart}
                />
            )}

            <ProductAddedModal open={showCartModal} onClose={handleCloseCartModal} />
        </div>
    );
}