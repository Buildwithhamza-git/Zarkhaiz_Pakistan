const slugify = require("slugify");

const {
    createCategory,
    findCategoryByName,
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    updateCategory,
} = require("../repository/category.repository");


// ======================================
// ✅ CREATE CATEGORY
// ======================================
const createCategoryService = async (data) => {

    const existingCategory = await findCategoryByName(data.name);

    if (existingCategory) {
        throw new Error("Category already exists.");
    }

    const categoryData = {
        ...data,
        slug: slugify(data.name, { lower: true }),
        parent: data.parent || null,
    };

    return await createCategory(categoryData);
};


// ======================================
// 🔥 BUILD CATEGORY TREE (FIXED)
// ======================================
const buildCategoryTree = (categories) => {
    const map = {};
    const roots = [];

    // Step 1: map
    categories.forEach(cat => {
        map[cat._id.toString()] = {
            ...cat, // ✅ FIX: no _doc
            children: [],
        };
    });

    // Step 2: tree
    categories.forEach(cat => {
        if (cat.parent) {
            const parentId = cat.parent.toString();

            if (map[parentId]) {
                map[parentId].children.push(map[cat._id.toString()]);
            }
        } else {
            roots.push(map[cat._id.toString()]);
        }
    });

    return roots;
};


// ======================================
// 🔥 GET ALL CATEGORIES (TREE)
// ======================================
const getAllCategoriesService = async () => {

    const categories = await getAllCategories();

    return buildCategoryTree(categories); // ✅ FIXED
};


// ======================================
// 🔥 GET CATEGORY BY SLUG
// ======================================
const getCategoryBySlugService = async (slug) => {

    const category = await getCategoryBySlug(slug);

    if (!category) {
        throw new Error("Category not found.");
    }

    return category;
};


// ======================================
// ✅ GET CATEGORY BY ID (ADMIN)
// ======================================
const getCategoryService = async (id) => {

    const category = await getCategoryById(id);

    if (!category) {
        throw new Error("Category not found.");
    }

    return category;
};


// ======================================
// ✅ UPDATE CATEGORY
// ======================================
const updateCategoryService = async (id, data) => {

    const category = await getCategoryById(id);

    if (!category) {
        throw new Error("Category not found.");
    }

    // 🔥 Name change → update slug
    if (data.name && data.name !== category.name) {

        const existingCategory = await findCategoryByName(data.name);

        if (existingCategory) {
            throw new Error("Category already exists.");
        }

        data.slug = slugify(data.name, { lower: true });
    }

    // 🔥 Normalize parent
    if (data.parent === "") {
        data.parent = null;
    }

    return await updateCategory(id, data);
};


module.exports = {
    createCategoryService,
    getAllCategoriesService,
    getCategoryService,
    getCategoryBySlugService,
    updateCategoryService,
};