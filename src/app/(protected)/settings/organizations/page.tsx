// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import OrganizationsSection from "./_components/OrganizationsSection";

export const metadata: Metadata = {
  title: "Settings | Organizations",
  description: "Manage your organizations",
};

export default function OrganizationsSettingsPage() {
  return (
    <div className="flex flex-col gap-y-16">
      <OrganizationsSection />
    </div>
  );
}
