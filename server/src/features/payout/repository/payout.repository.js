const mongoose = require("mongoose");

const Order = require("../../order/order.model");
const Payout = require("../model/payout.model");

const asObjectId = (id) => new mongoose.Types.ObjectId(id);

const roundMoney = (value) => Math.round((value || 0) * 100) / 100;

const SELLER_ITEM_VALUE = {
    $multiply: ["$items.price", "$items.quantity"],
};

// ==============================================
// Item-level stats for a seller across ALL orders
// ==============================================

const getSellerItemStats = async (sellerId) => {
    const [all, earned, inTransit] = await Promise.all([
        // Every order that contains this seller's items
        Order.aggregate([
            { $match: { "items.seller": asObjectId(sellerId) } },
            { $unwind: "$items" },
            { $match: { "items.seller": asObjectId(sellerId) } },
            {
                $group: {
                    _id: null,
                    orderIds: { $addToSet: "$_id" },
                    units: { $sum: "$items.quantity" },
                    value: { $sum: SELLER_ITEM_VALUE },
                },
            },
        ]),
        // Earned: only delivered orders
        Order.aggregate([
            {
                $match: {
                    "items.seller": asObjectId(sellerId),
                    orderStatus: "delivered",
                },
            },
            { $unwind: "$items" },
            { $match: { "items.seller": asObjectId(sellerId) } },
            {
                $group: {
                    _id: null,
                    orderIds: { $addToSet: "$_id" },
                    units: { $sum: "$items.quantity" },
                    revenue: { $sum: SELLER_ITEM_VALUE },
                },
            },
        ]),
        // In-transit: processing + shipped (money that is on its way to earned)
        Order.aggregate([
            {
                $match: {
                    "items.seller": asObjectId(sellerId),
                    orderStatus: { $in: ["processing", "shipped"] },
                },
            },
            { $unwind: "$items" },
            { $match: { "items.seller": asObjectId(sellerId) } },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: SELLER_ITEM_VALUE },
                },
            },
        ]),
    ]);

    const allRow = all[0];
    const earnedRow = earned[0];

    return {
        totalOrders: allRow?.orderIds?.length || 0,
        totalValue: roundMoney(allRow?.value),
        unitsSold: allRow?.units || 0,
        earnedRevenue: roundMoney(earnedRow?.revenue),
        earnedOrders: earnedRow?.orderIds?.length || 0,
        inTransitRevenue: roundMoney(inTransit[0]?.revenue),
    };
};

// ==============================================
// Payout totals for a seller
// ==============================================

const getPayoutTotals = async (sellerId) => {
    const rows = await Payout.aggregate([
        { $match: { seller: asObjectId(sellerId) } },
        {
            $group: {
                _id: null,
                paid: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0],
                    },
                },
                pending: {
                    $sum: {
                        $cond: [
                            {
                                $in: [
                                    "$status",
                                    ["pending", "approved"],
                                ],
                            },
                            "$amount",
                            0,
                        ],
                    },
                },
                requested: { $sum: 1 },
            },
        },
    ]);

    const row = rows[0];

    return {
        paidOut: roundMoney(row?.paid),
        pendingRequests: roundMoney(row?.pending),
        requestedCount: row?.requested || 0,
    };
};

// ==============================================
// Monthly revenue trend (delivered orders only)
// ==============================================

const getSellerMonthlyRevenue = async (sellerId, months = 12) => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (months - 1));
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const rows = await Order.aggregate([
        {
            $match: {
                "items.seller": asObjectId(sellerId),
                orderStatus: "delivered",
                createdAt: { $gte: startDate },
            },
        },
        { $unwind: "$items" },
        { $match: { "items.seller": asObjectId(sellerId) } },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                revenue: { $sum: SELLER_ITEM_VALUE },
                units: { $sum: "$items.quantity" },
                orderIds: { $addToSet: "$_id" },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const series = [];

    for (let i = 0; i < months; i++) {
        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + i);

        const match = rows.find(
            (row) =>
                row._id.year === date.getFullYear() &&
                row._id.month === date.getMonth() + 1
        );

        series.push({
            label: date.toLocaleString("en-GB", {
                month: "short",
                year: "2-digit",
            }),
            revenue: roundMoney(match?.revenue),
            orders: match?.orderIds?.length || 0,
            units: match?.units || 0,
        });
    }

    return series;
};

// ==============================================
// Weekly revenue trend (delivered orders only)
// ==============================================

const mondayOfIsoWeek = (year, week) => {
    const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
    const dow = simple.getUTCDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    return new Date(Date.UTC(year, 0, simple.getUTCDate() + mondayOffset));
};

