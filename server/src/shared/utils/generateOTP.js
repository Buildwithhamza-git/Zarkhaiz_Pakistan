
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


const otpExpiry = () => {
    const now = new Date();
    return new Date(now.getTime() + 2 * 60000);
};


module.exports= { generateOtp, otpExpiry}