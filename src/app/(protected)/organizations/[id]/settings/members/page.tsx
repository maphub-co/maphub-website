// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import MembersSection from "./_components/MembersSection";

export const metadata: Metadata = {
  title: "Organization settings | Members",
  description: "Manage the members of your organization",
};

export default function OrganizationMembersSettingsPage() {
  return (
    <div className="flex flex-col gap-y-16">
      <MembersSection />
    </div>
  );
}
