const { z } = require("zod");

const CategorySchema = z.object({

    name: z
        .string()
        .min(2)
        .max(50),

    isActive: z
        .boolean()
        .optional()

});

module.exports = { CategorySchema };