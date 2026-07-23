const Product = require("../../product/product.model");

// =======================================
// Find Products
// =======================================

const findProducts = async ({
  filter = {},
  sort = {},
  skip = 0,
  limit = 12,
}) => {
  const products = await Product.find(filter)
    .populate("category", "name")
    .populate({
      path: "seller",
      select: "storeName logo",
    })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  return products;
};

// =======================================
// Count Products
// =======================================

const countProducts = async (filter = {}) => {
  return await Product.countDocuments(filter);
};

// =======================================
// Find Product By Id
// =======================================

const findProductById = async (id) => {
  return await Product.findById(id)
    .populate("category")
    .populate({
      path: "seller",
      populate: {
        path: "user",
        select: "firstname lastname",
      },
    });
};

// =======================================
// Featured Products
// =======================================

const findFeaturedProducts = async (limit = 8) => {
  return await Product.find({
    featured: true,
    status: "Active",
  })
    .populate("category", "name")
    .populate("seller", "storeName logo")
    .sort({ createdAt: -1 })
    .limit(limit);
};

// =======================================
// Latest Products
// =======================================

const findLatestProducts = async (limit = 8) => {
  return await Product.find({
    status: "Active",
  })
    .populate("category", "name")
    .populate("seller", "storeName logo")
    .sort({ createdAt: -1 })
    .limit(limit);
};

module.exports = {
  findProducts,
  countProducts,
  findProductById,
  findFeaturedProducts,
  findLatestProducts,
};