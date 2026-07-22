const router = require("express").Router();

const authenticate = require("../../../middlewares/authenticate");
const validateRequest = require("../../../middlewares/validateRequest");

const {
    CreateCategorySchema,
    UpdateCategorySchema,
} = require("../validation/category.validation");

const {
    createCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory,
} = require("../controller/category.controller");

// Create Category (Admin)
router.post(
    "/",
    authenticate,
    validateRequest(CreateCategorySchema),
    createCategory
);

// Get All Categories (Public)
router.get(
    "/",
    getAllCategories
);

// Get Single Category (Public)
router.get(
    "/:id",
    getCategory
);

// Update Category (Admin)
router.patch(
    "/:id",
    authenticate,
    validateRequest(UpdateCategorySchema),
    updateCategory
);

// Delete Category (Admin)
// router.delete(
//     "/:id",
//     authenticate,
//     deleteCategory
// );

module.exports = router;