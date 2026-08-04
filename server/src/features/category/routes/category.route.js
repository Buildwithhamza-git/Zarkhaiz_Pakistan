const router = require("express").Router();

const authenticate = require("../../../middlewares/authenticate");
const requireAdmin = require("../../../middlewares/requireAdmin");
const validateRequest = require("../../../middlewares/validateRequest");

const {
    CreateCategorySchema,
    UpdateCategorySchema,
} = require("../validation/category.validation");

const {
    createCategory,
    getAllCategories,
    getCategoryBySlug,
    updateCategory,
    // deleteCategory,
} = require("../controller/category.controller");


// 🔥 CREATE CATEGORY (Admin)
router.post(
    "/",
    authenticate,
    requireAdmin,
    validateRequest(CreateCategorySchema),
    createCategory
);


// 🔥 GET ALL CATEGORIES (Public)
// should return TREE (parent + children)
router.get(
    "/",
    getAllCategories
);


// 🔥 GET SINGLE CATEGORY BY SLUG (Public)
router.get(
    "/slug/:slug",
    getCategoryBySlug
);


// 🔥 UPDATE CATEGORY (Admin)
router.patch(
    "/:id",
    authenticate,
    requireAdmin,
    validateRequest(UpdateCategorySchema),
    updateCategory
);


// 🔥 DELETE CATEGORY (Admin)
// router.delete(
//     "/:id",
//     authenticate,
//     deleteCategory
// );

module.exports = router;