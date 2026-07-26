const bcrypt = require("bcrypt");

const {
    findUserById,
    findUserByUsername,
    findUserByPhone,
    updateUserProfile,
    updateUserPassword,
    deleteUserById,
    findUserWithPasswordById
} = require("../repositories/profile.repository");


// ======================================
// Get Profile Service
// ======================================
const getProfileService = async (userId) => {
    const user = await findUserById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};


// ======================================
// Update Profile Service
// ======================================
const updateProfileService = async (userId, data) => {

    const existingUsername = await findUserByUsername(
        data.username,
        userId
    );

    if (existingUsername) {
        const error = new Error("Username already exists");
        error.field = "username";
        throw error;
    }

    const existingPhone = await findUserByPhone(
        data.phone,
        userId
    );

    if (existingPhone) {
        const error = new Error("Phone already exists");
        error.field = "phone";
        throw error;
    }

    const updatedUser = await updateUserProfile(userId, data);

    return updatedUser;
};


// ======================================
// Change Password Service
// ======================================
const changePasswordService = async (userId, data) => {

    const { currentPassword, newPassword } = data;

    const user = await findUserWithPasswordById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    // 🔐 check current password
    const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isMatch) {
        const error = new Error("Current password is incorrect");
        error.field = "currentPassword";
        throw error;
    }

    // 🚫 prevent reuse
    const isSame = await bcrypt.compare(
        newPassword,
        user.password
    );

    if (isSame) {
        const error = new Error("New password must be different");
        error.field = "newPassword";
        throw error;
    }

    // 🔒 hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await updateUserPassword(userId, hashedPassword);

    return true;
};


// ======================================
// Delete Account Service
// ======================================
const deleteAccountService = async (userId, data) => {

    const { password } = data;

    const user = await findUserWithPasswordById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    // 🔐 verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const error = new Error("Incorrect password");
        error.field = "password";
        throw error;
    }

    await deleteUserById(userId);

    return true;
};


module.exports = {
    getProfileService,
    updateProfileService,
    changePasswordService,
    deleteAccountService,
};