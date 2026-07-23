// TEMPORARY dummy data for the Products Content Area (Member 2).
// Replace with a real API call (e.g. GET /products) once the backend route is live.
// Shape intentionally matches what the backend is expected to return.

export const PRODUCTS = [
    {
        id: 1,
        title: "Hybrid Maize Seed",
        category: "Seeds",
        image:
            "https://images.unsplash.com/photo-1601472634541-6b4e5f6b1c02?w=600&h=600&fit=crop",
        description:
            "High-yield hybrid maize seed engineered for strong germination, disease resistance and consistent cob size across all major growing regions of Punjab.",
        price: 2200,
        oldPrice: null,
        rating: 4.8,
        reviews: 124,
        badge: "featured",
        stock: 48,
        seller: "Punjab Seed Corporation",
        specifications: {
            Type: "Hybrid",
            "Germination Rate": "92%",
            "Packet Weight": "5 kg",
            "Sowing Season": "Kharif",
            "Maturity Period": "95-100 days",
        },
    },
    {
        id: 2,
        title: "DAP Fertilizer 18-46-0",
        category: "Fertilizers",
        image:
            "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&h=600&fit=crop",
        description:
            "Diammonium Phosphate fertilizer formulated to boost root development and early plant growth. Ideal for wheat, cotton and maize crops.",
        price: 5500,
        oldPrice: 6200,
        rating: 4.6,
        reviews: 98,
        badge: null,
        stock: 120,
        seller: "Fauji Fertilizer Co.",
        specifications: {
            "N-P-K": "18-46-0",
            "Bag Weight": "50 kg",
            "Application Rate": "50-75 kg/acre",
            Form: "Granular",
        },
    },
    {
        id: 3,
        title: "Imidacloprid 20% SL",
        category: "Pesticides",
        image:
            "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=600&h=600&fit=crop",
        description:
            "Systemic insecticide effective against sucking insects such as aphids, whiteflies and jassids. Long-lasting protection for cotton and vegetable crops.",
        price: 1800,
        oldPrice: 2000,
        rating: 4.5,
        reviews: 76,
        badge: "discount",
        stock: 65,
        seller: "AgriChem Pakistan",
        specifications: {
            "Active Ingredient": "Imidacloprid 20% SL",
            "Bottle Size": "500 ml",
            "Target Pests": "Aphids, Whitefly, Jassids",
            "Pre-Harvest Interval": "7 days",
        },
    },
    {
        id: 4,
        title: "Glyphosate 41% SL",
        category: "Herbicides",
        image:
            "https://images.unsplash.com/photo-1592982573971-2c0ba1a4a4f8?w=600&h=600&fit=crop",
        description:
            "Broad-spectrum, non-selective herbicide that controls a wide range of weeds. Rainfast within 6 hours of application.",
        price: 1650,
        oldPrice: null,
        rating: 4.7,
        reviews: 88,
        badge: null,
        stock: 90,
        seller: "Sitara Chemical Industries",
        specifications: {
            "Active Ingredient": "Glyphosate 41% SL",
            "Bottle Size": "1 litre",
            "Weed Type": "Broadleaf & Grasses",
            "Application Method": "Foliar Spray",
        },
    },
    {
        id: 5,
        title: "Wheat (Premium Quality)",
        category: "Crops",
        image:
            "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&h=600&fit=crop",
        description:
            "Premium quality, cleaned and graded wheat sourced directly from certified farms. Perfect for milling and bulk purchase.",
        price: 3200,
        oldPrice: null,
        rating: 4.6,
        reviews: 64,
        badge: "featured",
        stock: 200,
        seller: "Sargodha Grain Traders",
        specifications: {
            Grade: "A",
            "Moisture Content": "< 12%",
            Packing: "50 kg bag",
            Variety: "Punjab-2011",
        },
    },
    {
        id: 6,
        title: "Tomato Seeds",
        category: "Vegetables",
        image:
            "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=600&fit=crop",
        description:
            "High-germination hybrid tomato seeds producing firm, disease-resistant fruit with excellent shelf life for local and export markets.",
        price: 850,
        oldPrice: null,
        rating: 4.4,
        reviews: 53,
        badge: null,
        stock: 150,
        seller: "Green Valley Seeds",
        specifications: {
            Type: "Hybrid",
            "Germination Rate": "88%",
            "Packet Weight": "10 g",
            "Sowing Season": "Rabi & Kharif",
        },
    },
    {
        id: 7,
        title: "Apple (Red Delicious)",
        category: "Fruits",
        image:
            "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop",
        description:
            "Freshly harvested Red Delicious apples from the orchards of Swat, hand-picked and graded for size, colour and sweetness.",
        price: 280,
        oldPrice: null,
        rating: 4.7,
        reviews: 45,
        badge: null,
        stock: 300,
        seller: "Swat Orchards",
        specifications: {
            Variety: "Red Delicious",
            Unit: "per kg",
            Origin: "Swat Valley",
            Storage: "Cold Storage",
        },
    },
    {
        id: 8,
        title: "Drip Irrigation Kit",
        category: "Irrigation",
        image:
            "https://images.unsplash.com/photo-1620200423727-8127f75d7f53?w=600&h=600&fit=crop",
        description:
            "Complete drip irrigation starter kit covering up to 1 acre. Includes mainline, drip tape, connectors and pressure regulator.",
        price: 4200,
        oldPrice: 4800,
        rating: 4.6,
        reviews: 67,
        badge: "discount",
        stock: 35,
        seller: "AquaGrow Systems",
        specifications: {
            Coverage: "1 acre",
            "Pipe Length": "500 m",
            "Emitter Spacing": "30 cm",
            Includes: "Filter, Connectors, Regulator",
        },
    },
    {
        id: 9,
        title: "Battery Sprayer 16L",
        category: "Farm Equipment",
        image:
            "https://images.unsplash.com/photo-1592982573971-2c0ba1a4a4f8?w=601&h=601&fit=crop",
        description:
            "Rechargeable battery-operated knapsack sprayer with adjustable nozzle, 16 litre tank capacity and up to 6 hours of continuous use.",
        price: 6500,
        oldPrice: null,
        rating: 4.8,
        reviews: 92,
        badge: "featured",
        stock: 22,
        seller: "FarmTech Equipment",
        specifications: {
            "Tank Capacity": "16 litres",
            Battery: "12V Rechargeable",
            "Working Time": "5-6 hours",
            Warranty: "1 Year",
        },
    },
    {
        id: 10,
        title: "Garden Trowel",
        category: "Farm Equipment",
        image:
            "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?w=600&h=600&fit=crop",
        description:
            "Durable stainless-steel hand trowel with an ergonomic wooden handle, ideal for planting, weeding and light digging.",
        price: 350,
        oldPrice: null,
        rating: 4.3,
        reviews: 39,
        badge: null,
        stock: 180,
        seller: "FarmTech Equipment",
        specifications: {
            Material: "Stainless Steel",
            Handle: "Wood",
            Length: "28 cm",
            Weight: "180 g",
        },
    },
    {
        id: 11,
        title: "Urea Fertilizer 46%",
        category: "Fertilizers",
        image:
            "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&h=600&fit=crop",
        description:
            "High-nitrogen granular urea fertilizer that promotes rapid vegetative growth and improves overall crop yield.",
        price: 2900,
        oldPrice: null,
        rating: 4.6,
        reviews: 81,
        badge: null,
        stock: 140,
        seller: "Fauji Fertilizer Co.",
        specifications: {
            "Nitrogen Content": "46%",
            "Bag Weight": "50 kg",
            "Application Rate": "40-60 kg/acre",
            Form: "Granular",
        },
    },
    {
        id: 12,
        title: "Green Chilli Seeds",
        category: "Vegetables",
        image:
            "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&h=600&fit=crop",
        description:
            "High-yield green chilli seeds bred for uniform pod size, strong pungency and resistance to common leaf viruses.",
        price: 650,
        oldPrice: null,
        rating: 4.5,
        reviews: 48,
        badge: null,
        stock: 210,
        seller: "Green Valley Seeds",
        specifications: {
            Type: "Hybrid",
            "Germination Rate": "85%",
            "Packet Weight": "10 g",
            "Sowing Season": "Kharif",
        },
    },
];

// The sidebar / search / filter bar (built by other members) report a much
// larger catalogue (e.g. "Showing 1-12 of 230 products"). Until the real
// backend is connected we simulate that total so pagination behaves the way
// the design expects, while still serving real cards from PRODUCTS.
export const MOCK_TOTAL_PRODUCTS = 230;
export const PRODUCTS_PER_PAGE = 12;

/**
 * Simulates a paginated products API call.
 * Replace the body of this function with a real `api.get("/products", { params })`
 * call once the backend endpoint is available — the return shape below is what
 * the UI already expects, so no component changes should be needed.
 */
export function getProducts({ page = 1, perPage = PRODUCTS_PER_PAGE } = {}) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const items = Array.from({ length: perPage }, (_, i) => {
                const source = PRODUCTS[(page - 1 + i) % PRODUCTS.length];
                return { ...source, id: `${source.id}-p${page}-${i}` };
            });

            resolve({
                items,
                page,
                perPage,
                total: MOCK_TOTAL_PRODUCTS,
                totalPages: Math.ceil(MOCK_TOTAL_PRODUCTS / perPage),
            });
        }, 350);
    });
}

export function getProductById(id) {
    return PRODUCTS.find((p) => String(p.id) === String(id)) || null;
}