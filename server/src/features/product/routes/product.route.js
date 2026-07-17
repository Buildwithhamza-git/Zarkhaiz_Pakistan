const router = require("express").Router();

const uploadProduct = require("../../../shared/uploadmiddleware/uploadProduct");
const validateRequest = require("../../../middlewares/validateRequest");
const  {ProductSchema}  = require("../validation/product.validation")

const authenticate = require("../../../middlewares/authenticate");

const {
    createProduct,
    getAllProducts,
    getSellerProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} = require("../controller/product.controller");

// Public Routes
router.get("/", getAllProducts);
router.get("/seller/my-products", authenticate, getSellerProducts);
router.get("/:id", getProduct);

// Seller Routes

router.post(
    "/",
    authenticate,
    uploadProduct.array("images", 4),
    validateRequest(ProductSchema),
    createProduct
);

router.patch(
    "/:id",
    authenticate,
    uploadProduct.array("images", 4),
    validateRequest(ProductSchema.partial()),
    updateProduct
);

router.delete(
    "/:id",
    authenticate,
    deleteProduct
);

module.exports = router;