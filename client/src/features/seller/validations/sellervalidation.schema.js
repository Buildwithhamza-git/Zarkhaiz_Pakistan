igimport { z } from "zod";

/* ============================================================
   REGEX
============================================================ */

const nameRegex = /^[A-Za-z ]+$/;
const storeRegex = /^[A-Za-z0-9 ]+$/;
const cnicRegex = /^\d{13}$/;
const phoneRegex = /^(03\d{9}|\+923\d{9}|923\d{9})$/;
const ibanRegex = /^[A-Za-z0-9]+$/;

/* ============================================================
   STORE STEP (STEP 1)
============================================================ */

export const storeSchema = z.object({

    logo: z
        .any()
        .optional()
        .refine(
            (file) =>
                !file ||
                (file instanceof File &&
                    ["image/png", "image/jpeg", "image/jpg"].includes(file.type)),
            "Only PNG, JPG and JPEG images are allowed."
        )
        .refine(
            (file) =>
                !file ||
                file.size <= 2 * 1024 * 1024,
            "Image size must not exceed 2 MB."
        ),

    storeName: z
        .string({ required_error: "Store name is required." })
        .trim()
        .min(3, "Store name must be at least 3 characters.")
        .max(60, "Store name cannot exceed 60 characters.")
        .regex(
            storeRegex,
            "Store name can contain only letters, numbers and spaces."
        ),

    description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters.")
        .optional(),

    province: z
        .string({ required_error: "Province is required." })
        .trim()
        .regex(
            nameRegex,
            "Province can contain only letters."
        ),

    city: z
        .string({ required_error: "City is required." })
        .trim()
        .regex(
            nameRegex,
            "City can contain only letters."
        ),

    address: z
        .string({ required_error: "Store address is required." })
        .trim()
        .min(10, "Address must be at least 10 characters.")
        .max(200, "Address cannot exceed 200 characters."),
});

/* ============================================================
   BUSINESS STEP (STEP 2)
============================================================ */

export const businessSchema = z.object({

    businessType: z.enum(
        ["Individual", "Farmer", "Company"],
        {
            required_error: "Please select a business type.",
        }
    ),

    cnic: z
        .string({ required_error: "CNIC is required." })
        .trim()
        .regex(
            cnicRegex,
            "CNIC must contain exactly 13 digits."
        ),
});

/* ============================================================
   BANK STEP (STEP 3)
============================================================ */

export const bankSchema = z
    .object({

        bankName: z.string().trim().optional(),
        accountTitle: z.string().trim().optional(),
        iban: z.string().trim().optional(),
        jazzCash: z.string().trim().optional(),
        easyPaisa: z.string().trim().optional(),

    })
    .superRefine((data, ctx) => {
    const hasBank =
        data.bankName ||
        data.accountTitle ||
        data.iban;

    const hasJazz = !!data.jazzCash;
    const hasEasy = !!data.easyPaisa;

    const hasAnyMethod = hasBank || hasJazz || hasEasy;

    /* ❌ NOTHING PROVIDED */
    if (!hasAnyMethod) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["bankName"],
            message:
                "Provide Bank details, JazzCash or EasyPaisa.",
        });
        return;
    }

    /* ✅ GLOBAL RULE (IMPORTANT FIX) */
    if (!data.accountTitle) {
        ctx.addIssue({
            code: "custom",
            path: ["accountTitle"],
            message: "Account title is required.",
        });
    } else if (!nameRegex.test(data.accountTitle)) {
        ctx.addIssue({
            code: "custom",
            path: ["accountTitle"],
            message: "Only letters allowed.",
        });
    }

    /* ================= BANK ================= */
    if (data.bankName || data.iban) {

        if (!data.bankName) {
            ctx.addIssue({
                code: "custom",
                path: ["bankName"],
                message: "Bank name is required.",
            });
        } else if (!nameRegex.test(data.bankName)) {
            ctx.addIssue({
                code: "custom",
                path: ["bankName"],
                message: "Bank name must contain only letters.",
            });
        }

        if (!data.iban) {
            ctx.addIssue({
                code: "custom",
                path: ["iban"],
                message: "IBAN is required.",
            });
        } else if (!ibanRegex.test(data.iban)) {
            ctx.addIssue({
                code: "custom",
                path: ["iban"],
                message: "Invalid IBAN format.",
            });
        }
    }

    /* ================= JAZZCASH ================= */
    if (hasJazz && !phoneRegex.test(data.jazzCash)) {
        ctx.addIssue({
            code: "custom",
            path: ["jazzCash"],
            message: "Invalid mobile number.",
        });
    }

    /* ================= EASYPAISA ================= */
    if (hasEasy && !phoneRegex.test(data.easyPaisa)) {
        ctx.addIssue({
            code: "custom",
            path: ["easyPaisa"],
            message: "Invalid mobile number.",
        });
    }
});

/* ============================================================
   DOCUMENT STEP (STEP 4)
============================================================ */

const fileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
];

export const documentSchema = z.object({

    documents: z.object({

        cnicFront: z
            .any()
            .refine(
                (file) => file instanceof File,
                "Upload CNIC front."
            )
            .refine(
                (file) =>
                    fileTypes.includes(file.type),
                "Only PNG, JPG, JPEG or PDF allowed."
            )
            .refine(
                (file) =>
                    file.size <= 5 * 1024 * 1024,
                "Max file size is 5MB."
            ),

        cnicBack: z
            .any()
            .refine(
                (file) => file instanceof File,
                "Upload CNIC back."
            )
            .refine(
                (file) =>
                    fileTypes.includes(file.type),
                "Only PNG, JPG, JPEG or PDF allowed."
            )
            .refine(
                (file) =>
                    file.size <= 5 * 1024 * 1024,
                "Max file size is 5MB."
            ),
    }),
});