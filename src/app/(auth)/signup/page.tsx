// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import SignUpMain from "./Main";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up for MapHub.co",
  alternates: {
    canonical: "https://www.maphub.co/signup",
  },
};

export default function Page() {
  return <SignUpMain />;
}
