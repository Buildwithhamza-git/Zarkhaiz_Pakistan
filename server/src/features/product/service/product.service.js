const Seller = require("../../seller/model/seller.model");
const Category = require("../../category/category.model");

const {
    createProduct,
    getAllProducts,
    getProductById,
    getProductsBySeller,
    updateProduct,
    deleteProduct,
} = require("../repository/product.repository");


// ===============================
// Create Product
// ===============================
const createProductService = async (userId, productData, files) => {

    // Find seller account
    const seller = await Seller.findOne({ user: userId });

    if (!seller) {
        throw new Error("Seller account not found.");
    }

    // Check seller approval
    if (seller.status !== "approved") {
        throw new Error("Your seller account is not approved yet.");
    }

    // Validate category
    const category = await Category.findById(productData.category);

    if (!category) {
        throw new Error("Category not found.");
    }

    // Extract uploaded image paths
    const images = files
        ? files.map(file => file.path.replace(/\\/g, "/"))
        : [];

    const product = await createProduct({
        seller: seller._id,
        category: category._id,
        productName: productData.productName,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        images,
        isActive:
            productData.isActive === undefined
                ? true
                : productData.isActive,
    });

    return product;
};


// ===============================
// Get All Products
// ===============================
const getAllProductsService = async () => {

    return await getAllProducts();

};


// ===============================
// Get Seller Products
// ===============================
const getSellerProductsService = async (userId) => {

    const seller = await Seller.findOne({ user: userId });

    if (!seller) {
        throw new Error("Seller account not found.");
    }

    return await getProductsBySeller(seller._id);

};


// ===============================
// Get Product By ID
// ===============================
const getProductService = async (productId) => {

    const product = await getProductById(productId);

    if (!product) {
        throw new Error("Product not found.");
    }

    return product;

};


// ===============================
// Update Product
// ===============================
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

    // Seller can update only his own products
    if (product.seller._id.toString() !== seller._id.toString()) {
        throw new Error("Unauthorized.");
    }

    // Validate category if changed
    if (updateData.category) {

        const category = await Category.findById(updateData.category);

        if (!category) {
            throw new Error("Category not found.");
        }

    }

    // Replace images if uploaded
    if (files && files.length > 0) {

        updateData.images = files.map(file =>
            file.path.replace(/\\/g, "/")
        );

    }

    const updatedProduct = await updateProduct(
        productId,
        updateData
    );

    return updatedProduct;

};


// ===============================
// Delete Product
// ===============================
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

    return;

};


module.exports = {

    createProductService,

    getAllProductsService,

    getSellerProductsService,

    getProductService,

    updateProductService,

    deleteProductService,

};