// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import OrganizationInfosSection from "./_components/OrganizationInfosSection";
import DeleteOrganizationSection from "./_components/DeleteOrganizationSection";

export const metadata: Metadata = {
  title: "Organization Settings | General",
  description: "Handle your organization settings.",
};

export default function OrganizationGeneralSettingsPage() {
  return (
    <div className="flex flex-col gap-y-16">
      <OrganizationInfosSection />
      <DeleteOrganizationSection className="w-full" />
    </div>
  );
}
