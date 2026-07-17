const sellerService = require("../services/seller.service");

const registerSeller = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const seller = await sellerService.registerSeller(
            userId,
            req.body    
        );

        return res.status(201).json({
            success: true,
            message: "Seller registration submitted successfully.",
            data: seller,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerSeller,
};