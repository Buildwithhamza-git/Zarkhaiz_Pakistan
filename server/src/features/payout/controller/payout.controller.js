const payoutService = require("../service/payout.service");

// ==============================================
// GET /payouts/earnings
// ==============================================

const getEarnings = async (req, res, next) => {
    try {
        const data = await payoutService.getEarningsSummaryService(
            req.user.userId
        );

        return res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

// ==============================================
// GET /payouts/analytics
// ==============================================

const getAnalytics = async (req, res, next) => {
    try {
        const data = await payoutService.getAnalyticsService(
            req.user.userId
        );

        return res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

// ==============================================
// GET /payouts
// ==============================================

const listPayouts = async (req, res, next) => {
    try {
        const data = await payoutService.listPayoutsService(
            req.user.userId,
            req.query
        );

        return res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

// ==============================================
// POST /payouts
// ==============================================

const requestPayout = async (req, res, next) => {
    try {
        const payout = await payoutService.requestPayoutService(
            req.user.userId,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Payout request submitted.",
            data: payout,
        });
    } catch (error) {
        next(error);
    }
};

// ==============================================
// PATCH /payouts/:id/cancel
// ==============================================

const cancelPayout = async (req, res, next) => {
    try {
        const payout = await payoutService.cancelPayoutService(
            req.user.userId,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Payout request cancelled.",
            data: payout,
        });
    } catch (error) {
        next(error);
    }
};

// ==============================================
// GET /payouts/admin
// ==============================================

const listAdminPayouts = async (req, res, next) => {
    try {
        const data = await payoutService.listAdminPayoutsService(req.query);

        return res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

// ==============================================
// PATCH /payouts/admin/:id/status
// ==============================================

const updatePayoutStatus = async (req, res, next) => {
    try {
        const payout = await payoutService.updatePayoutStatusService(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Payout updated.",
            data: payout,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getEarnings,
    getAnalytics,
    listPayouts,
    requestPayout,
    cancelPayout,
    listAdminPayouts,
    updatePayoutStatus,
};
