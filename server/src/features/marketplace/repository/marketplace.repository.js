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

    return await Product.find(filter)
        .populate(
            "category",
            "name slug parent"
        )
        .populate({
            path: "seller",
            select: "storeName logo",
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

};


// =======================================
// Count Products
// =======================================

const countProducts = async (filter = {}) => {

    return await Product.countDocuments(
        filter
    );

};


// =======================================
// Find Product By Id
// =======================================

const findProductById = async (id) => {

    return await Product.findById(id)
        .populate("category")
        .populate({
            path: "seller",
            select: "storeName logo",
        });

};


// =======================================
// Featured Products
// =======================================

const findFeaturedProducts = async (
    limit = 8
) => {

    return await Product.find({

        featured: true,

        status: "Active",

        isDeleted: false,

        stock: {
            $gt: 0,
        },

    })
        .populate(
            "category",
            "name slug"
        )
        .populate(
            "seller",
            "storeName logo"
        )
        .sort({
            createdAt: -1,
        })
        .limit(limit)
        .lean();

};


// =======================================
// Latest Products
// =======================================

const findLatestProducts = async (
    limit = 8
) => {

    return await Product.find({

        status: "Active",

        isDeleted: false,

        stock: {
            $gt: 0,
        },

    })
        .populate(
            "category",
            "name slug"
        )
        .populate(
            "seller",
            "storeName logo"
        )
        .sort({
            createdAt: -1,
        })
        .limit(limit)
        .lean();

};


module.exports = {

    findProducts,

    countProducts,

    findProductById,

    findFeaturedProducts,

    findLatestProducts,

};