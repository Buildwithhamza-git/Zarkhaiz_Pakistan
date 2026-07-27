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

const { ProductSchema } = require("../validation/product.validation");
// ====================================
// Create Product
// ====================================

const createProduct = async (req, res) => {
  try {

    console.log("FILES:", req.files);
    console.log("User", req.user);

    const parsed = ProductSchema.parse(req.body);

    const product = await createProductService(
      req.user.userId,
      parsed,
      req.files
    );

    res.status(201).json({
      success: true,
      data: product,
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
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
            message: products.products?.length ? "Products fetched successfully." : "No products found",
            data: products.products ?? [],
            pagination: products.pagination ?? {
                currentPage: 1,
                totalPages: 1,
                totalProducts: 0,
                limit: 12,
            },
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
    getFeaturedProducts,
    getLatestProducts,
    getProductsByCategory,
    deleteProduct,
};