const { z } = require("zod");

const SellerSchema = z.object({
    storeName: z.string().min(3),

    description: z.string().optional(),

    province: z.string(),

    city: z.string(),

    address: z.string(),

    businessType: z.enum([
        "Individual",
        "Farmer",
        "Company",
    ]),

    cnic: z.string().length(13),

    bankName: z.string(),

    accountTitle: z.string(),

    iban: z.string(),

    jazzCash: z.string().optional(),

    easyPaisa: z.string().optional(),
});

module.exports = {
    SellerSchema,
};