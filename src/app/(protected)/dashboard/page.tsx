// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import HomeSection from "./_components/HomeSection";

/*======= METADATA =======*/
export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
  },
};

/*======= PAGE =======*/
export default function DashboardPage() {
  return <HomeSection />;
}
