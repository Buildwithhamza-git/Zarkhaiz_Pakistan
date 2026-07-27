const router = require("express").Router();

const authenticate = require("../../../middlewares/authenticate");
const validateRequest = require("../../../middlewares/validateRequest");

const uploadProduct = require("../../../shared/uploadmiddleware/uploadProduct");

const { ProductSchema, ProductUpdateSchema } = require("../validation/product.validation");

const {
    createProduct,
    getAllProducts,
    getSellerProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getLatestProducts,
    getProductsByCategory,
} = require("../controller/product.controller");


// ====================================
// Public Routes
// ====================================

router.get("/", getAllProducts);

router.get("/featured", getFeaturedProducts);

router.get("/latest", getLatestProducts);

router.get("/category/:categoryId", getProductsByCategory);


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
    validateRequest(ProductUpdateSchema),
    updateProduct
);

router.delete(
    "/:id",
    authenticate,
    deleteProduct
);


// ====================================
// Product Details (Must Be Last)
// ====================================

router.get("/:id", getProduct);

module.exports = router;