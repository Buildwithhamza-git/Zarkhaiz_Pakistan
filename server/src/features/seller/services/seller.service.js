const sellerRepository = require("../repository/seller.repository");
const userRepository = require("../..//auth/auth.repository");

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


module.exports = {
    registerSeller,getSellerProfile
};