const Category = require("../category.model");


// ✅ CREATE
const createCategory = async (categoryData) => {
    return await Category.create(categoryData);
};


// ✅ FIND BY NAME
const findCategoryByName = async (name) => {
    return await Category.findOne({ name });
};


// 🔥 GET ALL (OPTIMIZED FOR TREE)
const getAllCategories = async () => {
    return await Category.find({ isActive: true })
        .sort({ name: 1 })
        .lean(); // 🔥 IMPORTANT
};


// 🔥 GET BY ID (Admin use)
const getCategoryById = async (id) => {
    return await Category.findById(id).populate("parent");
};


// 🔥 NEW: GET BY SLUG (Frontend use)
const getCategoryBySlug = async (slug) => {
    return await Category.findOne({ slug, isActive: true })
        .populate("parent");
};


// ✅ UPDATE
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
    getCategoryBySlug, // 🔥 NEW
    updateCategory,
};