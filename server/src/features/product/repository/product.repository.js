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
// Get All Active Products
// ======================================
const getAllProducts = async () => {
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
        .sort({ featured: -1, createdAt: -1 });
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
            new: true,
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

module.exports = {
    createProduct,
    getSellerProducts,
    getProductById,
    getSellerProductById,
    getAllProducts,
    getProductsByCategory,
    searchProducts,
    updateProduct,
    deleteProduct,
};