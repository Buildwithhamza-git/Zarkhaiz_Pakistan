const router = require("express").Router();

const authenticate = require("../../../middlewares/authenticate");
const validateRequest = require("../../../middlewares/validateRequest");

const uploadProduct = require("../../../shared/uploadmiddleware/uploadProduct");

const { ProductSchema } = require("../validation/product.validation");

const {
    createProduct,
    getAllProducts,
    getSellerProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} = require("../controller/product.controller");


// ====================================
// Public Routes
// ====================================

router.get("/", getAllProducts);


// ====================================
// Seller Routes
// ====================================

router.get(
    "/my-products",
    authenticate,
    getSellerProducts
);

router.post(
    "/",
    authenticate,
    uploadProduct.array("images", 5),
    validateRequest(ProductSchema),
    createProduct
);

router.patch(
    "/:id",
    authenticate,
    uploadProduct.array("images", 5),
    validateRequest(ProductSchema.partial()),
    updateProduct
);

router.delete(
    "/:id",
    authenticate,
    deleteProduct
);


// ====================================
// Public Product Details
// ====================================

router.get("/:id", getProduct);

module.exports = router;