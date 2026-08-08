const mongoose = require("mongoose");

const AppError = require("../../../shared/utils/AppError");

const Seller = require("../../seller/model/seller.model");
const payoutRepository = require("../repository/payout.repository");

const roundMoney = (value) => Math.round((value || 0) * 100) / 100;

const resolveSeller = async (userId) => {
    const seller = await Seller.findOne({ user: userId }).lean();

    if (!seller) {
        throw new AppError("Seller profile not found.", 404);
    }

    return seller;
};

const getPagination = (query = {}) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));

    return { page, limit };
};

// ==============================================
// Earnings summary
// ==============================================

const getEarningsSummaryService = async (userId) => {
    const seller = await resolveSeller(userId);

    const [itemStats, payoutTotals] = await Promise.all([
        payoutRepository.getSellerItemStats(seller._id),
        payoutRepository.getPayoutTotals(seller._id),
    ]);

    const earned = itemStats.earnedRevenue;
    const paidOut = payoutTotals.paidOut;
    const pendingRequests = payoutTotals.pendingRequests;

    const available = roundMoney(
        Math.max(0, earned - paidOut - pendingRequests)
    );

    return {
        earned,
        inTransit: itemStats.inTransitRevenue,
        paidOut,
        pendingRequests,
        available,
        totalOrders: itemStats.totalOrders,
        earnedOrders: itemStats.earnedOrders,
        unitsSold: itemStats.unitsSold,
        totalValue: itemStats.totalValue,
        account: {
            bankName: seller.bankName || "",
            accountTitle: seller.accountTitle || "",
            iban: seller.iban || "",
            jazzCash: seller.jazzCash || "",
            easyPaisa: seller.easyPaisa || "",
        },
    };
};

// ==============================================
// Analytics
// ==============================================

const getAnalyticsService = async (userId) => {
    const seller = await resolveSeller(userId);

    const [itemStats, monthly, weekly, statusBreakdown, topProducts] =
        await Promise.all([
            payoutRepository.getSellerItemStats(seller._id),
            payoutRepository.getSellerMonthlyRevenue(seller._id),
            payoutRepository.getSellerWeeklyRevenue(seller._id),
            payoutRepository.getSellerStatusBreakdown(seller._id),
            payoutRepository.getSellerTopProducts(seller._id),
        ]);

    const totalOrders = itemStats.totalOrders;

    return {
        summary: {
            revenue: itemStats.earnedRevenue,
            orders: totalOrders,
            earnedOrders: itemStats.earnedOrders,
            units: itemStats.unitsSold,
            avgOrderValue: totalOrders
                ? roundMoney(itemStats.earnedRevenue / totalOrders)
                : 0,
        },
        monthly,
        weekly,
        statusBreakdown,
        topProducts,
    };
};

// ==============================================
// Seller: list payouts
// ==============================================

const listPayoutsService = async (userId, query = {}) => {
    const seller = await resolveSeller(userId);

    const { page, limit } = getPagination(query);

    return await payoutRepository.findPayoutsBySeller(seller._id, {
        page,
        limit,
    });
};

// ==============================================
// Seller: request a payout
// ==============================================

const requestPayoutService = async (userId, { amount, method }) => {
    const seller = await resolveSeller(userId);

    const value = roundMoney(Number(amount) || 0);

    if (value <= 0) {
        throw new AppError("Payout amount must be greater than zero.", 400);
    }

    const [itemStats, payoutTotals] = await Promise.all([
        payoutRepository.getSellerItemStats(seller._id),
        payoutRepository.getPayoutTotals(seller._id),
    ]);

    const available = roundMoney(
        Math.max(
            0,
            itemStats.earnedRevenue -
                payoutTotals.paidOut -
                payoutTotals.pendingRequests
        )
    );

    if (value > available) {
        throw new AppError(
            `Insufficient balance. You can withdraw up to ${available}.`,
            400
        );
    }

    return await payoutRepository.createPayout({
        seller: seller._id,
        amount: value,
        method: ["jazzcash", "easypaisa"].includes(method)
            ? method
            : "bank",
    });
};

// ==============================================
// Seller: cancel a pending payout
// ==============================================

const cancelPayoutService = async (userId, payoutId) => {
    const seller = await resolveSeller(userId);

    if (!mongoose.Types.ObjectId.isValid(payoutId)) {
        throw new AppError("Invalid payout id.", 400);
    }

    const payout = await payoutRepository.findPayoutById(payoutId);

    if (!payout || String(payout.seller) !== String(seller._id)) {
        throw new AppError("Payout not found.", 404);
    }

    if (payout.status !== "pending") {
        throw new AppError("Only pending payouts can be cancelled.", 400);
    }

    return await payoutRepository.updatePayout(payoutId, {
        status: "cancelled",
        processedAt: new Date(),
    });
};

// ==============================================
// Admin: list all payouts
// ==============================================

const listAdminPayoutsService = async (query = {}) => {
    const { page, limit } = getPagination(query);

    return await payoutRepository.findAllPayouts({
        page,
        limit,
        status: query.status,
    });
};

// ==============================================
// Admin: process a payout
// ==============================================

const updatePayoutStatusService = async (
    payoutId,
    { status, reference, adminNote } = {}
) => {
    if (!mongoose.Types.ObjectId.isValid(payoutId)) {
        throw new AppError("Invalid payout id.", 400);
    }

    const payout = await payoutRepository.findPayoutById(payoutId);

    if (!payout) {
        throw new AppError("Payout not found.", 404);
    }

    const allowedTransitions = {
        pending: ["approved", "rejected"],
        approved: ["paid", "rejected"],
    };

    const allowed = allowedTransitions[payout.status] || [];

    if (!allowed.includes(status)) {
        throw new AppError(
            `Cannot change a ${payout.status} payout to ${status}.`,
            400
        );
    }

    const update = {
        status,
        adminNote: adminNote || "",
        processedAt: new Date(),
    };

    if (status === "paid" && reference) {
        update.reference = reference;
    }

    return await payoutRepository.updatePayout(payoutId, update);
};

module.exports = {
    getEarningsSummaryService,
    getAnalyticsService,
    listPayoutsService,
    requestPayoutService,
    cancelPayoutService,
    listAdminPayoutsService,
    updatePayoutStatusService,
};
