const Product = require("../product.model");

// ======================================
// Create Product
// ======================================
const createProduct = async (productData) => {
    return await Product.create(productData);
};

// ======================================
// Get All Products of a Seller
// ======================================
const getSellerProducts = async (sellerId) => {
    return await Product.find({
        seller: sellerId,
    })
        .populate("category")
        .sort({ createdAt: -1 });
};

// ======================================
// Get Product By ID
// ======================================
const getProductById = async (id) => {
    return await Product.findById(id)
        .populate("category")
        .populate({
            path: "seller",
            populate: {
                path: "user",
                select: "firstname lastname email profilePicture",
            },
        });
};

// ======================================
// Get Seller Product By ID
// ======================================
const getSellerProductById = async (productId, sellerId) => {
    return await Product.findOne({
        _id: productId,
        seller: sellerId,
    }).populate("category");
};

// ======================================
// Get All Products (Search + Filter + Sort + Pagination)
// ======================================
const getAllProducts = async ({
    page = 1,
    limit = 12,
    search,
    category,
    featured,
    minPrice,
    maxPrice,
    sort = "latest",
}) => {

    const filter = {
        status: "Active",
    };

    // Search
    if (search) {
        filter.name = {
            $regex: search,
            $options: "i",
        };
    }

    // Category
    if (category) {
        filter.category = category;
    }

    // Featured
    if (featured === "true") {
        filter.featured = true;
    }

    // Price Filter
    if (minPrice || maxPrice) {
        filter.price = {};

        if (minPrice) {
            filter.price.$gte = Number(minPrice);
        }

        if (maxPrice) {
            filter.price.$lte = Number(maxPrice);
        }
    }

    // Sorting
    let sortOption = {};

    switch (sort) {

        case "latest":
            sortOption = { createdAt: -1 };
            break;

        case "oldest":
            sortOption = { createdAt: 1 };
            break;

        case "price-low":
            sortOption = { price: 1 };
            break;

        case "price-high":
            sortOption = { price: -1 };
            break;

        case "rating":
            sortOption = { averageRating: -1 };
            break;

        case "popular":
            sortOption = { totalSold: -1 };
            break;

        default:
            sortOption = {
                featured: -1,
                createdAt: -1,
            };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
        .populate("category")
        .populate({
            path: "seller",
            populate: {
                path: "user",
                select: "firstname lastname",
            },
        })
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));

    const totalProducts = await Product.countDocuments(filter);

    return {
        products,
        pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(totalProducts / Number(limit)),
            totalProducts,
            limit: Number(limit),
        },
    };
};

// ======================================
// Get Products By Category
// ======================================
const getProductsByCategory = async (categoryId) => {
    return await Product.find({
        category: categoryId,
        status: "Active",
    })
        .populate("category")
        .populate({
            path: "seller",
            populate: {
                path: "user",
                select: "firstname lastname",
            },
        })
        .sort({ featured: -1, createdAt: -1 });
};

// ======================================
// Search Products
// ======================================
const searchProducts = async (keyword) => {
    return await Product.find({
        name: {
            $regex: keyword,
            $options: "i",
        },
        status: "Active",
    })
        .populate("category")
        .sort({ featured: -1, createdAt: -1 });
};

// ======================================
// Update Product
// ======================================
const updateProduct = async (id, data) => {
    return await Product.findByIdAndUpdate(
        id,
        data,
        {
            returnDocument: "after",
            runValidators: true,
        }
    );
};

// ======================================
// Delete Product
// ======================================
const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};


// ======================================
// Get Featured Products
// ======================================
const getFeaturedProducts = async (limit = 8) => {
    return await Product.find({
        status: "Active",
        featured: true,
    })
        .populate("category")
        .populate({
            path: "seller",
            populate: {
                path: "user",
                select: "firstname lastname",
            },
        })
        .sort({ createdAt: -1 })
        .limit(limit);
};

// ======================================
// Get Latest Products
// ======================================
const getLatestProducts = async (limit = 10) => {
    return await Product.find({
        status: "Active",
    })
        .populate("category")
        .populate({
            path: "seller",
            populate: {
                path: "user",
                select: "firstname lastname",
            },
        })
        .sort({ createdAt: -1 })
        .limit(limit);
};
module.exports = {
    createProduct,
    getSellerProducts,
    getProductById,
    getSellerProductById,
    getAllProducts,
    getProductsByCategory,
    searchProducts,
    getFeaturedProducts,
    getLatestProducts,
    updateProduct,
    deleteProduct,
};