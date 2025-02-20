// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import AccountInfosSection from "./_components/AccountInfosSection";
import DeleteAccountSection from "./_components/DeleteAccountSection";

/*======= METADATA =======*/
export const metadata: Metadata = {
  title: "Settings | Account",
  description: "Manage your account",
};

/*======= PAGE =======*/
export default function AccountSettingsPage() {
  return (
    <div className="w-full flex flex-col gap-y-16">
      {/* ACCOUNT INFOS */}
      <AccountInfosSection />

      {/* DELETE ACCOUNT */}
      <DeleteAccountSection />
    </div>
  );
}
