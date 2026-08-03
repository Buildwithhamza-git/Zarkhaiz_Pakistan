const sellerRepository = require("../repository/seller.repository");
const userRepository = require("../..//auth/auth.repository");
const orderRepository = require("../../order/order.repository");
const AppError = require("../../../shared/utils/AppError");

const registerSeller = async (userId, sellerData) => {

    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new Error("User not found.");
    }


    const existingSeller =
        await sellerRepository.findSellerByUserId(userId);

    if (existingSeller) {
        throw new Error("Seller profile already exists.");
    }

    const existingCNIC =
        await sellerRepository.findSellerByCNIC(
            sellerData.cnic
        );

    if (existingCNIC) {
        throw new Error("CNIC already registered.");
    }


    const seller =
        await sellerRepository.createSeller({
            ...sellerData,
            user: userId,
        });


    await userRepository.updateUserById(userId, {
        sellerStatus: "pending",
    });

    return seller;
};

const getSellerProfile = async (userId) => {

    const seller = await sellerRepository.findSellerByUserId(userId);

    return seller;
};

const updateSellerProfileService = async (userId, updateData) => {

    const seller = await sellerRepository.findSellerByUserId(userId);

    if (!seller) {
        throw new AppError("Seller profile not found.", 404);
    }

    /*
     * Business-critical fields are protected from this endpoint:
     * - CNIC is unique identity data tied to verification.
     * - businessType was verified during approval.
     * - status is managed by admins.
     */
    const safeData = { ...updateData };
    delete safeData.cnic;
    delete safeData.businessType;
    delete safeData.status;
    delete safeData.user;

    await sellerRepository.updateSeller(seller._id, safeData);

    return await sellerRepository.findSellerByUserId(userId);
};


const getSellerDashboard = async (userId) => {

    const seller =
        await sellerRepository.findSellerDashboardByUserId(userId);

    if (!seller) {
        throw new Error("Seller profile not found.");
    }

    const stats = await orderRepository.getSellerDashboardStats(seller._id);

    return {
        seller,
        stats,
    };
};


const getCurrentSellerService = async (userId) => {
    const seller = await sellerRepository.findSellerByUserId(userId);

    // If seller hasn't applied yet
    if (!seller) {
        return null;
    }

    return seller;
};


const listSellersService = async (status) => {
    const sellers = await sellerRepository.findAllSellers(status);

    return sellers;
};


const updateSellerStatusService = async (sellerId, status) => {
    if (!["approved", "rejected"].includes(status)) {
        throw new AppError("Invalid seller status.", 400);
    }

    const seller = await sellerRepository.findSellerById(sellerId);

    if (!seller) {
        throw new AppError("Seller not found.", 404);
    }

    const updatedSeller = await sellerRepository.updateSeller(sellerId, {
        status,
    });

    await userRepository.updateUserById(seller.user, {
        sellerStatus: status,
    });

    return updatedSeller;
};


const deleteSellerService = async (sellerId) => {
    const seller = await sellerRepository.findSellerById(sellerId);

    if (!seller) {
        throw new AppError("Seller not found.", 404);
    }

    await sellerRepository.deleteSeller(sellerId);

    await userRepository.updateUserById(seller.user, {
        sellerStatus: "none",
    });

    return { success: true };
};


module.exports = {
    registerSeller,
    getSellerProfile,
    updateSellerProfileService,
    getSellerDashboard,
    getCurrentSellerService,
    listSellersService,
    updateSellerStatusService,
    deleteSellerService,
};