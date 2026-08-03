import { authFetch } from "../../../utlis/authFetch";

// Register Seller
export const registerSeller = async (formData) => {
  return await authFetch("/seller/register", {
    method: "POST",
    body: formData,
  });
};

// Current Seller (Application Status)
export const getCurrentSeller = async () => {
  return await authFetch("/seller/me");
};

// Seller Dashboard
export const getSellerDashboard = async () => {
  return await authFetch("/seller/dashboard");
};

// Update Seller Profile Settings
export const updateSellerProfile = async (formData) => {
  return await authFetch("/seller/profile", {
    method: "PATCH",
    body: formData,
  });
};