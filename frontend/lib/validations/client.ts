import { z } from "zod";

export const clientSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  contactPerson: z.string().optional(),
  position: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  contactNumber: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  stateProvince: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;