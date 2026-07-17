const Product = require("../product.model");

const createProduct = async (productData) => {
    return await Product.create(productData);
};

const getSellerProducts = async (sellerId) => {
    return await Product.find({
        seller: sellerId,
    }).populate("category");
};

const getProductById = async (id) => {
    return await Product.findById(id)
        .populate("seller")
        .populate("category");
};

const getAllProducts = async () => {
    return await Product.find({
        isActive: true,
    })
        .populate("category")
        .populate("seller");
};

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

const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};

module.exports = {
    createProduct,
    getSellerProducts,
    getProductById,
    getAllProducts,
    updateProduct,
    deleteProduct,
};