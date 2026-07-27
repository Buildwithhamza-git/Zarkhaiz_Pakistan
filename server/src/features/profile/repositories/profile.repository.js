const { User } = require("../../users/user.model");


// ===============================
// Find User By Id (SAFE - NO PASSWORD)
// ===============================
const findUserById = async (userId) => {
    return await User.findById(userId)
        .select("-password -otp -refreshToken");
};


// ===============================
// Find User WITH Password (FOR AUTH)
// ===============================
const findUserWithPasswordById = async (userId) => {
    return await User.findById(userId); // includes password
};


// ===============================
// Find Username
// ===============================
const findUserByUsername = async (username, userId) => {
    return await User.findOne({
        username,
        _id: { $ne: userId },
    });
};


// ===============================
// Find Phone
// ===============================
const findUserByPhone = async (phone, userId) => {
    return await User.findOne({
        phone,
        _id: { $ne: userId },
    });
};


// ===============================
// Update User Profile
// ===============================
const updateUserProfile = async (userId, data) => {
    return await User.findByIdAndUpdate(
        userId,
        data,
        {
            new: true,
            runValidators: true,
        }
    ).select("-password -otp -refreshToken");
};


// ===============================
// Update Password
// ===============================
const updateUserPassword = async (userId, hashedPassword) => {
    return await User.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true }
    );
};


// ===============================
// Delete User
// ===============================
const deleteUserById = async (userId) => {
    return await User.findByIdAndDelete(userId);
};


module.exports = {
    findUserById,
    findUserWithPasswordById, // ✅ IMPORTANT
    findUserByUsername,
    findUserByPhone,
    updateUserProfile,
    updateUserPassword,
    deleteUserById,
};