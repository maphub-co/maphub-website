"use client";
// LIBRARIES
import { useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Map, FileText, Edit, Expand } from "lucide-react";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import MapVisualisation from "../MapVisualisation";
import Readme from "./Readme";
import ToggleQgisStyle from "../ToggleQgisStyle";

export default function MainSection() {
  /*------- ATTRIBUTS -------*/
  const { id } = useParams();
  const search_params = useSearchParams();
  const router = useRouter();
  const is_editable = useMapStore((state) => state.is_editable);
  const [active_tab, set_active_tab] = useState("map");
  const [is_editing, set_editing] = useState(false);

  const handle_fullscreen_toggle = () => {
    const new_params = new URLSearchParams(search_params.toString());
    if (new_params.get("viewer") === "true") {
      new_params.delete("viewer");
    } else {
      new_params.set("viewer", "true");
    }

    // Update the URL without reloading the page
    router.push(`?${new_params.toString()}`);
  };

  /*------- RENDER -------*/
  return (
    <Card className={cn("flex flex-col flex-1 overflow-hidden")}>
      {/* HEADER */}
      <CardHeader className="h-12 border-b px-2 py-0 flex flex-row items-center">
        {/* TABS */}
        <Tabs
          value={active_tab}
          onValueChange={set_active_tab}
          className="h-full"
        >
          <TabsList className="h-full flex items-center gap-x-2">
            {/* MAP */}
            <TabsTrigger
              className={cn(
                "h-full px-4 border-0 gap-x-2",
                "data-[state=active]:bg-transparent data-[state=active]:text-foreground hover:data-[state=active]:text-hover-foreground",
                "data-[state=active]:border-b-3 data-[state=active]:border-primary"
              )}
              value="map"
            >
              <Map className="size-4" />
              Map
            </TabsTrigger>

            {/* README */}
            <TabsTrigger
              className={cn(
                "h-full px-4 border-0 gap-x-2",
                "data-[state=active]:bg-background data-[state=active]:text-foreground hover:data-[state=active]:text-hover-foreground",
                "data-[state=active]:border-b-3 data-[state=active]:border-primary"
              )}
              value="readme"
            >
              <FileText className="size-4" />
              Readme
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* CONTEXTUAL ACTIONS */}
        <div className="ml-auto flex items-center gap-x-4">
          {active_tab === "map" ? (
            <>
              <ToggleQgisStyle />

              {is_editable ? (
                <Link
                  href={`/map/${id}/edit`}
                  className="btn btn-link btn-size-default flex items-center gap-x-2"
                >
                  <span className="hidden md:block">Edit map style</span>
                  <Edit className="size-4" />
                </Link>
              ) : (
                <Button
                  variant="link"
                  className="h-fit flex items-center gap-x-2"
                  onClick={() => handle_fullscreen_toggle()}
                >
                  <span className="hidden md:block">Fullscreen</span>
                  <Expand className="size-4" />
                </Button>
              )}
            </>
          ) : (
            is_editable && (
              <Button
                variant="link"
                className="h-fit flex items-center gap-x-2"
                onClick={() => set_editing(true)}
                disabled={is_editing}
              >
                <span className="hidden md:block">Edit readme</span>
                <Edit className="size-4" />
              </Button>
            )
          )}
        </div>
      </CardHeader>

      {/* CONTENT */}
      <div className="h-full flex-1 overflow-hidden">
        {active_tab === "map" ? (
          <MapVisualisation id="map-preview" name="Map Preview" />
        ) : (
          <Readme is_editing={is_editing} set_editing={set_editing} />
        )}
      </div>
    </Card>
  );
}
