import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./app/App";
import "./index.css";

import AuthProvider from "./context/authContext";
import SellerProvider from "./context/sellerContext";
import CartContextProvider from "./context/cartContext";
import ChatProvider from "./features/chat/context/chatContext";

import MarketplaceProvider from "./context/MarketplaceContext";
import { ProductsProvider } from "./context/productsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ChatProvider>
        <SellerProvider>
          <CartContextProvider>
            <MarketplaceProvider>
              <ProductsProvider>
                <App />
              </ProductsProvider>
            </MarketplaceProvider>
          </CartContextProvider>
        </SellerProvider>
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>
);
