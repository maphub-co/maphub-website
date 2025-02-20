// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import UploadsClient from "./_components/UploadsSection";

export const metadata: Metadata = {
  title: "My uploads",
  robots: {
    index: false,
  },
};

export default async function UploadsPage() {
  return <UploadsClient />;
}
