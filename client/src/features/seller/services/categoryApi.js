import { authFetch } from "../../../utlis/authFetch";

export const getCategories = async () => {
    return await authFetch("/categories");
};