// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import LoginMain from "./Main";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to MapHub.co",
  alternates: {
    canonical: "https://www.maphub.co/login",
  },
};

export default function Page() {
  return <LoginMain />;
}
