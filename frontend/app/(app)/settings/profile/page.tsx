import { getBusinessProfile } from "@/lib/actions/settings.actions";
import BusinessProfileForm from "@/features/settings/components/BusinessProfileForm";
import { type ProfileFormValues } from "@/lib/validations/settings";

export default async function ProfileSettingsPage() {
  const raw = await getBusinessProfile();

  const initialData: Partial<ProfileFormValues> | undefined = raw
    ? {
        propertyName: raw.business_name ?? "",
        streetAddress: raw.street_address ?? "",
        city: raw.city ?? "",
        stateProvince: raw.state_province ?? "",
        postalCode: raw.postal_code ?? "",
        country: raw.country ?? "",
        phones: raw.contact_phones?.length ? raw.contact_phones : undefined,
        email: raw.email ?? "",
        website: raw.website ?? "",
        taxNumber: raw.tax_number ?? "",
        taxes: raw.taxes?.map((t: any) => ({
          id: t.id,
          name: t.name,
          value: String(t.value),
          isPercentage: t.value_type === "percentage",
        })),
        charges: raw.charges?.map((c: any) => ({
          id: c.id,
          name: c.name,
          value: String(c.value),
          isPercentage: c.value_type === "percentage",
        })),
      }
    : undefined;

  return <BusinessProfileForm initialData={initialData} />;
}