const Seller = require("../../seller/model/seller.model");
const Category = require("../../category/category.model");

const {
    createProduct,
    getAllProducts,
    getProductById,
    getSellerProducts,
    updateProduct,
    deleteProduct,
} = require("../repository/product.repository");


// ====================================
// Create Product
// ====================================
const createProductService = async (userId, productData, files) => {

    const seller = await Seller.findOne({ user: userId });

    if (!seller) {
        throw new Error("Seller account not found.");
    }

    if (seller.status !== "approved") {
        throw new Error("Your seller account is not approved yet.");
    }

    const category = await Category.findById(productData.category);

    if (!category) {
        throw new Error("Category not found.");
    }

    const images = files?.length
    ? files.map(file => file.path)
    : [];

    const product = await createProduct({
        seller: seller._id,
        category: category._id,

        name: productData.name,
        description: productData.description,

        price: productData.price,
        quantity: productData.quantity,
        unit: productData.unit,

        images,

        status: productData.status || "Active",

        featured: productData.featured || false,
    });

    return product;
};


// ====================================
// Get All Products
// ====================================
const getAllProductsService = async () => {

    return await getAllProducts();

};


// ====================================
// Get Seller Products
// ====================================
const getSellerProductsService = async (userId) => {

    const seller = await Seller.findOne({
        user: userId,
    });

    if (!seller) {
        throw new Error("Seller account not found.");
    }

    return await getSellerProducts(seller._id);

};


// ====================================
// Get Product
// ====================================
const getProductService = async (productId) => {

    const product = await getProductById(productId);

    if (!product) {
        throw new Error("Product not found.");
    }

    return product;

};


// ====================================
// Update Product
// ====================================
const updateProductService = async (
    productId,
    userId,
    updateData,
    files
) => {

    const seller = await Seller.findOne({
        user: userId,
    });

    if (!seller) {
        throw new Error("Seller account not found.");
    }

    const product = await getProductById(productId);

    if (!product) {
        throw new Error("Product not found.");
    }

    if (product.seller._id.toString() !== seller._id.toString()) {
        throw new Error("Unauthorized.");
    }

    if (updateData.category) {

        const category = await Category.findById(
            updateData.category
        );

        if (!category) {
            throw new Error("Category not found.");
        }

    }

    if (files?.length) {
    updateData.images = files.map(file => file.path);
}

    const updatedProduct = await updateProduct(
        productId,
        updateData
    );

    return updatedProduct;

};


// ====================================
// Delete Product
// ====================================
const deleteProductService = async (
    productId,
    userId
) => {

    const seller = await Seller.findOne({
        user: userId,
    });

    if (!seller) {
        throw new Error("Seller account not found.");
    }

    const product = await getProductById(productId);

    if (!product) {
        throw new Error("Product not found.");
    }

    if (product.seller._id.toString() !== seller._id.toString()) {
        throw new Error("Unauthorized.");
    }

    await deleteProduct(productId);

};


module.exports = {
    createProductService,
    getAllProductsService,
    getSellerProductsService,
    getProductService,
    updateProductService,
    deleteProductService,
};