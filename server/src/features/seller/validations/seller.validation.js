const { z } = require("zod");

const nameRegex = /^[A-Za-z ]+$/;
const phoneRegex = /^(03\d{9}|\+923\d{9}|923\d{9})$/;
// Alphanumeric input allowed, but plain numeric-only strings are rejected
const storeRegex = /^(?!\d+$)[a-zA-Z0-9\s\-,.#]+$/;

// Generic IBAN structural check + known country-specific lengths
const ibanGenericRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
const ibanCountryLengths = {
  PK: 24,
  AE: 23,
  SA: 24,
  GB: 22,
  DE: 22,
  FR: 27,
};

function isValidIban(value) {
  if (!value) return false;
  const iban = value.toUpperCase().replace(/\s+/g, "");

  if (iban.length > 34) return false;
  if (!ibanGenericRegex.test(iban)) return false;

  const expectedLength = ibanCountryLengths[iban.slice(0, 2)];
  if (expectedLength && iban.length !== expectedLength) return false;

  return true;
}

const SellerSchema = z
  .object({
    storeName: z
      .string()
      .min(3)
      .max(60)
      .regex(storeRegex, "Store name must contain letters and cannot be numbers only."),
    description: z.string().max(500).optional(),
    province: z.string(),
    city: z.string(),
    address: z
      .string()
      .min(10)
      .max(200)
      .regex(storeRegex, "Store address must contain letters and cannot be numbers only."),

    businessType: z.enum([
      "Individual",
      "Farmer",
      "Company",
    ]),

    cnic: z
      .string()
      .regex(
        /^\d{5}-\d{7}-\d{1}$|^\d{13}$/, 
        "CNIC must be 13 digits or formatted as 12345-1234567-1."
      )
      .transform((value) => value.replace(/\D/g, "")),

    // ✅ MAKE OPTIONAL
    bankName: z.string().optional(),
    accountTitle: z.string().max(50, "Account title cannot exceed 50 characters.").optional(),
    iban: z.string().max(34, "IBAN cannot exceed 34 characters.").optional(),
    jazzCash: z.string().optional(),
    easyPaisa: z.string().optional(),
  })

  .superRefine((data, ctx) => {
    const hasBank = data.bankName || data.iban;
    const hasJazz = !!data.jazzCash;
    const hasEasy = !!data.easyPaisa;

    const hasAny = hasBank || hasJazz || hasEasy;

    /* ❌ NOTHING PROVIDED */
    if (!hasAny) {
      ctx.addIssue({
        code: "custom",
        path: ["bankName"],
        message:
          "Provide Bank, JazzCash or EasyPaisa details.",
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
        message: "Only letters allowed.",
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

module.exports = {
  SellerSchema,
};