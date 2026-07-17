const router = require("express").Router();

const validateRequest = require("../../../middlewares/validateRequest");
const { CategorySchema } = require("../validation/category.validation");

const {
    createCategory,
    getAllCategories,
    getCategory,
    updateCategory,
} = require("../controller/category.controller");

router.post(
    "/",
    validateRequest(CategorySchema),
    createCategory
);

router.get("/", getAllCategories);

router.get("/:id", getCategory);

router.patch(
    "/:id",
    validateRequest(CategorySchema.partial()),
    updateCategory
);

module.exports = router;