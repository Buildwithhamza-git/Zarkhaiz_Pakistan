
const { User } = require("./user.model");

const findUserById = async (userId) => {
    return await User.findById(userId).select("-password -otp -refreshToken");
};

const updateUserProfile = async (userId, data) => {
    return await User.findByIdAndUpdate(
        userId,
        data,
        {
            returnDocument: "after",
            runValidators: true,
        }
    ).select("-password -otp -refreshToken");
};

const findUserByUsername = async (username, excludeId) => {
    return await User.findOne({
        username,
        _id: { $ne: excludeId },
    });
};

const findUserByPhone = async (phone, excludeId) => {
    return await User.findOne({
        phone,
        _id: { $ne: excludeId },
    });
};

module.exports = {
    findUserById,
    updateUserProfile,
    findUserByUsername,
    findUserByPhone,
};