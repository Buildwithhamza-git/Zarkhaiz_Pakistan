import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./app/App";
import "./index.css";
import AuthProvider from "./context/authContext";
import { ProductsProvider } from "./context/productsContext";
import SellerProvider from "./context/sellerContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthProvider>
            <SellerProvider>
                <ProductsProvider>
                    <App />
                </ProductsProvider>
            </SellerProvider>
        </AuthProvider>
    </BrowserRouter>
); 