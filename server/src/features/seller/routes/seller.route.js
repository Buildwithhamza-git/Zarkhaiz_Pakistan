const router = require("express").Router();

const sellerController = require("../controller/seller.controller");
const validateRequest = require("../../../middlewares/validateRequest");
const { SellerSchema } = require("../validations/seller.validation");
const authenticate = require("../../../middlewares/authenticate");
const uploadSeller = require("../../../shared/uploadmiddleware/uploadSeller")

router.get("/me",authenticate,sellerController.getCurrentSeller);
router.post("/register", authenticate,uploadSeller.fields([
        { name: "cnicFront", maxCount: 1 },
        { name: "cnicBack", maxCount: 1 },
        { name: "logo", maxCount: 1 }, // if your form has a logo
    ]),validateRequest(SellerSchema),sellerController.registerSeller);

router.get("/profile",authenticate,sellerController.getSellerProfile);

router.get("/dashboard",authenticate,sellerController.getSellerDashboard);
module.exports = router;