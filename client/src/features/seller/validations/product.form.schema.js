import { z } from "zod";

export const productSchema = z.object({
    name: z.string()
        .min(3, "Product name is required")
        .max(120),

    description: z.string()
        .min(10, "Description is required")
        .max(3000),

    category: z.string().min(1),

    price: z.coerce.number()
        .positive(),

    quantity: z.coerce.number()
        .nonnegative(),

    unit: z.enum([
        "kg",
        "g",
        "ton",
        "litre",
        "ml",
        "bag",
        "packet",
        "piece",
        "dozen",
    ]),

    status: z.enum([
        "Active",
        "Inactive",
        "Out of Stock",
    ]),

    featured: z.boolean().optional(),
});