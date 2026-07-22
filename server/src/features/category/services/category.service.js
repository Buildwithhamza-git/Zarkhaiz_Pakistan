const {
    createCategory,
    findCategoryByName,
    getAllCategories,
    getCategoryById,
    updateCategory,
} = require("../repository/category.repository");

const createCategoryService = async (data) => {

    const existingCategory = await findCategoryByName(data.name);

    if (existingCategory) {
        throw new Error("Category already exists.");
    }

    return await createCategory(data);
};

const getAllCategoriesService = async () => {
    return await getAllCategories();
};

const getCategoryService = async (id) => {

    const category = await getCategoryById(id);

    if (!category) {
        throw new Error("Category not found.");
    }

    return category;
};

const updateCategoryService = async (id, data) => {

    const category = await getCategoryById(id);

    if (!category) {
        throw new Error("Category not found.");
    }

    if (data.name && data.name !== category.name) {

        const existingCategory = await findCategoryByName(data.name);

        if (existingCategory) {
            throw new Error("Category already exists.");
        }
    }

    return await updateCategory(id, data);
};

module.exports = {
    createCategoryService,
    getAllCategoriesService,
    getCategoryService,
    updateCategoryService,
};