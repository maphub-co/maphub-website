import { Metadata } from "next";
import MetricsPage from "./page.client";

export const metadata: Metadata = {
  title: "Internal Metrics",
  description: "Internal metrics dashboard for MapHub.co",
  alternates: {
    canonical: "https://www.maphub.co/metrics",
  },
};

export default function Page() {
  return <MetricsPage />;
}
