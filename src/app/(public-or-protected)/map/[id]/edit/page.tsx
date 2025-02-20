// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import Main from "./_components/Main";

/*======= METADATA =======*/
export const metadata: Metadata = {
  title: "MapHub.co - Map Style Editor",
  description: "MapHub.co - Map Style Editor",
  robots: {
    index: false,
    googleBot: {
      index: false,
      noimageindex: true,
    },
  },
};

/*======= PAGE =======*/
export default async function MapEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <Main id={id} />;
}
