const router = require("express").Router();

router.use("/auth", require("../features/auth/auth.routes"));

// Later
// router.use("/products", require("../features/products/product.routes"));
// router.use("/categories", require("../features/categories/category.routes"));
// router.use("/seller", require("../features/seller/seller.routes"));
// router.use("/orders", require("../features/orders/order.routes"));
// router.use("/cart", require("../features/cart/cart.routes"));
// router.use("/admin", require("../features/admin/admin.routes"));

module.exports = router;