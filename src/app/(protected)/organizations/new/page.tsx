// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import NewOrganizationMain from "./_components/Main";

/*======= METADATA =======*/
export const metadata: Metadata = {
  title: "New Organization",
  robots: {
    index: false,
  },
};

/*======= PAGE =======*/
export default function NewOrganizationPage() {
  return <NewOrganizationMain />;
}
