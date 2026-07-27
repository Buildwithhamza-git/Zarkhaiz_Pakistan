import { authFetch } from "../../../utlis/authFetch";

export const createProduct = async (formData) => {

    return await authFetch("/products", {
        method: "POST",
        body: formData,
    });

};

export const updateProduct = async (id, formData) => {

    return await authFetch(`/products/${id}`, {
        method: "PATCH",
        body: formData,
    });

};

export const deleteProduct = async (id) => {

    return await authFetch(`/products/${id}`, {
        method: "DELETE",
    });

};

export const getSellerProducts = async () => {

    return await authFetch("/products/my-products");

};
