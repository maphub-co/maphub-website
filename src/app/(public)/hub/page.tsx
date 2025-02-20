import { Metadata } from "next";
import { Suspense } from "react";
import HubPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Hub",
  description: "Explore and discover maps and datasets on MapHub.co.",
  alternates: {
    canonical: "https://www.maphub.co/hub",
  },
};

export default async function HubPage() {
  return (
    <Suspense fallback={<HubFallback />}>
      <HubPageClient />
    </Suspense>
  );
}

function HubFallback() {
  return (
    <div className="container min-h-full mx-auto bg-background-primary px-4 py-8 flex flex-col space-y-8">
      <div className="flex flex-col gap-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Explore Maps</h1>
        </div>
      </div>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    </div>
  );
}
