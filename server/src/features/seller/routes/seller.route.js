const router = require("express").Router();

const sellerController = require("../controller/seller.controller");
const validateRequest = require("../../../middlewares/validateRequest");
const { SellerSchema, UpdateSellerProfileSchema } = require("../validations/seller.validation");
const authenticate = require("../../../middlewares/authenticate");
const requireAdmin = require("../../../middlewares/requireAdmin");
const uploadSeller = require("../../../shared/uploadmiddleware/uploadSeller")

router.get("/me",authenticate,sellerController.getCurrentSeller);
router.post("/register", authenticate,uploadSeller.fields([
        { name: "cnicFront", maxCount: 1 },
        { name: "cnicBack", maxCount: 1 },
        { name: "logo", maxCount: 1 }, // if your form has a logo
    ]),validateRequest(SellerSchema),sellerController.registerSeller);

router.get("/profile",authenticate,sellerController.getSellerProfile);

router.patch("/profile", authenticate, uploadSeller.single("logo"), validateRequest(UpdateSellerProfileSchema), sellerController.updateSellerProfile);

router.get("/dashboard",authenticate,sellerController.getSellerDashboard);

// ==========================================
// Admin Only
// ==========================================

router.get("/admin/sellers", authenticate, requireAdmin, sellerController.listSellers);

router.patch("/admin/:sellerId/approve", authenticate, requireAdmin, sellerController.approveSeller);

router.patch("/admin/:sellerId/reject", authenticate, requireAdmin, sellerController.rejectSeller);

router.delete("/admin/:sellerId", authenticate, requireAdmin, sellerController.deleteSeller);

module.exports = router;