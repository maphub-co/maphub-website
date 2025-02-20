import { Metadata } from "next";
import BrowserSection from "./_components/BrowserSection";

/*======= METADATA =======*/
export const metadata: Metadata = {
  title: "Workspace",
  description: "Manage your maps and folders",
};

/*======= PROPS =======*/
interface WorkspacePageProps {
  params: Promise<{
    workspace_id: string;
  }>;
}

/*======= PAGE =======*/
export default async function WorkspacePage({ params }: WorkspacePageProps) {
  try {
    const { workspace_id } = await params;

    return <BrowserSection id={workspace_id} path="" />;
  } catch (error) {
    console.error(error);
    return <div>Error loading workspace</div>;
  }
}
