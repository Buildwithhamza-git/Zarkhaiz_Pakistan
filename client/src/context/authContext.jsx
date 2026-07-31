import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {

    const [user, setUserState] = useState(null);

    const [seller, setSellerState] = useState(null);

    const [token, setToken] = useState(null);

    const [loading, setLoading] = useState(true);

    const [sellerLoading, setSellerLoading] = useState(false);


    // ==========================================
    // SAVE USER
    // ==========================================

    const setUser = (userData) => {

        if (userData) {

            localStorage.setItem(
                "user",
                JSON.stringify(userData)
            );

        } else {

            localStorage.removeItem("user");

        }

        setUserState(userData);
    };


    // ==========================================
    // SAVE SELLER
    // ==========================================

    const setSeller = (sellerData) => {

        if (sellerData) {

            localStorage.setItem(
                "seller",
                JSON.stringify(sellerData)
            );

        } else {

            localStorage.removeItem("seller");

        }

        setSellerState(sellerData);
    };


    // ==========================================
    // FETCH CURRENT SELLER
    // ==========================================

    const fetchCurrentSeller = async () => {

        if (!token) {
            setSeller(null);
            return;
        }

        setSellerLoading(true);

        try {

            /*
             * IMPORTANT:
             * Change "/seller/me" if your actual
             * backend route is different.
             */

            const response =
                await api.get("/seller/me");

            console.log(
                "CURRENT SELLER RESPONSE:",
                response.data
            );

            const sellerData =
                response.data?.data?.seller || null;

            setSeller(sellerData);

        } catch (error) {

            /*
             * 404 / 401 / no seller means
             * the user simply isn't a seller.
             */

            if (
                error.response?.status === 404 ||
                error.response?.status === 401
            ) {

                setSeller(null);

            } else {

                console.error(
                    "Failed to fetch seller:",
                    error
                );

            }

        } finally {

            setSellerLoading(false);

        }
    };


    // ==========================================
    // RESTORE AUTHENTICATION
    // ==========================================

    useEffect(() => {

        const restoreAuth = async () => {

            try {

                const savedUser =
                    localStorage.getItem("user");

                const savedToken =
                    localStorage.getItem("token");

                const savedSeller =
                    localStorage.getItem("seller");


                if (
                    savedUser &&
                    savedToken
                ) {

                    const parsedUser =
                        JSON.parse(savedUser);

                    setUserState(parsedUser);

                    setToken(savedToken);


                    /*
                     * Temporarily restore seller
                     * from localStorage.
                     */

                    if (savedSeller) {

                        setSellerState(
                            JSON.parse(savedSeller)
                        );

                    }

                }

            } catch (error) {

                console.error(
                    "Failed to restore authentication:",
                    error
                );

                localStorage.removeItem("user");
                localStorage.removeItem("token");
                localStorage.removeItem("seller");

                setUserState(null);
                setSellerState(null);
                setToken(null);

            } finally {

                setLoading(false);

            }

        };

        restoreAuth();

    }, []);


    // ==========================================
    // FETCH SELLER AFTER AUTH RESTORED
    // ==========================================

    useEffect(() => {

        if (!token) {
            return;
        }

        fetchCurrentSeller();

    }, [token]);


    // ==========================================
    // LOGIN
    // ==========================================

    const login = (
        userData,
        tokenData
    ) => {

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        localStorage.setItem(
            "token",
            tokenData
        );

        setUserState(userData);

        setToken(tokenData);

    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        localStorage.removeItem("user");

        localStorage.removeItem("token");

        localStorage.removeItem("seller");

        setUserState(null);

        setSellerState(null);

        setToken(null);

    };


    // ==========================================
    // SELLER STATUS
    // ==========================================

    const sellerStatus =
        seller?.status?.toLowerCase() || null;


    // ==========================================
    // PROVIDER
    // ==========================================

    return (

        <AuthContext.Provider
            value={{

                user,
                seller,

                token,

                loading,
                sellerLoading,

                sellerStatus,

                login,
                logout,

                setUser,
                setSeller,

                fetchCurrentSeller,

            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


export const useAuthContext = () =>
    useContext(AuthContext);