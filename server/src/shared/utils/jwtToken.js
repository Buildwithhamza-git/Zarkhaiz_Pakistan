const jwt = require("jsonwebtoken");

const generateToken = async (User)=>{
    return jwt.sign({
        userId: User._id,
        role: User.role,
        email: User.email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
    )
}

const verifyToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_SECRET
    );
};


module.exports ={generateToken, verifyToken}