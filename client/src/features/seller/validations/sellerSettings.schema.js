import { z } from "zod";

const nameRegex = /^[A-Za-z ]+$/;
const storeRegex = /^[A-Za-z0-9 ]+$/;
const phoneRegex = /^(03\d{9}|\+923\d{9}|923\d{9})$/;
const ibanRegex = /^[A-Za-z0-9]{8,34}$/;

const existingLogo = (value) =>
  !value || typeof value === "string";

export const sellerProfileSettingsSchema = z
  .object({
    logo: z
      .any()
      .optional()
      .refine(
        (value) =>
          existingLogo(value) ||
          (value instanceof File &&
            ["image/png", "image/jpeg", "image/jpg"].includes(value.type)),
        "Only PNG, JPG and JPEG images are allowed."
      )
      .refine(
        (value) =>
          existingLogo(value) ||
          value.size <= 2 * 1024 * 1024,
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
      .regex(nameRegex, "Province can contain only letters."),

    city: z
      .string({ required_error: "City is required." })
      .trim()
      .regex(nameRegex, "City can contain only letters."),

    address: z
      .string({ required_error: "Store address is required." })
      .trim()
      .min(10, "Address must be at least 10 characters.")
      .max(200, "Address cannot exceed 200 characters."),

    bankName: z.string().trim().optional(),
    accountTitle: z.string().trim().optional(),
    iban: z.string().trim().optional(),
    jazzCash: z.string().trim().optional(),
    easyPaisa: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    const hasBank = !!(data.bankName || data.iban);
    const hasJazz = !!data.jazzCash;
    const hasEasy = !!data.easyPaisa;

    const hasAny = hasBank || hasJazz || hasEasy;

    /* ❌ NOTHING PROVIDED */
    if (!hasAny) {
      ctx.addIssue({
        code: "custom",
        path: ["bankName"],
        message: "Provide Bank, JazzCash or EasyPaisa details.",
      });
      return;
    }

    /* ✅ ACCOUNT TITLE REQUIRED FOR ALL */
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
        message: "Account title can contain only letters.",
      });
    }

    /* ================= BANK ================= */
    if (hasBank) {
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
          message: "Bank name can contain only letters.",
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
        message: "Invalid JazzCash number.",
      });
    }

    /* ================= EASYPAISA ================= */
    if (hasEasy && !phoneRegex.test(data.easyPaisa)) {
      ctx.addIssue({
        code: "custom",
        path: ["easyPaisa"],
        message: "Invalid EasyPaisa number.",
      });
    }
  });
