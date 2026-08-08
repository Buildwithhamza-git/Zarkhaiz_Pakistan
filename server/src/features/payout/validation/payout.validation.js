const { z } = require("zod");

const requestPayoutSchema = z.object({
    amount: z
        .number("Amount is required.")
        .positive("Amount must be greater than zero.")
        .max(1000000000, "Amount is too large."),

    method: z
        .enum(["bank", "jazzcash", "easypaisa"])
        .optional()
        .default("bank"),
});

const updatePayoutStatusSchema = z.object({
    status: z.enum(["approved", "paid", "rejected"]),

    reference: z
        .string()
        .trim()
        .max(100)
        .optional()
        .or(z.literal("")),

    adminNote: z
        .string()
        .trim()
        .max(500)
        .optional()
        .or(z.literal("")),
});

module.exports = {
    requestPayoutSchema,
    updatePayoutStatusSchema,
};
