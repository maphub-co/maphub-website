// COMPONENTS
import { Metadata } from "next";

// COMPONENTS
import ContactClientPage from "./page.client";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact MapHub.co",
  alternates: {
    canonical: "https://www.maphub.co/contact",
  },
};

export default function ContactPage() {
  return <ContactClientPage />;
}
