const sellerService = require("../services/seller.service");


const registerSeller = async (req, res, next) => {
    try {

        if (req.files?.logo) {
            req.body.logo = req.files.logo[0].path;
        }

        if (req.files?.cnicFront) {
            req.body.cnicFront = req.files.cnicFront[0].path;
        }

        if (req.files?.cnicBack) {
            req.body.cnicBack = req.files.cnicBack[0].path;
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

const updateSellerProfile = async (req, res, next) => {

    try {

        if (req.file) {
            req.body.logo = req.file.path;
        }

        const seller = await sellerService.updateSellerProfileService(
            req.user.userId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Seller profile updated successfully.",
            data: seller,
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

const listSellers = async (req, res, next) => {
    try {

        const sellers = await sellerService.listSellersService(
            req.query.status
        );

        return res.status(200).json({
            success: true,
            data: sellers,
        });

    } catch (error) {
        next(error);
    }
};

const approveSeller = async (req, res, next) => {
    try {

        const seller = await sellerService.updateSellerStatusService(
            req.params.sellerId,
            "approved"
        );

        return res.status(200).json({
            success: true,
            message: "Seller approved successfully.",
            data: seller,
        });

    } catch (error) {
        next(error);
    }
};

const rejectSeller = async (req, res, next) => {
    try {

        const seller = await sellerService.updateSellerStatusService(
            req.params.sellerId,
            "rejected"
        );

        return res.status(200).json({
            success: true,
            message: "Seller rejected.",
            data: seller,
        });

    } catch (error) {
        next(error);
    }
};

const deleteSeller = async (req, res, next) => {
    try {

        await sellerService.deleteSellerService(
            req.params.sellerId
        );

        return res.status(200).json({
            success: true,
            message: "Seller deleted successfully.",
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerSeller,
    getSellerProfile,
    updateSellerProfile,
    getSellerDashboard,
    getCurrentSeller,
    listSellers,
    approveSeller,
    rejectSeller,
    deleteSeller,
};