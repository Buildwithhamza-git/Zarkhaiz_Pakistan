const Seller = require("../model/seller.model");

const createSeller = async (sellerData) => {
    return await Seller.create(sellerData);
};

const findSellerByUserId = async (userId) => {
    return await Seller.findOne({ user: userId });
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
            new: true,
            runValidators: true,
        }
    );
};

const deleteSeller = async (sellerId) => {
    return await Seller.findByIdAndDelete(sellerId);
};

module.exports = {
    createSeller,
    findSellerByUserId,
    findSellerById,
    findSellerByCNIC,
    updateSeller,
    deleteSeller,
};