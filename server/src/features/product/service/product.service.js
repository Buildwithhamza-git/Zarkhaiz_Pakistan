const mongoose = require("mongoose");
const slugify = require("slugify");

const Seller = require("../../seller/model/seller.model");
const Category = require("../../category/category.model");
const { getUploadedImageUrls } = require("../utils/normalizeUploadedFiles");
const AppError = require("../../../shared/utils/AppError");

const {
    createProduct,
    getAllProducts,
    getProductById,
    getSellerProducts,
    getFeaturedProducts,
    getLatestProducts,
    getProductsByCategory,
    updateProduct,
    deleteProduct,
} = require("../repository/product.repository");


const resolveCategory = async (categoryValue) => {
    if (!categoryValue) return null;

    if (typeof categoryValue === "object" && categoryValue._id) {
        categoryValue = categoryValue._id;
    }

    const value = String(categoryValue).trim();

    if (!value) return null;

    if (mongoose.Types.ObjectId.isValid(value)) {
        return await Category.findById(value);
    }

    return await Category.findOne({
        slug: value.toLowerCase(),
        isActive: true,
    });
};

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

    const category = await resolveCategory(productData.category);

    if (!category) {
        throw new Error("Category not found.");
    }

    const rawImages = getUploadedImageUrls(files);
    const images = rawImages.map((img) =>
        typeof img === "string" ? { url: img } : img
    );
    const stock = Number(productData.stock ?? productData.quantity ?? 0);
    const featured = Boolean(productData.featured ?? productData.isFeatured ?? false);
    const slug = productData.slug || slugify(productData.name, { lower: true, strict: true });

    const product = await createProduct({
        seller: seller._id,
        category: category._id,

        name: productData.name,
        description: productData.description,

        slug,
        price: Number(productData.price),
        stock,
        unit: productData.unit,

        discountPrice: Number(productData.discountPrice ?? 0),
        brand: productData.brand || "",
        tags: Array.isArray(productData.tags) ? productData.tags : [],
        images,

        status: productData.status || "Active",
        featured,
        isFeatured: featured,
    });

    return product;
};


// ====================================
// Get All Products
// ====================================
const getAllProductsService = async (query = {}) => {
    const category = query.category && query.category !== "all"
        ? await resolveCategory(query.category)
        : null;

    if (query.category && query.category !== "all" && !category) {
        return {
            products: [],
            pagination: {
                currentPage: Number(query.page || 1),
                totalPages: 1,
                totalProducts: 0,
                limit: Number(query.limit || 12),
            },
        };
    }

    return await getAllProducts({
        page: query.page || 1,
        limit: query.limit || 12,
        search: query.search,
        category: category?._id || null,
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
        throw new AppError("Product not found.", 404);
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
        throw new AppError("Product not found.", 404);
    }

    if (product.seller._id.toString() !== seller._id.toString()) {
        throw new AppError("Unauthorized.", 403);
    }

    // ✅ CATEGORY VALIDATION
    if (updateData.category) {
        const category = await resolveCategory(updateData.category);

        if (!category) {
            throw new Error("Category not found.");
        }

        updateData.category = category._id;
    }

    // ✅ HANDLE IMAGES PROPERLY
    let existingImages = [];

    if (updateData.existingImages) {
        try {
            const raw =
                typeof updateData.existingImages === "string"
                    ? JSON.parse(updateData.existingImages)
                    : updateData.existingImages;

            existingImages = (Array.isArray(raw) ? raw : []).map(
                (url) => ({ url })
            );

        } catch (err) {
            throw new Error("Invalid existingImages format.");
        }
    }

    // ✅ NEW UPLOADED IMAGES
    let newImages = [];

    if (files?.length) {
        const rawImages = getUploadedImageUrls(files);

        newImages = rawImages.map((img) =>
            typeof img === "string" ? { url: img } : img
        );
    }

    // ✅ MERGE IMAGES
    if (existingImages.length || newImages.length) {
        updateData.images = [...existingImages, ...newImages];
    }

    // ❗ REMOVE TEMP FIELD
    delete updateData.existingImages;

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
        throw new AppError("Product not found.", 404);
    }

    if (product.seller._id.toString() !== seller._id.toString()) {
        throw new AppError("Unauthorized.", 403);
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
    const category = await resolveCategory(categoryId);

    if (!category) {
        return [];
    }

    return await getProductsByCategory(category._id);
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