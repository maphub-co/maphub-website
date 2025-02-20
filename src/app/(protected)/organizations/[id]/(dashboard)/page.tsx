// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import OrganizationHomeSection from "./_components/HomeSection";

/*======= METADATA =======*/
export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
  },
};

/*======= PAGE =======*/
export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OrganizationHomeSection id={id} />;
}
