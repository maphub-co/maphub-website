"use client";

// TYPES
interface ChangeItem {
  time: string;
  description: string;
  author: string;
}

// LIBRARIES
import { ChevronRight, Clock } from "lucide-react";
import Link from "next/link";

// COMPONENTS
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import HighFive from "@/components/icons/HighFive";

// CONSTANTS
const MOCKUP_CHANGES: ChangeItem[] = [
  {
    time: "2h",
    description: "Updated the colormap",
    author: "Alexandre",
  },
  {
    time: "8h",
    description: "Added elevation layer",
    author: "Pierre",
  },
  {
    time: "2d",
    description: "Created a new map",
    author: "Tanguy",
  },
  {
    time: "4d",
    description: "Created a new map",
    author: "Sven",
  },
];

/*======= COMPONENTS =======*/
export default function LastestChanges() {
  return (
    <Card className="w-full p-0">
      {/* Header */}
      <CardHeader className="p-4 pb-0 flex-row items-center justify-between">
        <h3 className="text-base font-semibold">Latest changes</h3>
        <Clock className="size-4 text-muted-foreground" />
      </CardHeader>

      <div className="flex flex-col relative 2xl:min-h-[440px]">
        {/* Overlay */}
        <div className="flex items-end absolute z-10 inset-0 bg-gradient-to-t from-card from-52% to-transparent">
          <div className="w-full flex flex-col items-center gap-y-4 p-6 mb-4">
            <HighFive className="size-12" />
            <p className="text-sm text-muted-foreground text-center">
              Create an organization, and start collaborating with your team.
            </p>
            <Link
              className="btn btn-outline btn-size-default"
              href="/organizations/new"
            >
              Create organization
            </Link>
          </div>
        </div>

        {/* Timeline */}
        <CardContent className="p-6">
          {/* Timeline items */}
          <div className="pt-4 flex flex-col gap-y-4 relative">
            {/* Timeline line */}
            <div className="w-0 h-full absolute left-2 top-0 bottom-0 border-l border-muted-foreground" />

            {MOCKUP_CHANGES.map((change, index) => (
              <div key={index} className="relative flex items-start gap-x-4">
                {/* DOT */}
                <div className="relative z-4 size-4 rounded-full border border-muted-foreground bg-card flex-shrink-0 mt-1"></div>

                {/* CONTENT */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-500 mb-1">
                    {change.time} ago - {change.author}
                  </div>
                  <div className="line-clamp-2 truncate">
                    {change.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 border-t">
          <span className="text-sm text-muted-foreground flex items-center gap-x-1">
            View changelog
            <ChevronRight className="size-4" />
          </span>
        </CardFooter>
      </div>
    </Card>
  );
}
