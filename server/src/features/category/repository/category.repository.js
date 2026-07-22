    const Category = require("../category.model");

    const createCategory = async (categoryData) => {
        return await Category.create(categoryData);
    };

    const findCategoryByName = async (name) => {
        return await Category.findOne({ name });
    };

    const getAllCategories = async () => {
        return await Category.find({ isActive: true })
            .sort({ name: 1 });
    };

    const getCategoryById = async (id) => {
        return await Category.findById(id);
    };

    const updateCategory = async (id, data) => {
        return await Category.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        );
    };

    module.exports = {
        createCategory,
        findCategoryByName,
        getAllCategories,
        getCategoryById,
        updateCategory,
    };