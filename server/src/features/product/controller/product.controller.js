const {
    createProductService,
    getAllProductsService,
    getSellerProductsService,
    getProductService,
    updateProductService,
    deleteProductService,
} = require("../service/product.service");

// Create Product
const createProduct = async (req, res, next) => {
    try {

        const product = await createProductService(
            req.user.userId,
            req.body,
            req.files
        );

        res.status(201).json({
            success: true,
            message: "Product created successfully.",
            data: product,
        });

    } catch (error) {
        next(error);
    }
};

// Get All Products
const getAllProducts = async (req, res, next) => {
    try {

        const products = await getAllProductsService();

        res.status(200).json({
            success: true,
            data: products,
        });

    } catch (error) {
        next(error);
    }
};

// Get Seller Products
const getSellerProducts = async (req, res, next) => {
    try {

        const products = await getSellerProductsService(req.user.userId);

        res.status(200).json({
            success: true,
            data: products,
        });

    } catch (error) {
        next(error);
    }
};

// Get Product
const getProduct = async (req, res, next) => {
    try {

        const product = await getProductService(req.params.id);

        res.status(200).json({
            success: true,
            data: product,
        });

    } catch (error) {
        next(error);
    }
};

// Update Product
const updateProduct = async (req, res, next) => {
    try {

        const product = await updateProductService(
            req.params.id,
            req.user.userId,
            req.body,
            req.files
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            data: product,
        });

    } catch (error) {
        next(error);
    }
};

// Delete Product
const deleteProduct = async (req, res, next) => {
    try {

        await deleteProductService(
            req.params.id,
            req.user.userId
        );

        res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
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
    deleteProduct,
};