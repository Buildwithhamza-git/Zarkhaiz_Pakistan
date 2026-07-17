const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {

            const result = await schema.safeParseAsync(req.body);

            if (!result.success) {

                const errors = result.error.issues.map(issue => ({
                    field: issue.path[0],
                    message: issue.message,
                }));

                return res.status(400).json({
                    success: false,
                    message: "Invalid Inputs",
                    errors,});
            }
            req.body = result.data;

            next();

        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });

        }
    };
};

module.exports = validateRequest;