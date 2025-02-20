// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import OnboardingMain from "./_components/Main";

/*======= METADATA =======*/
export const metadata: Metadata = {
  title: "Onboarding",
  robots: {
    index: false,
  },
};

/*======= PAGE =======*/
export default function OnboardingPage() {
  return <OnboardingMain />;
}
