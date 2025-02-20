import { Metadata } from "next";
import BrowserSection from "../_components/BrowserSection";

export const metadata: Metadata = {
  title: "Workspace",
  description: "Browse and manage your maps and folders",
};

interface WorkspacePageProps {
  params: Promise<{
    id: string;
    path: string;
  }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  try {
    const { id, path } = await params;

    return <BrowserSection id={id} path={path} />;
  } catch (error) {
    console.error(error);
    return <div>Error loading workspace</div>;
  }
}
