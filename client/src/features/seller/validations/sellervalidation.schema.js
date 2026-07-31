
import { z } from "zod";
/* ============================================================
   REGEX
============================================================ */

const nameRegex = /^[A-Za-z ]+$/;
// Alphanumeric input allowed, but plain numeric-only strings are rejected
const storeRegex = /^(?!\d+$)[a-zA-Z0-9\s\-,.#]+$/;
const addressRegex = /^(?!\d+$)[a-zA-Z0-9\s\-,.#]+$/;
const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

const phoneRegex = /^(03\d{9}|\+923\d{9}|923\d{9})$/;

// Generic IBAN structural check: 2-letter country code + 2 check digits + up to 30 alphanumeric chars
const ibanGenericRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;

// Known IBAN lengths per country (extend as needed). Used for country-specific validation.
const ibanCountryLengths = {
    PK: 24, // Pakistan
    AE: 23, // UAE
    SA: 24, // Saudi Arabia
    GB: 22, // United Kingdom
    DE: 22, // Germany
    FR: 27, // France
};

function isValidIban(value) {
    if (!value) return false;
    const iban = value.toUpperCase().replace(/\s+/g, "");

    if (iban.length > 34) return false;
    if (!ibanGenericRegex.test(iban)) return false;

    const countryCode = iban.slice(0, 2);
    const expectedLength = ibanCountryLengths[countryCode];

    if (expectedLength && iban.length !== expectedLength) {
        return false;
    }

    return true;
}

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
        .max(25, "Store name cannot exceed 25 characters.")
        .regex(
            storeRegex,
            "Store name must contain letters and cannot be numbers only."
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
        .max(20, "City cannot exceed 20 characters.")
        .regex(
            nameRegex,
            "City can contain only letters."
        ),

    address: z
        .string({ required_error: "Store address is required." })
        .trim()
        .min(10, "Address must be at least 10 characters.")
        .max(100, "Address cannot exceed 100 characters.")
        .regex(
            addressRegex,
            "Store address must contain letters and cannot be numbers only."
        ),
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

        bankName: z
        .string()
        .trim()
        .max(20, "Account title cannot exceed 20 characters.")
        .optional(),
        accountTitle: z
            .string()
            .trim()
            .max(20, "Account title cannot exceed 20 characters.")
            .optional(),
        iban: z
            .string()
            .trim()
            .max(34, "IBAN cannot exceed 34 characters.")
            .optional(),
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
        } else if (!isValidIban(data.iban)) {
            ctx.addIssue({
                code: "custom",
                path: ["iban"],
                message: "Invalid IBAN format for the given country.",
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