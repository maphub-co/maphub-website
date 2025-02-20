import { Metadata } from "next";
import ApiKeysSection from "./_components/ApiKeysSection";

export const metadata: Metadata = {
  title: "Settings | API Keys",
  description: "Manage your MapHub.co API keys",
};

export default function Page() {
  return (
    <div className="flex flex-col gap-y-16">
      <ApiKeysSection />
    </div>
  );
}
