// LIBRARIES
import { Metadata } from "next";

// COMPONENTS
import Hero from "./_components/Hero";
import TrustedBy from "./_components/TrustedBy";
import Presentation from "./_components/Presentation";
import Integration from "./_components/Integration";
import Collaboration from "./_components/Collaboration";
import Optimize from "./_components/Optimize";
import Visualize from "./_components/Visualize";
import Features from "./_components/Features";
import Pricing from "./_components/Pricing";
import DemoBooking from "./_components/DemoBooking";
import NewsletterForm from "@/components/vitrine/NewsletterForm";
import Footer from "@/components/vitrine/Footer";

/*======= METADATA =======*/
export const metadata: Metadata = {
  title: {
    absolute: "MapHub.co - Host, Share and Explore any Geospatial Data",
  },
  description:
    "Host, share, and explore any geospatial datasets with MapHub.co. A platform for GIS users who need open data, speed, clarity, and seamless collaboration.",
  keywords: [
    "GIS",
    "geospatial",
    "datasets",
    "open data",
    "maps",
    "hub",
    "QGIS",
    "Mapbox",
  ],
  alternates: {
    canonical: "https://www.maphub.co",
  },
};

/*======= PAGE =======*/
export default async function HomePage() {
  return (
    <div className="w-full flex flex-col bg-background">
      <Hero />
      <TrustedBy />
      <Presentation />
      <Features />
      <Integration />
      <Collaboration />
      <Optimize />
      <Visualize />
      <Pricing />
      <DemoBooking />
      <NewsletterForm />
      <Footer />
    </div>
  );
}
