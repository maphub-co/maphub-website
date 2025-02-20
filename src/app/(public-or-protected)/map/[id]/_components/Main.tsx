"use client";

// LIBRARIES
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

// CONFIG
import { toast } from "@/lib/toast";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// STORES
import { useAuthStore } from "@/stores/auth.store";
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import PageLoader from "@/components/ui/PageLoader";
import MapProcessingStatus from "@/components/browser/MapProcessingStatus";
import FullscreenViewer from "./FullscreenViewer";
// header
import BackButton from "./BackButton";
import Title from "./Title";
import VisibilityBadge from "./VisibilityBadge";
import StarCount from "./StarCount";
import StarButton from "./StarButton";
import ViewsCount from "./ViewsCount";
import SettingsMenu from "./SettingsMenu";
// main content
import VersionSelect from "./VersionSelect";
import OutlineDownloadButton from "./OutlineDownloadButton";
import MainButton from "./MainButton";
import MainSection from "./MainSection";
// Right content
import AboutSection from "./AboutSection";
import AuthorSection from "./AuthorSection";
import CreationSection from "./CreationSection";

/*======= COMPONENT =======*/
export default function MapPageMain({ id }: { id: string }) {
  /*------- ATTRIBUTES -------*/
  const search_params = useSearchParams();
  const { loading } = useAuthStore();
  const [load_map_detail, error, version_id, version_state] = useMapStore(
    useShallow((state) => [
      state.load_map_detail,
      state.error,
      state.selected_version?.id,
      state.selected_version?.state,
    ])
  );
  const [is_loading, set_is_loading] = useState(true);
  const is_map_processing =
    version_state?.status === "uploading" ||
    version_state?.status === "processing";
  const is_viewer_mode = search_params.get("viewer") === "true";
  const is_embed = search_params.get("embed") === "true";

  /*------- METHODS -------*/
  const initialisation = async () => {
    set_is_loading(true);
    try {
      await load_map_detail(id);
    } catch (error: any) {
      console.error("Error fetching map:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch map.",
      });
    } finally {
      set_is_loading(false);
    }
  };

  const handle_map_processing_complete = () => {
    // Refresh the map details when processing is complete
    load_map_detail(id).catch((error: any) => {
      console.error("Failed to fetch map details after processing:", error);
    });
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (loading) return;

    initialisation();
  }, [loading]);

  /*------- RENDER -------*/
  if (loading || is_loading) {
    return <PageLoader />;
  }

  if (error) {
    console.error(error);
    throw new Error("Failed to load map details");
  }

  if (version_id && is_map_processing) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Map Processing</h1>
          <p className="mb-6 text-muted-foreground">
            This map is still being processed. Please wait for the processing to
            complete.
          </p>
          <MapProcessingStatus
            version_id={version_id}
            on_complete={handle_map_processing_complete}
          />
        </div>
      </div>
    );
  }

  if (is_embed || is_viewer_mode) {
    return <FullscreenViewer />;
  }

  return <MapDetails />;
}

const MapDetails = () => {
  /*------- ATTRIBUTES -------*/
  const { is_authenticated } = useAuthStore();
  const is_editable = useMapStore((state) => state.is_editable);

  /*------- LAYOUT SECTIONS -------*/
  const MapHeader = () => (
    <div className="col-span-12 border-b md:h-16 py-4 flex flex-col md:flex-row justify-between items-center gap-y-4 md:gap-y-0">
      {/* LEFT SIDE */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-y-2 md:gap-y-0 md:gap-x-2">
        <BackButton />
        <Title />
        {is_editable && <VisibilityBadge />}
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-auto flex items-center gap-x-2 md:gap-x-4">
        <ViewsCount className="w-full md:w-fit" />
        {is_authenticated && !is_editable ? (
          <StarButton className="w-full md:w-fit" />
        ) : (
          <StarCount className="w-full md:w-fit" />
        )}
        <SettingsMenu />
      </div>
    </div>
  );

  const MainContent = () => (
    <section
      id="section-main"
      className={cn(
        "col-span-12 lg:col-span-8 xl:col-span-9",
        "row-start-2 lg:row-start-auto",
        "flex flex-col gap-y-4"
      )}
    >
      <div className="flex py-2">
        <VersionSelect />

        <div className="ml-auto flex items-center gap-x-2">
          <OutlineDownloadButton />
          <MainButton />
        </div>
      </div>

      <MainSection />
    </section>
  );

  const RightSidebar = () => (
    <div
      className={`
        col-span-12 lg:col-span-4 xl:col-span-3
        w-full space-y-6
      `}
    >
      <AboutSection />
      <AuthorSection />
      <CreationSection />
    </div>
  );

  /*------- RENDER -------*/
  return (
    <main
      className={cn(
        "container min-h-full",
        "px-4 md:px-8 pb-12 mx-auto",
        "grid grid-cols-12 gap-8",
        "grid-rows-[auto_1fr]",
        "bg-background"
      )}
    >
      <MapHeader />
      <MainContent />
      <RightSidebar />
    </main>
  );
};
