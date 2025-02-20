"use client";

// LIBRARIES
import Link from "next/link";
import {
  FileCheck2,
  Share2,
  Database,
  Users,
  Unplug,
  Files,
  ScanEye,
  MousePointerClick,
} from "lucide-react";

// CONFIG
import { Card } from "@/components/ui/Card";

// CONSTANTS
const FEATURES = [
  {
    id: "hosting",
    icon: Database,
    title: "Build your geospatial catalog",
    description:
      "Transform your geospatial data into a cloud catalog that can be accessed anywhere, anytime.",
  },

  {
    id: "sharing",
    icon: Share2,
    title: "Share",
    description:
      "Embed into your own website, send a Tiling URL, or just share the link to your map.",
  },

  {
    id: "collaboration",
    icon: Users,
    title: "Collaborate",
    description:
      "Create your organization, invite your team, manage access and start collaborating on your projects.",
  },

  {
    id: "integration",
    icon: Unplug,
    title: "Integrate into your workflow",
    description:
      "Between our QGIS plugin, python package, CLI, API or even MCP, choose the solution that suits the best your workflow.",
  },

  {
    id: "organizing",
    icon: Files,
    title: "Organise",
    description:
      "Easily manage your geospatial data through a Drive like interface.",
  },

  {
    id: "preview",
    icon: ScanEye,
    title: "Preview",
    description: "Visualize your data directly inside the browser.",
  },

  {
    id: "interacting",
    icon: MousePointerClick,
    title: "Interact with data",
    description:
      "Filter, style, analyse and interact with your data using kepler.gl.",
  },

  {
    id: "format",
    icon: FileCheck2,
    title: "Universal Format Support",
    description:
      "Shapefiles, GeoJSON, TIFFs – you name it. Maphub support all major geospatial formats.",
  },
];

export default function MoreFeaturesSection() {
  return (
    <section
      id="more-features"
      className="container max-w-7xl mx-auto px-4 md:px-8 my-8 md:my-20 flex flex-col gap-y-8 xl:gap-y-16"
    >
      {/* TITLE */}
      <h2 className="flex-1 font-semibold text-primary uppercase tracking-wider">
        Features
      </h2>

      {/* CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 xl:gap-12">
        {/* Formats */}
        {FEATURES.map((feature) => (
          <Card
            key={feature.id}
            className="flex flex-col p-4 md:p-6 border-primary rounded-none"
          >
            <feature.icon className="size-6 2xl:size-8 shrink-0" />

            <h3 className="text-xl 2xl:text-2xl font-semibold mt-6">
              {feature.title}
            </h3>
            <p className="text-foreground 2xl:text-base mt-4">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
