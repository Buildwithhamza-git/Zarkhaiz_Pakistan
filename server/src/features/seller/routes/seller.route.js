const router = require("express").Router();

const sellerController = require("../controller/seller.controller");
const validateRequest = require("../../../middlewares/validateRequest");
const { SellerSchema } = require("../validations/seller.validation");
const authenticate = require("../../../middlewares/authenticate");


router.post(
    "/register",
    authenticate,
    validateRequest(SellerSchema),
    sellerController.registerSeller
);

module.exports = router;