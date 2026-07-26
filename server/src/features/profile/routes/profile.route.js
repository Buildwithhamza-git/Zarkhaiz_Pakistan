const express = require("express");

const authenticate = require("../../../middlewares/authenticate");
const validate = require("../../../middlewares/validateRequest");

const {
    updateProfileSchema,changePasswordSchema
} = require("../validations/profile.validation");

const {
    getProfileController,
    updateProfileController,
    changePasswordController,
    deleteAccountController
} = require("../controller/profile.controller");

const router = express.Router();

router.get(
    "/",
    authenticate,
    getProfileController
);

router.put(
    "/",
    authenticate,
    validate(updateProfileSchema),
    updateProfileController
);

router.put(
    "/change-password",
    authenticate,
    validate(changePasswordSchema),
    changePasswordController
);


router.delete(
    "/delete-account",
    authenticate,
    deleteAccountController
);

module.exports = router;