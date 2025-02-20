"use client";

// COMPONENTS
import {
  EsaLogo,
  RabobankLogo,
  QgisLogo,
  StudioBereikbaarLogo,
  G2aLogo,
  MaugesCommunauteLogo,
} from "@/components/vitrine/partners";

// CONSTANTS
const PARTNERS: { name: string; logo: React.ReactNode }[] = [
  {
    name: "ESA",
    logo: <EsaLogo className="h-6 md:h-8 w-auto" />,
  },
  {
    name: "Rabobank",
    logo: <RabobankLogo className="h-6 md:h-8 w-auto" />,
  },
  {
    name: "Qgis",
    logo: <QgisLogo className="h-6 md:h-8 w-auto" />,
  },
  {
    name: "studio Bereikbaar",
    logo: <StudioBereikbaarLogo className="h-6 md:h-8 w-auto" />,
  },
  {
    name: "G2a",
    logo: <G2aLogo className="h-8 md:h-10 w-auto" />,
  },
  {
    name: "Mauges Communaute",
    logo: <MaugesCommunauteLogo className="h-8 md:h-10 w-auto" />,
  },
];

export default function TrustedBySection() {
  return (
    <section className="container max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 flex flex-col gap-y-8">
      {/* <h2 className="text-2xl md:text-3xl font-bold text-center">Trusted by</h2> */}

      <div className="flex flex-wrap gap-8 md:gap-16 items-center justify-center">
        {PARTNERS.map((partner) => (
          <div key={partner.name} className="flex items-center justify-center">
            {partner.logo}
          </div>
        ))}
      </div>
    </section>
  );
}
