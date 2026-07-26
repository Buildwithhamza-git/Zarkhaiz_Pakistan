import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getCurrentSeller,
    getSellerDashboard,
} from "../features/seller/services/sellerApi";

import { useAuthContext } from "./authContext";

const SellerContext = createContext();

const defaultStats = {
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
    pendingOrders: 0,
};

export default function SellerProvider({ children }) {

    const {
        token,
        loading: authLoading,
    } = useAuthContext();

    const [seller, setSeller] = useState(null);

    const [stats, setStats] =
        useState(defaultStats);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // ==========================================
    // Seller Status
    // ==========================================

    const isSeller = !!seller;

    const isApproved =
        seller?.status === "approved";

    const isPending =
        seller?.status === "pending";

    const isRejected =
        seller?.status === "rejected";

    // ==========================================
    // Reset Seller
    // ==========================================

    const resetSeller = () => {

        setSeller(null);

        setStats(defaultStats);

        setError("");

    };

    // ==========================================
    // Refresh Seller
    // ==========================================

    const refreshSeller = async () => {

        try {

            setError("");

            const response =
                await getCurrentSeller();

            const sellerData =
                response?.data?.seller || null;

            setSeller(sellerData);

            return sellerData;

        } catch (err) {

            console.error(
                "Failed to fetch current seller:",
                err
            );

            /*
             * IMPORTANT:
             *
             * Only treat 404 as "user has no seller
             * application".
             *
             * Do NOT automatically clear seller for
             * network/server errors.
             */

            const status =
                err?.status ||
                err?.response?.status;

            if (status === 404) {

                setSeller(null);

                return null;

            }

            /*
             * For 401/403 and server/network errors,
             * don't immediately pretend the user is
             * not a seller.
             */

            setError(
                err?.message ||
                "Unable to verify seller account."
            );

            throw err;

        }

    };

    // ==========================================
    // Refresh Dashboard
    // ==========================================

    const refreshDashboard = async () => {

        try {

            const response =
                await getSellerDashboard();

            setStats(
                response?.data?.stats ||
                defaultStats
            );

        } catch (err) {

            console.error(
                "Failed to load seller dashboard:",
                err
            );

        }

    };

    // ==========================================
    // Initialize Seller
    // ==========================================

    useEffect(() => {

        /*
         * Wait until AuthContext has restored
         * localStorage authentication.
         */

        if (authLoading) {

            return;

        }

        const initialize = async () => {

            setLoading(true);

            setError("");

            try {

                /*
                 * User is not authenticated.
                 */

                if (!token) {

                    resetSeller();

                    return;

                }

                /*
                 * Get seller information.
                 */

                const sellerData =
                    await refreshSeller();

                /*
                 * Only approved sellers need
                 * dashboard statistics.
                 */

                if (
                    sellerData?.status ===
                    "approved"
                ) {

                    await refreshDashboard();

                }

            } catch (err) {

                /*
                 * Do NOT call resetSeller() here.
                 *
                 * If the server is temporarily unavailable,
                 * we don't want to turn an approved seller
                 * into "not a seller".
                 */

                console.error(
                    "Seller initialization failed:",
                    err
                );

            } finally {

                setLoading(false);

            }

        };

        initialize();

    }, [
        token,
        authLoading,
    ]);

    return (

        <SellerContext.Provider
            value={{

                seller,

                stats,

                loading,

                error,

                isSeller,

                isApproved,

                isPending,

                isRejected,

                refreshSeller,

                refreshDashboard,

                resetSeller,

            }}
        >

            {children}

        </SellerContext.Provider>

    );

}

export const useSellerContext =
    () => useContext(SellerContext);