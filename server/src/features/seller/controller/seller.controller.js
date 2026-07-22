const sellerService = require("../services/seller.service");

const registerSeller = async (req, res, next) => {
    try {
        if (req.files?.logo) {
            req.body.logo = req.files.logo[0].filename;
        }

        if (req.files?.cnicFront) {
            req.body.cnicFront = req.files.cnicFront[0].filename;
        }

        if (req.files?.cnicBack) {
            req.body.cnicBack = req.files.cnicBack[0].filename;
        }

        const seller = await sellerService.registerSeller(  
            req.user.userId,
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

const getSellerProfile = async (req, res, next) => {

    try {

        const seller = await sellerService.getSellerProfile(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            seller,
        });

    } catch (error) {

        next(error);

    }

};

const getSellerDashboard = async (req, res, next) => {
    try {

        const dashboard =
            await sellerService.getSellerDashboard(
                req.user.userId
            );

        return res.status(200).json({
            success: true,
            data: dashboard,
        });

    } catch (error) {
        next(error);
    }
};

const getCurrentSeller = async (req, res, next) => {
    try {

        const seller = await sellerService.getCurrentSellerService(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            data: seller
                ? { seller }
                : null,
        });

    } catch (error) {
        next(error);
    }
};
module.exports = {
    registerSeller,getSellerProfile, getSellerDashboard, getCurrentSeller
};