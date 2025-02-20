import { Metadata } from "next";
import RequestsPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Requests",
  description:
    "Request your own dataset requests, or revolve other users requests.",
  alternates: {
    canonical: "https://www.maphub.co/requests",
  },
};

export default async function RequestsPage() {
  return <RequestsPageClient />;
}
