const router = require("express").Router();

const authenticate = require("../../../middlewares/authenticate");
const requireAdmin = require("../../../middlewares/requireAdmin");
const validateRequest = require("../../../middlewares/validateRequest");

const {
    requestPayoutSchema,
    updatePayoutStatusSchema,
} = require("../validation/payout.validation");

const {
    getEarnings,
    getAnalytics,
    listPayouts,
    requestPayout,
    cancelPayout,
    listAdminPayouts,
    updatePayoutStatus,
} = require("../controller/payout.controller");

// ==============================================
// Seller: Earnings + Analytics (must be before /:id)
// ==============================================

router.get("/earnings", authenticate, getEarnings);

router.get("/analytics", authenticate, getAnalytics);

// ==============================================
// Admin
// ==============================================

router.get("/admin", authenticate, requireAdmin, listAdminPayouts);

router.patch(
    "/admin/:id/status",
    authenticate,
    requireAdmin,
    validateRequest(updatePayoutStatusSchema),
    updatePayoutStatus
);

// ==============================================
// Seller: Payouts
// ==============================================

router.get("/", authenticate, listPayouts);

router.post(
    "/",
    authenticate,
    validateRequest(requestPayoutSchema),
    requestPayout
);

router.patch("/:id/cancel", authenticate, cancelPayout);

module.exports = router;
