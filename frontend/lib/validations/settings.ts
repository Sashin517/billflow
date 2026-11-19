import { z } from "zod";

export const profileSchema = z.object({
  propertyName: z.string().min(1, "Property Name is required"),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  stateProvince: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  phones: z.array(
    z.object({
      number: z.string(),
      type: z.string(),
      customLabel: z.string().optional(),
    })
  ),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  website: z.string().optional(),
  taxNumber: z.string().optional(),
  taxes: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
      isPercentage: z.boolean(),
    })
  ),
  charges: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
      isPercentage: z.boolean(),
    })
  ),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;