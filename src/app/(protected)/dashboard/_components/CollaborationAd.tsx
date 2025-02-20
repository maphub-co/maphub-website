"use client";

// LIBRARIES
import { useState } from "react";
import Link from "next/link";
import {
  ChevronUp,
  Users,
  Globe,
  GitBranch,
  Eye,
  HardDrive,
  Sparkles,
} from "lucide-react";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// COMPONENTS
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import CollaborationIcon from "@/components/icons/Collaboration";

// CONSTANTS
const FEATURES = [
  {
    icon: Users,
    text: "Team collaboration",
    description: "Work together seamlessly",
  },
  {
    icon: Globe,
    text: "QGIS integration",
    description: "Direct plugin connection",
  },
  {
    icon: GitBranch,
    text: "Version control",
    description: "Track all changes",
  },
  {
    icon: Eye,
    text: "Share with clients",
    description: "Beautiful presentations",
  },
  {
    icon: HardDrive,
    text: "50 GB per seat",
    description: "Geospatial storage",
  },
];

export default function CollaborationAd() {
  const [is_open, set_open] = useState(false);

  return (
    <Card className="w-full flex flex-col p-0 mt-auto overflow-hidden">
      {/* HEADER */}
      <CardHeader className="p-6 flex flex-row items-start justify-between gap-x-4 border-b relative">
        {/* COLLAPSE BUTTON */}
        <button
          className="absolute inset-0 z-1 cursor-pointer"
          onClick={() => set_open(!is_open)}
        />

        <div className="flex flex-col md:flex-row items-start gap-y-4 md:gap-x-6">
          <CollaborationIcon className="size-12 shrink-0" />

          <div className="flex flex-col gap-y-4 md:gap-y-2">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <h4 className="text-base md:text-lg font-semibold tracking-tight">
                Bring your team together !
              </h4>

              <Badge className="bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 text-xs font-medium px-2.5 py-1 rounded-full">
                <Sparkles className="size-3 mr-1" />
                Free trial
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Join 1000+ growing teams who have built a single source of truth
              with MapHub.co
            </p>
          </div>
        </div>

        {/* COLLAPSE BUTTON */}
        <ChevronUp
          className={cn(
            "size-5 m-2 transition-transform duration-300 ease-out",
            is_open && "rotate-180"
          )}
        />
      </CardHeader>

      {/* CONTENT */}
      <CardContent
        className={cn(
          "h-80 p-6 transition-all ease-in",
          !is_open && "h-0 py-0 overflow-hidden"
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="p-4 flex items-start gap-x-4 border border-border rounded-md group transition-all duration-200"
            >
              <feature.icon className="size-5 mt-1" />
              <div className="flex flex-col gap-y-0.5">
                <span className="font-semibold">{feature.text}</span>
                <span className="text-xs text-muted-foreground">
                  {feature.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* CALL TO ACTION */}
      <CardFooter className="p-4">
        <Link
          href="/organizations/new"
          className="btn btn-primary btn-size-lg w-full text-base"
        >
          Start collaborating now !
        </Link>
      </CardFooter>
    </Card>
  );
}
