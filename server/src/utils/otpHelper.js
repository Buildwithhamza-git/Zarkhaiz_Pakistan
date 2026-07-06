
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


const OtpExpiry =  ()=>{
    const now = new Date()
    return new Date (now.getTime() + 3 *60000)
}

module.exports= { generateOtp, OtpExpiry}