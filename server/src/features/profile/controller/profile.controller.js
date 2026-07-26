const {
    getProfileService,
    updateProfileService,
    changePasswordService,
    deleteAccountService,
} = require("../services/profile.services");


// ======================================
// Get Profile
// ======================================
const getProfileController = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const user = await getProfileService(userId);

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            user,
        });

    } catch (error) {
        next(error);
    }
};


// ======================================
// Update Profile
// ======================================
const updateProfileController = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const updatedUser = await updateProfileService(
            userId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });

    } catch (error) {

        if (error.field) {
            return res.status(400).json({
                success: false,
                errors: [
                    {
                        field: error.field,
                        message: error.message,
                    },
                ],
            });
        }

        next(error);
    }
};


// ======================================
// Change Password
// ======================================
const changePasswordController = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        await changePasswordService(userId, req.body);

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {

        if (error.field) {
            return res.status(400).json({
                success: false,
                errors: [
                    {
                        field: error.field,
                        message: error.message,
                    },
                ],
            });
        }

        next(error);
    }
};


// ======================================
// Delete Account
// ======================================
const deleteAccountController = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        await deleteAccountService(userId, req.body);

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });

    } catch (error) {

        if (error.field) {
            return res.status(400).json({
                success: false,
                errors: [
                    {
                        field: error.field,
                        message: error.message,
                    },
                ],
            });
        }

        next(error);
    }
};


module.exports = {
    getProfileController,
    updateProfileController,
    changePasswordController,
    deleteAccountController,
};