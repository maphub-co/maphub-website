// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import OverviewSection from "./_components/OverviewSection";
import UsageSection from "./_components/UsageSection";

export const metadata: Metadata = {
  title: "Organization settings | Billing",
  description: "Manage the billing of your organization",
};

export default async function OrganizationBillingSettingsPage() {
  return (
    <div className="flex flex-col gap-y-16">
      <OverviewSection />
      <UsageSection />
    </div>
  );
}
