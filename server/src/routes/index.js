const router = require("express").Router();

router.use("/auth", require("../features/auth/auth.routes"));
router.use("/seller", require("../features/seller/routes/seller.route"));
router.use("/categories", require("../features/category/routes/category.route"));
router.use("/products", require("../features/product/routes/product.route"));
router.use("/marketplace",require("../features/marketplace/routes/marketplace.routes"));
router.use("/profile",require("../features/profile/routes/profile.route"));
// Later
// router.use("/categories", require("../features/categories/category.routes"));
// router.use("/orders", require("../features/orders/order.routes"));
// router.use("/cart", require("../features/cart/cart.routes"));
// router.use("/admin", require("../features/admin/admin.routes"));

module.exports = router;