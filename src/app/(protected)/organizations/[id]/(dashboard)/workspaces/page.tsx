// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import OrganizationsWorkspacesSection from "./_components/WorkspacesSection";

/*======= METADATA =======*/
export const metadata: Metadata = {
  title: "Workspaces",
  robots: {
    index: false,
  },
};

/*======= PAGE =======*/
export default function OrganizationsWorkspacesPage() {
  return <OrganizationsWorkspacesSection />;
}
