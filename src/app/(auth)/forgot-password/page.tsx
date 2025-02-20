// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import ForgotPasswordMain from "./Main";

export const metadata: Metadata = {
  title: "Forgot Password - MapHub",
  description: "Reset your MapHub password",
  alternates: {
    canonical: "https://www.maphub.co/forgot-password",
  },
};

export default function Page() {
  return <ForgotPasswordMain />;
}
