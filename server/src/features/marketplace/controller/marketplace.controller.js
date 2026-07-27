const marketplaceService = require("../services/marketplace.service");

// ======================================
// Get Marketplace Products
// ======================================

const getMarketplaceProducts = async (req, res) => {
  try {
    const result = await marketplaceService.getMarketplaceProducts(req.query);

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Product Details
// ======================================

const getProductDetails = async (req, res) => {
  try {
    const product = await marketplaceService.getProductDetails(req.params.id);

    return res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Featured Products
// ======================================

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await marketplaceService.getFeaturedProducts();

    return res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Latest Products
// ======================================

const getLatestProducts = async (req, res) => {
  try {
    const products = await marketplaceService.getLatestProducts();

    return res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMarketplaceProducts,
  getProductDetails,
  getFeaturedProducts,
  getLatestProducts,
};