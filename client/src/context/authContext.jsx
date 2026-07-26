import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(null);

    const [loading, setLoading] = useState(true);

    // ==========================================
    // Restore Authentication From Local Storage
    // ==========================================

    useEffect(() => {

        try {

            const savedUser =
                localStorage.getItem("user");

            const savedToken =
                localStorage.getItem("token");

            if (savedUser && savedToken) {

                setUser(
                    JSON.parse(savedUser)
                );

                setToken(savedToken);

            }

        } catch (error) {

            console.error(
                "Failed to restore authentication:",
                error
            );

            localStorage.removeItem("user");
            localStorage.removeItem("token");

            setUser(null);
            setToken(null);

        } finally {

            setLoading(false);

        }

    }, []);

    // ==========================================
    // Login
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

        setUser(userData);

        setToken(tokenData);

    };

    // ==========================================
    // Logout
    // ==========================================

    const logout = () => {

        localStorage.removeItem("user");

        localStorage.removeItem("token");

        setUser(null);

        setToken(null);

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                setUser,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export const useAuthContext =
    () => useContext(AuthContext);