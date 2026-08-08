const Seller = require("../model/seller.model");

const createSeller = async (sellerData) => {
    return await Seller.create(sellerData);
};

const findSellerByUserId = async (userId) => {
    return await Seller.findOne({
        user: userId,
    }).populate(
        "user",
        "firstname lastname email profilePicture"
    );
};

const findSellerById = async (sellerId) => {
    return await Seller.findById(sellerId);
};

const findSellerByCNIC = async (cnic) => {
    return await Seller.findOne({ cnic });
};

const updateSeller = async (sellerId, updateData) => {
    return await Seller.findByIdAndUpdate(
        sellerId,
        updateData,
        {
            returnDocument: "after",
            runValidators: true,
        }
    );
};

const deleteSeller = async (sellerId) => {
    return await Seller.findByIdAndDelete(sellerId);
};

const findSellerDashboardByUserId = async (userId) => {
    return await Seller.findOne({
        user: userId,
    }).populate(
        "user",
        "firstname lastname email profilePicture"
    );
};

const findAllSellers = async (status) => {
    const filter = status && ["pending", "approved", "rejected"].includes(status)
        ? { status }
        : {};

    return await Seller.find(filter)
        .populate(
            "user",
            "firstname lastname email profilePicture phone"
        )
        .sort({ createdAt: -1 });
};

module.exports = {
    createSeller,
    findSellerByUserId,
    findSellerById,
    findSellerByCNIC,
    updateSeller,
    deleteSeller,
    findSellerDashboardByUserId,
    findAllSellers
};