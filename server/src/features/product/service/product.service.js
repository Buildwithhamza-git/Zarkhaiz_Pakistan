const Seller = require("../../seller/model/seller.model");
const Category = require("../../category/category.model");
const { getUploadedImageUrls } = require("../utils/normalizeUploadedFiles");

const {
    createProduct,
    getAllProducts,
    getProductById,
    getSellerProducts,
    getFeaturedProducts,
    getLatestProducts,
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

    const images = getUploadedImageUrls(files);

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
const getAllProductsService = async (query) => {

    return await getAllProducts({

        page: query.page || 1,

        limit: query.limit || 12,

        search: query.search,

        category: query.category,

        featured: query.featured,

        minPrice: query.minPrice,

        maxPrice: query.maxPrice,

        sort: query.sort || "latest",

    });

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
        updateData.images = getUploadedImageUrls(files);
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

// ====================================
// Featured Products
// ====================================
const getFeaturedProductsService = async () => {

    return await getFeaturedProducts();

};

// ====================================
// Latest Products
// ====================================
const getLatestProductsService = async () => {

    return await getLatestProducts();

};

// ====================================
// Products By Category
// ====================================
const getProductsByCategoryService = async (categoryId) => {

    return await getProductsByCategory(categoryId);

};


module.exports = {
    createProductService,
    getAllProductsService,
    getLatestProductsService,
    getSellerProductsService,
    getProductsByCategoryService,
    getProductService,
    updateProductService,
    getFeaturedProductsService,
    deleteProductService,
};