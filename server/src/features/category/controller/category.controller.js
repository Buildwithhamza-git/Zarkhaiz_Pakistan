const {
    createCategoryService,
    getAllCategoriesService,
    getCategoryBySlugService,
    updateCategoryService,
} = require("../services/category.service");


// ✅ CREATE CATEGORY
const createCategory = async (req, res, next) => {
    try {
        const category = await createCategoryService(req.body);

        res.status(201).json({
            success: true,
            message: "Category created successfully.",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};


// ✅ GET ALL CATEGORIES (TREE)
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await getAllCategoriesService();

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        next(error);
    }
};


// 🔥 UPDATED: GET CATEGORY BY SLUG
const getCategoryBySlug = async (req, res, next) => {
    try {
        const category = await getCategoryBySlugService(req.params.slug);

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        next(error);
    }
};


// ✅ UPDATE CATEGORY
const updateCategory = async (req, res, next) => {
    try {
        const category = await updateCategoryService(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Category updated successfully.",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createCategory,
    getAllCategories,
    getCategoryBySlug, // 🔥 changed
    updateCategory,
};