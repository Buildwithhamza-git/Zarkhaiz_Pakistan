const {User} =require("../users/user.model")

const findUserByEmail = async(email)=>{
    return await User.findOne({email}).select('+otp')
}

const findUserByPhone = async (phone) => {
    return await User.findOne({phone})
}

const createUser = async (userData)=>{
    return await User.create(userData)
}

const findUserByUsername = async (username)=>{
    return await User.findOne({username})
}

const updateUserByEmail = async (email, updates)=>{
    return await User.findOneAndUpdate({email}, updates, {returnDocument: "after",
            runValidators: true,})
}


const findUserById = async (id) => {
    return await User.findById(id);
};

const updateUserById = async (id, updates) => {
    return await User.findByIdAndUpdate(
        id,
        updates,
        {
            returnDocument: "after",
            runValidators: true,
        }
    );
};
module.exports= {findUserByEmail, findUserByPhone, createUser, findUserByUsername, updateUserByEmail, findUserById, updateUserById}

