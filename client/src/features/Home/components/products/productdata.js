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
     id: 6,
     name: "Engro DAP Fertilizer",
     image:
         "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=400&h=400&fit=crop",
     rating: 4.8,
     reviewCount: 145,
     price: 1000,
     unit: "kg",
     seller: "AgriCare Pakistan",
     location: "Lahore",
 },
    {
    id: 3,
    name: "Maize (Corn)",
    image:
        "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 76,
    price: 160,
    unit: "kg",
    seller: "Farm Fresh",
    location: "Sargodha",
},
   {
    id: 5,
    name: "Engro DAP Fertilizer",
    image:
        "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=400&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 145,
    price: 13500,
    unit: "50kg bag",
    seller: "AgriCare Pakistan",
    location: "Lahore",
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
    rating: product.averageRating ?? product.rating ?? 0,
    reviewCount:
        product.totalReviews ?? product.reviewCount ?? 0,
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