const { success } = require("zod")
const { SignupSchema } = require("../validation/authvalidation")

const ValidateSignup = async (req, res, next) => {
    try {

        const validateData = await SignupSchema.safeParseAsync(req.body)

        if (!validateData.success) {
            console.log(validateData.error.message)
            const collectError = validateData.error.issues.map((v) => {
                return { field: v.path[0], message: v.message }
            })
            return res.status(400).json({
                success: false,
                message: "Invalid Input",
                payload: null,
                errors: collectError
            })
        }

        req.sanitizedBody = validateData.data
        next()
    } catch (err) {
        console.error("Internal Server Error", err)
        res.status(500).json({success: false, message:"Internal Server Error"})
    }

}

module.exports = {ValidateSignup}