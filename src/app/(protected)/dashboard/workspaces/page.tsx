// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import WorkspacesMain from "./_components/Main";

/*======= METADATA =======*/
export const metadata: Metadata = {
  title: "Workspaces",
  robots: {
    index: false,
  },
};

/*======= PAGE =======*/
export default function WorkspacesPage() {
  return <WorkspacesMain />;
}
