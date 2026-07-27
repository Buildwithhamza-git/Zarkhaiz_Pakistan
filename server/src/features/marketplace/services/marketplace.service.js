const marketplaceRepository = require("../repository/marketplace.repository");

// ======================================
// Get Marketplace Products
// ======================================

const getMarketplaceProducts = async (query) => {
  const {
    search = "",
    category,
    featured,
    minPrice,
    maxPrice,
    sort = "latest",
    page = 1,
    limit = 12,
  } = query;

  // -------------------------
  // Mongo Filter
  // -------------------------

  const filter = {
    status: "Active",
  };

  // Search

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  // Category

  if (category) {
    filter.category = category;
  }

  // Featured

  if (featured === "true") {
    filter.featured = true;
  }

  // Price Range

  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  // -------------------------
  // Sorting
  // -------------------------

  let sortOption = {
    createdAt: -1,
  };

  switch (sort) {
    case "latest":
      sortOption = { createdAt: -1 };
      break;

    case "oldest":
      sortOption = { createdAt: 1 };
      break;

    case "price_low":
      sortOption = { price: 1 };
      break;

    case "price_high":
      sortOption = { price: -1 };
      break;

    case "rating":
      sortOption = { averageRating: -1 };
      break;

    case "popular":
      sortOption = { totalSold: -1 };
      break;

    default:
      sortOption = { createdAt: -1 };
  }

  // -------------------------
  // Pagination
  // -------------------------

  const currentPage = Number(page);

  const pageLimit = Number(limit);

  const skip = (currentPage - 1) * pageLimit;

  // -------------------------
  // Repository Calls
  // -------------------------

  const products = await marketplaceRepository.findProducts({
    filter,
    sort: sortOption,
    skip,
    limit: pageLimit,
  });

  const total = await marketplaceRepository.countProducts(filter);

  return {
    products,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      totalPages: Math.ceil(total / pageLimit),
      hasNext: currentPage < Math.ceil(total / pageLimit),
      hasPrev: currentPage > 1,
    },
  };
};

// ======================================
// Product Details
// ======================================

const getProductDetails = async (id) => {
  const product = await marketplaceRepository.findProductById(id);

  if (!product) {
    throw new Error("Product not found.");
  }

  return product;
};

// ======================================
// Featured Products
// ======================================

const getFeaturedProducts = async () => {
  return await marketplaceRepository.findFeaturedProducts();
};

// ======================================
// Latest Products
// ======================================

const getLatestProducts = async () => {
  return await marketplaceRepository.findLatestProducts();
};

module.exports = {
  getMarketplaceProducts,
  getProductDetails,
  getFeaturedProducts,
  getLatestProducts,
};