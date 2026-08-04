import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required.").max(100),
  phone: z.string().trim().min(7, "Phone number is required.").max(20),
  address: z.string().trim().min(3, "Street address is required.").max(200),
  city: z.string().trim().min(2, "City is required.").max(100),
  province: z.string().trim().min(2, "Province is required.").max(100),
  postalCode: z.string().trim().max(20).optional().or(z.literal("")),
  country: z.string().trim().min(2, "Country is required.").max(100),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});
