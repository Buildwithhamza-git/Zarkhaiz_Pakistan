const { z } = require("zod");

const nameRegex = /^[A-Za-z ]+$/;
const phoneRegex = /^(03\d{9}|\+923\d{9}|923\d{9})$/;

const SellerSchema = z
  .object({
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

    // ✅ MAKE OPTIONAL
    bankName: z.string().optional(),
    accountTitle: z.string().optional(),
    iban: z.string().optional(),
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