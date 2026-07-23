import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const savedUser = localStorage.getItem("user");

        const savedToken = localStorage.getItem("token");

        if(savedUser && savedToken){

            setUser(JSON.parse(savedUser));

            setToken(savedToken);

        }

        setLoading(false);

    }, []);

    const login = (userData, tokenData)=>{

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

    const logout = ()=>{

        localStorage.removeItem("user");

        localStorage.removeItem("token");

        setUser(null);

        setToken(null);

    };

    return(

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

export const useAuthContext = () => useContext(AuthContext);