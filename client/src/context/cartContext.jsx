import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
    getCart,
    addToCart as addToCartApi,
    updateCartItem as updateCartItemApi,
    removeCartItem as removeCartItemApi,
    clearCart as clearCartApi,
} from "../features/cart/api/cartApi";

import { useAuthContext } from "./authContext";

const CartContext = createContext(null);

const EMPTY_CART = {
    items: [],
    totalItems: 0,
    subtotal: 0,
};

export default function CartContextProvider({ children }) {
    const navigate = useNavigate();

    const {
        token,
        loading: authLoading,
    } = useAuthContext();

    const [cart, setCart] = useState(EMPTY_CART);

    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] = useState("");


    // ==========================================
    // Require Login
    // ==========================================

    const requireLogin = useCallback(() => {
        if (token) {
            return true;
        }

        navigate("/login", {
            state: {
                from: window.location.pathname,
                message:
                    "Please login to continue.",
            },
        });

        return false;
    }, [token, navigate]);


    // ==========================================
    // Normalize Cart
    // ==========================================

    const normalizeCart = useCallback((data) => {
        const items = Array.isArray(data?.items)
            ? data.items
            : [];

        const totalItems = items.reduce(
            (total, item) =>
                total +
                Number(item.quantity || 0),
            0
        );

        const subtotal = items.reduce(
            (total, item) => {
                const price = Number(
                    item.product?.price ??
                    item.price ??
                    0
                );

                const quantity = Number(
                    item.quantity || 0
                );

                return (
                    total +
                    price * quantity
                );
            },
            0
        );

        return {
            ...data,
            items,
            totalItems,
            subtotal,
        };
    }, []);


    // ==========================================
    // Fetch Cart
    // ==========================================

    const fetchCart = useCallback(async () => {

        if (!token) {
            setCart(EMPTY_CART);
            setLoading(false);

            return null;
        }

        try {
            setLoading(true);
            setError("");

            const response = await getCart();

            const cartData =
                response?.data?.cart ??
                response?.cart ??
                response?.data ??
                EMPTY_CART;

            const normalizedCart =
                normalizeCart(cartData);

            setCart(normalizedCart);

            return normalizedCart;

        } catch (err) {

            console.error(
                "Fetch cart error:",
                err
            );

            setCart(EMPTY_CART);

            setError(
                err?.message ||
                "Failed to load cart."
            );

            return null;

        } finally {
            setLoading(false);
        }

    }, [
        token,
        normalizeCart,
    ]);


    // ==========================================
    // Initialize Cart
    // ==========================================

    useEffect(() => {

        if (authLoading) {
            return;
        }

        fetchCart();

    }, [
        authLoading,
        fetchCart,
    ]);


    // ==========================================
    // Add To Cart
    // ==========================================

    const addToCart = useCallback(
        async (
            productId,
            quantity = 1
        ) => {

            // Redirect to login
            // instead of showing alert

            if (!requireLogin()) {
                return null;
            }

            try {

                setActionLoading(true);
                setError("");

                const response =
                    await addToCartApi(
                        productId,
                        quantity
                    );

                // Always refetch so Navbar badge updates immediately
                await fetchCart();

                return response;

            } catch (err) {

                console.error(
                    "Add to cart error:",
                    err
                );

                setError(
                    err?.message ||
                    "Failed to add product to cart."
                );

                throw err;

            } finally {

                setActionLoading(false);

            }

        },
        [
            requireLogin,
            normalizeCart,
            fetchCart,
        ]
    );


    // ==========================================
    // Remove Item
    // ==========================================

    const removeItem = useCallback(
        async (productId) => {

            // Redirect to login

            if (!requireLogin()) {
                return null;
            }

            try {

                setActionLoading(true);
                setError("");

                const response =
                    await removeCartItemApi(
                        productId
                    );

                // Always refetch so Navbar badge updates immediately
                await fetchCart();

                return response;

            } catch (err) {

                console.error(
                    "Remove cart item error:",
                    err
                );

                setError(
                    err?.message ||
                    "Failed to remove item."
                );

                throw err;

            } finally {

                setActionLoading(false);

            }

        },
        [
            requireLogin,
            normalizeCart,
            fetchCart,
        ]
    );


    // ==========================================
    // Update Quantity
    // ==========================================

    const updateQuantity = useCallback(
        async (
            productId,
            quantity
        ) => {

            // Redirect to login

            if (!requireLogin()) {
                return null;
            }

            const numericQuantity =
                Number(quantity);

            // Quantity below 1
            // means remove item

            if (
                !Number.isInteger(
                    numericQuantity
                ) ||
                numericQuantity < 1
            ) {

                return removeItem(
                    productId
                );

            }

            try {

                setActionLoading(true);
                setError("");

                await updateCartItemApi(
                    productId,
                    numericQuantity
                );

                // Always fetch fresh cart
                // from backend

                const updatedCart =
                    await fetchCart();

                return updatedCart;

            } catch (err) {

                console.error(
                    "Update cart error:",
                    err
                );

                setError(
                    err?.message ||
                    "Failed to update cart."
                );

                throw err;

            } finally {

                setActionLoading(false);

            }

        },
        [
            requireLogin,
            fetchCart,
            removeItem,
        ]
    );


    // ==========================================
    // Clear Cart
    // ==========================================

    const clearCart = useCallback(
        async () => {

            // Redirect to login

            if (!requireLogin()) {
                return null;
            }

            try {

                setActionLoading(true);
                setError("");

                const response =
                    await clearCartApi();

                // Reset to empty and refetch
                setCart(EMPTY_CART);
                await fetchCart();

                return response;

            } catch (err) {

                console.error(
                    "Clear cart error:",
                    err
                );

                setError(
                    err?.message ||
                    "Failed to clear cart."
                );

                throw err;

            } finally {

                setActionLoading(false);

            }

        },
        [
            requireLogin,
            normalizeCart,
        ]
    );


    // ==========================================
    // Clear Error
    // ==========================================

    const clearCartError =
        useCallback(() => {
            setError("");
        }, []);


    // ==========================================
    // Context Value
    // ==========================================

    const value = useMemo(
        () => ({
            // --------------------------
            // Cart
            // --------------------------

            cart,

            items: cart.items,

            // --------------------------
            // Calculations
            // --------------------------

            totalItems:
                cart.totalItems,

            subtotal:
                cart.subtotal,

            // --------------------------
            // Loading
            // --------------------------

            loading,

            actionLoading,

            // --------------------------
            // Error
            // --------------------------

            error,

            // --------------------------
            // Operations
            // --------------------------

            fetchCart,

            addToCart,

            updateQuantity,

            removeItem,

            clearCart,

            clearCartError,
        }),
        [
            cart,
            loading,
            actionLoading,
            error,
            fetchCart,
            addToCart,
            updateQuantity,
            removeItem,
            clearCart,
            clearCartError,
        ]
    );


    // ==========================================
    // Provider
    // ==========================================

    return (
        <CartContext.Provider
            value={value}
        >
            {children}
        </CartContext.Provider>
    );
}


// ==========================================
// useCartContext
// ==========================================

export function useCartContext() {

    const context =
        useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCartContext must be used inside CartContextProvider."
        );
    }

    return context;
}