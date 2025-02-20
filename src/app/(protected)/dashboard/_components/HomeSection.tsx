"use client";

// LIBRARIES
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, Compass, Folder } from "lucide-react";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// STORES
import { useUserStore } from "@/stores/user.store";

// COMPONENTS
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import ElfsightForm from "@/components/feedback/ElfsightForm";
import CollaborationAd from "./CollaborationAd";
import LastestChanges from "./LastestChanges";

export default function DashboardHomePage() {
  /*------- ATTRIBUTS -------*/
  const { loading, user } = useUserStore();

  /*------- RENDERER -------*/
  return (
    <section
      id="dashboard-home"
      className="w-full p-4 md:p-6 grid min-h-full grid-cols-1 grid-rows-[auto_full] lg:grid-cols-[1fr_256px] gap-8"
    >
      {/* MAIN CONTENT */}
      <div className="w-full min-h-full flex flex-col gap-y-8">
        {/* Title */}
        {loading ? (
          <Skeleton className="w-32 h-10" />
        ) : user ? (
          <h1 className="text-2xl font-bold">Hi {user.display_name} !</h1>
        ) : (
          <h1 className="text-2xl font-bold">Hi there !</h1>
        )}

        {/* Useful links */}
        <UsefulLinks />

        {/* Upgrade plan card */}
        <CollaborationAd />
      </div>

      {/* LEFT ASIDE */}
      <aside className="w-full h-full hidden lg:flex flex-col gap-y-4">
        <LastestChanges />
        {/* <ElfsightForm /> */}
      </aside>
    </section>
  );
}

function UsefulLinks() {
  const [is_open, set_open] = useState(true);

  return (
    <div className="w-full flex flex-col items-start gap-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="text-base text-primary flex items-center gap-x-2"
        onClick={() => set_open(!is_open)}
      >
        <ChevronRight
          className={cn("size-4 text-primary", is_open && "rotate-90")}
        />
        Useful links
      </Button>

      <div
        className={cn(
          "w-full grid grid-cols-1 md:grid-cols-3 gap-4 transition-all",
          !is_open && "hidden"
        )}
      >
        {/* Folders */}
        <Link
          href="/dashboard/workspaces"
          className="btn btn-outline justify-start items-start p-4 gap-x-4"
        >
          <Folder className="size-6 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1">My Datasets</h3>
            <p className="text-sm text-muted-foreground truncate">
              Navigate all your folders and maps.
            </p>
          </div>
        </Link>

        {/* hub */}
        <Link
          href="/hub"
          className="btn btn-outline justify-start items-start p-4 gap-x-4"
        >
          <Compass className="size-6 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1">Explore</h3>
            <p className="text-sm text-muted-foreground truncate">
              Discover new maps and datasets.
            </p>
          </div>
        </Link>

        {/* docs */}
        <Link
          href="/docs"
          className="btn btn-outline justify-start items-start p-4 gap-x-4"
        >
          <BookOpen className="size-6 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1">Get Started</h3>
            <p className="text-sm text-muted-foreground truncate">
              Follow the guides.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
