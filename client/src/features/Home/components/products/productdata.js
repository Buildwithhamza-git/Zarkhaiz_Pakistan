import api from "../../../../api/axios";

// TEMPORARY: turn this off (false) once the backend /products/featured route is live
const USE_MOCK_DATA = true;

const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "Basmati Rice",
        image:
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
        rating: 4.5,
        reviewCount: 128,
        price: 220,
        unit: "kg",
        seller: "Farmer Ali",
        location: "Lahore",
    },
    {
        id: 2,
        name: "Wheat",
        image:
            "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
        rating: 5,
        reviewCount: 98,
        price: 180,
        unit: "kg",
        seller: "Farmer Usman",
        location: "Faisalabad",
    },
    {
        id: 3,
        name: "Maize (Corn)",
        image:
            "https://images.unsplash.com/photo-1601593768799-76d1fb3f1c98?w=400&h=400&fit=crop",
        rating: 4.5,
        reviewCount: 76,
        price: 160,
        unit: "kg",
        seller: "Farm Fresh",
        location: "Sargodha",
    },
    {
        id: 4,
        name: "Potatoes",
        image:
            "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop",
        rating: 4,
        reviewCount: 64,
        price: 120,
        unit: "kg",
        seller: "Green Fields",
        location: "Multan",
    },
    {
        id: 5,
        name: "Onion",
        image:
            "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop",
        rating: 4.5,
        reviewCount: 82,
        price: 90,
        unit: "kg",
        seller: "Punjab Farms",
        location: "Bahawalpur",
    },
];

const normalizeError = (error) => {
    const serverData = error?.response?.data ?? error?.data ?? error;

    if (serverData && typeof serverData === "object") {
        return {
            message: serverData.message || "Request failed",
            status: error?.response?.status || null,
            data: serverData,
        };
    }

    return {
        message: error?.message || "Request failed",
        status: null,
        data: null,
    };
};

const normalizeProduct = (product) => ({
    id: product._id ?? product.id,
    name: product.name,
    image: product.image,
    rating: product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    price: product.price,
    unit: product.unit ?? "kg",
    seller: product.sellerName ?? product.seller,
    location: product.location,
});

export const getFeaturedProducts = async () => {
    // Simulate a small network delay so loading state is visible too
    if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_PRODUCTS;
    }

    try {
        const response = await api.get("/products/featured");
        const products = response.data?.data ?? response.data;

        return Array.isArray(products) ? products.map(normalizeProduct) : [];
    } catch (error) {
        throw normalizeError(error);
    }
};