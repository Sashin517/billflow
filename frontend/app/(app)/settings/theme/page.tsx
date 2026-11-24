import { getBusinessTheme } from "@/lib/actions/settings.actions";
import LogoUploader from "@/features/settings/components/LogoUploader";

export default async function ProfileSettingsPage() {
  const theme = await getBusinessTheme();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
      </div>
      <LogoUploader initialData={theme} />
    </div>
  );
}