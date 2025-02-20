import { Metadata } from "next";
import BrowserSection from "./_components/BrowserSection";

export const metadata: Metadata = {
  title: "Workspace",
  description: "Manage your maps and folders",
};

interface WorkspacePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  try {
    const { id } = await params;

    return <BrowserSection id={id} path="" />;
  } catch (error) {
    console.error(error);
    return <div>Error loading workspace</div>;
  }
}
