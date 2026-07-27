const {
    createProductService,
    getAllProductsService,
    getSellerProductsService,
    getFeaturedProductsService,
    getLatestProductsService,
    getProductsByCategoryService,
    getProductService,
    updateProductService,
    deleteProductService,
} = require("../service/product.service");


// ====================================
// Create Product
// ====================================
const createProduct = async (req, res, next) => {
    try {
        console.log("Body:", req.body);
console.log("Files:", req.files);
        const product = await createProductService(
            req.user.userId,
            req.body,
            req.files
        );

        return res.status(201).json({
            success: true,
            message: "Product created successfully.",
            data: product,
        });

    } catch (error) {
        next(error);
    }
};


// ====================================
// Get All Products
// ====================================
const getAllProducts = async (req, res, next) => {
    try {

        const products = await getAllProductsService(req.query);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully.",
            data: products.products,
            pagination: products.pagination,
        });

    } catch (error) {
        next(error);
    }
};


// ====================================
// Get Seller Products
// ====================================
const getSellerProducts = async (req, res, next) => {
    try {

        const products = await getSellerProductsService(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            data: products,
        });

    } catch (error) {
        next(error);
    }
};


// ====================================
// Get Product By ID
// ====================================
const getProduct = async (req, res, next) => {
    try {

        const product = await getProductService(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            data: product,
        });

    } catch (error) {
        next(error);
    }
};


// ====================================
// Update Product
// ====================================
const updateProduct = async (req, res, next) => {
    try {

        const product = await updateProductService(
            req.params.id,
            req.user.userId,
            req.body,
            req.files
        );

        return res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            data: product,
        });

    } catch (error) {
        next(error);
    }
};


// ====================================
// Delete Product
// ====================================
const deleteProduct = async (req, res, next) => {
    try {

        await deleteProductService(
            req.params.id,
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });

    } catch (error) {
        next(error);
    }
};

// Featured Products
const getFeaturedProducts = async (req, res, next) => {
    try {

        const products = await getFeaturedProductsService();

        return res.status(200).json({
            success: true,
            data: products,
        });

    } catch (error) {
        next(error);
    }
};

// Latest Products
const getLatestProducts = async (req, res, next) => {
    try {

        const products = await getLatestProductsService();

        return res.status(200).json({
            success: true,
            data: products,
        });

    } catch (error) {
        next(error);
    }
};

// Products By Category
const getProductsByCategory = async (req, res, next) => {
    try {

        const products = await getProductsByCategoryService(
            req.params.categoryId
        );

        return res.status(200).json({
            success: true,
            data: products,
        });

    } catch (error) {
        next(error);
    }
};
module.exports = {
    createProduct,
    getAllProducts,
    getSellerProducts,
    getProduct,
    updateProduct,
    getFeaturedProducts ,
    getLatestProducts ,
    getProductsByCategory ,
    deleteProduct,
};