import { createContext, useContext, useState } from "react";
import {removeToken,removeUser,} from "../utlis/storage";

const logout = () => {
    removeToken();
    removeUser();

    setUser(null);
    setToken(null);
};

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
});

const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
});

   

    const login = (userData, tokenData) => {
        localStorage.setItem("token", tokenData);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
        setToken(tokenData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);