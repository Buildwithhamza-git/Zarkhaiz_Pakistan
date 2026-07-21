import { createContext, useContext, useEffect, useState } from "react";
import { getSellerDashboard } from "../features/seller/services/sellerApi";

const SellerContext = createContext();

export default function SellerProvider({ children }) {
    const [seller, setSeller] = useState(null);
    
    const [stats, setStats] = useState({products: 0,orders: 0,customers: 0,revenue: 0,});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const refreshDashboard = async () => {
        try {
            setLoading(true);
            const response = await getSellerDashboard();

            setSeller(response.data.seller);
            setStats(response.data.stats);

            setError("");
        } catch (err) {
            setSeller(null);
            setStats(null);

            setError(err.message || "Failed to load seller.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            refreshDashboard();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <SellerContext.Provider
            value={{
                seller,
                stats,
                loading,
                error,
                refreshDashboard,
            }}
        >
            {children}
        </SellerContext.Provider>
    );
}

export const useSellerContext = () => useContext(SellerContext);