// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import ProfileInfosSection from "./_components/ProfileInfosSection";

/*======= METADATA =======*/
export const metadata: Metadata = {
  title: "Settings | Profile",
  description: "Edit your profile information.",
};

/*======= PAGE =======*/
export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-y-16">
      <ProfileInfosSection />
    </div>
  );
}
