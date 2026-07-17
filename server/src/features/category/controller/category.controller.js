const {
    createCategoryService,
    getAllCategoriesService,
    getCategoryService,
    updateCategoryService,
} = require("../services/category.service");

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

const getCategory = async (req, res, next) => {
    try {

        const category = await getCategoryService(req.params.id);

        res.status(200).json({
            success: true,
            data: category,
        });

    } catch (error) {
        next(error);
    }
};

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
    getCategory,
    updateCategory,
};