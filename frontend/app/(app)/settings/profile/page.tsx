import BusinessProfileForm from "@/features/settings/components/BusinessProfileForm";

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
      </div>
      <BusinessProfileForm />
    </div>
  );
}