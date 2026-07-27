import { useEffect, useState } from "react";

import { getCategories } from "../services/marketplaceApi";

export default function useMarketplaceCategories() {

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {

            setLoading(true);

            const response = await getCategories();

            setCategories(response.data);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    }

    return {
        categories,
        loading,
        error,
    };
}