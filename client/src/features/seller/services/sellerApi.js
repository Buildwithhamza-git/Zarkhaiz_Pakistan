import { authFetch } from "../../../utlis/authFetch";

export const registerSeller = async (formData) => {
  const response = await authFetch("/seller/register", {
    method: "POST",
    body: formData,
  });

  return response;
};

export const getSellerProfile = async () => {
    return await authFetch("/seller/profile");
};