const getSellerWeeklyRevenue = async (sellerId, weeks = 8) => {
    const current = new Date();
    const currentIsoWeek = getIsoWeek(current);
    const series = [];

    for (let i = weeks - 1; i >= 0; i--) {
        const week = currentIsoWeek.week - i;
        let { year } = currentIsoWeek;

        if (week <= 0) {
            year -= 1;
        }

        const start = mondayOfIsoWeek(year, ((week - 1) % 52) + 52);

        series.push({
            weekKey: `${year}-${week}`,
            label: start.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
            }),
            start,
            revenue: 0,
            orders: 0,
            units: 0,
        });
    }

    const firstStart = series[0].start;

    const rows = await Order.aggregate([
        {
            $match: {
                "items.seller": asObjectId(sellerId),
                orderStatus: "delivered",
                createdAt: { $gte: firstStart },
            },
        },
        { $unwind: "$items" },
        { $match: { "items.seller": asObjectId(sellerId) } },
        {
            $project: {
                orderId: "$_id",
                quantity: "$items.quantity",
                value: SELLER_ITEM_VALUE,
                isoWeekYear: { $isoWeekYear: "$createdAt" },
                isoWeek: { $isoWeek: "$createdAt" },
            },
        },
        {
            $group: {
                _id: {
                    isoWeekYear: "$isoWeekYear",
                    isoWeek: "$isoWeek",
                },
                revenue: { $sum: "$value" },
                units: { $sum: "$quantity" },
                orderIds: { $addToSet: "$orderId" },
            },
        },
    ]);

    const rowMap = new Map(
        rows.map((row) => [
            `${row._id.isoWeekYear}-${row._id.isoWeek}`,
            row,
        ])
    );

    return series.map((entry) => {
        const match = rowMap.get(entry.weekKey);

        return {
            label: entry.label,
            revenue: roundMoney(match?.revenue),
            orders: match?.orderIds?.length || 0,
            units: match?.units || 0,
        };
    });
};

const getIsoWeek = (date) => {
    const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(
        ((d - yearStart) / 86400000 + 1) / 7
    );

    return { year: d.getUTCFullYear(), week: weekNo };
};

// ==============================================
// Revenue split by order status
// ==============================================

const getSellerStatusBreakdown = async (sellerId) => {
    const rows = await Order.aggregate([
        { $match: { "items.seller": asObjectId(sellerId) } },
        { $unwind: "$items" },
        { $match: { "items.seller": asObjectId(sellerId) } },
        {
            $group: {
                _id: "$orderStatus",
                revenue: { $sum: SELLER_ITEM_VALUE },
                orderIds: { $addToSet: "$_id" },
            },
        },
    ]);

    const ALL_STATUSES = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
    ];

    const STATUS_LABELS = {
        pending: "Pending",
        processing: "Processing",
        shipped: "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled",
    };

    const rowMap = new Map(rows.map((row) => [row._id, row]));

    return ALL_STATUSES.map((status) => ({
        status,
        label: STATUS_LABELS[status],
        revenue: roundMoney(rowMap.get(status)?.revenue),
        orders: rowMap.get(status)?.orderIds?.length || 0,
    }));
};

// ==============================================
// Top products by revenue (from order item snapshots)
// ==============================================

const getSellerTopProducts = async (sellerId, limit = 6) => {
    return await Order.aggregate([
        {
            $match: {
                "items.seller": asObjectId(sellerId),
                orderStatus: "delivered",
            },
        },
        { $unwind: "$items" },
        { $match: { "items.seller": asObjectId(sellerId) } },
        {
            $group: {
                _id: "$items.product",
                name: { $first: "$items.name" },
                image: { $first: "$items.image" },
                revenue: { $sum: SELLER_ITEM_VALUE },
                units: { $sum: "$items.quantity" },
                orderIds: { $addToSet: "$_id" },
            },
        },
        { $sort: { revenue: -1 } },
        { $limit: limit },
        {
            $project: {
                _id: 1,
                name: 1,
                image: 1,
                revenue: 1,
                units: 1,
                orders: { $size: "$orderIds" },
            },
        },
    ]).then((rows) =>
        rows.map((row) => ({ ...row, revenue: roundMoney(row.revenue) }))
    );
};

// ==============================================
// Payout CRUD
// ==============================================

const createPayout = async (data) => {
    return await Payout.create(data);
};

const findPayoutById = async (payoutId) => {
    return await Payout.findById(payoutId);
};

const updatePayout = async (payoutId, data) => {
    return await Payout.findByIdAndUpdate(payoutId, data, {
        returnDocument: "after",
        runValidators: true,
    });
};

const findPayoutsBySeller = async (
    sellerId,
    { page = 1, limit = 10 } = {}
) => {
    const skip = (page - 1) * limit;

    const filter = { seller: asObjectId(sellerId) };

    const [items, total] = await Promise.all([
        Payout.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Payout.countDocuments(filter),
    ]);

    return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

const findAllPayouts = async (
    { page = 1, limit = 10, status } = {}
) => {
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) {
        filter.status = status;
    }

    const [items, total] = await Promise.all([
        Payout.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("seller", "storeName user"),
        Payout.countDocuments(filter),
    ]);

    return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

module.exports = {
    getSellerItemStats,
    getPayoutTotals,
    getSellerMonthlyRevenue,
    getSellerWeeklyRevenue,
    getSellerStatusBreakdown,
    getSellerTopProducts,
    createPayout,
    findPayoutById,
    updatePayout,
    findPayoutsBySeller,
    findAllPayouts,
};
