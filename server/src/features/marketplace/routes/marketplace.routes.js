const router = require("express").Router();

const {
  getMarketplaceProducts,
  getProductDetails,
  getFeaturedProducts,
  getLatestProducts,
} = require("../controller/marketplace.controller");

// ======================================
// Marketplace Routes
// ======================================

// Browse products
router.get("/products", getMarketplaceProducts);

// Featured products
router.get("/featured", getFeaturedProducts);

// Latest products
router.get("/latest", getLatestProducts);

// Product Details (Keep Last)
router.get("/products/:id", getProductDetails);

module.exports = router;