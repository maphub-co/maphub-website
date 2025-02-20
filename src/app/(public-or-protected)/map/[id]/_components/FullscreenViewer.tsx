"use client";

// TYPES
import { Author } from "@/interfaces/map";

// LIBRARIES
import Link from "next/link";
import { ChevronLeft, Edit, MapIcon } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import ToggleQgisStyle from "./ToggleQgisStyle";
import { Button } from "@/components/ui/Button";
import MapVisualisation from "./MapVisualisation";

/*======= COMPONENT =======*/
export default function FullscreenViewer() {
  /*------- ATTRIBUTES -------*/
  const router = useRouter();
  const search_params = useSearchParams();
  const is_embed = search_params.get("embed") === "true";
  const [map, author, is_editable] = useMapStore((state) => [
    {
      id: state.map?.id,
      name: state.map?.name,
    },
    state.author,
    state.is_editable,
  ]);

  /*------- METHODS -------*/
  const handle_redirect = () => {
    const new_params = new URLSearchParams(search_params.toString());
    new_params.delete("viewer");
    router.replace(`?${new_params.toString()}`);
  };

  /*------- RENDERER -------*/
  return (
    <div className="w-full h-full fixed top-0 left-0 z-100 flex flex-col">
      {/* HEADER */}
      {!is_embed && (
        <header className="w-full h-16 px-4 grid grid-cols-[1fr_3fr_1fr] items-center bg-background-primary">
          {/* BACK BUTTON */}
          <Button
            onClick={handle_redirect}
            variant="link"
            className="flex items-center gap-x-2 text-sm text-muted-foreground justify-self-start"
          >
            <ChevronLeft className="size-4" />
            Return
          </Button>

          {/* MAP NAME */}
          <h1 className="w-full text-center text-truncate text-base font-semibold">
            {map.name}
          </h1>

          <div className="flex items-center gap-x-4 justify-self-end">
            <ToggleQgisStyle />

            {/* AUTHOR */}
            {is_editable ? (
              <Link
                href={`/map/${map.id}/edit`}
                className="btn btn-primary btn-size-default justify-self-end items-center gap-x-2"
              >
                <span className="hidden md:block">Edit map style</span>
                <Edit className="size-4" />
              </Link>
            ) : (
              author && (
                <p className="w-fit text-muted-foreground flex items-center justify-self-end">
                  <span className="mr-1">By</span>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_BASE_URL}/profile/${author.id}`}
                    target="_blank"
                    className="shrink-0 hover:text-primary hover:underline"
                  >
                    {author.display_name}
                  </Link>
                </p>
              )
            )}
          </div>
        </header>
      )}

      {/* MAIN */}
      <main className="w-full flex-1 relative">
        {/* OVERLAY */}
        <Overlay map={map} author={author} is_editable={is_editable} />

        {/* MAP */}
        <MapVisualisation id="map-viewer" name="Map Viewer" />
      </main>
    </div>
  );
}

/*======= PROPS =======*/
interface OverlayProps {
  map: {
    id: string | undefined;
    name: string | undefined;
  };
  author: Author | null;
  is_editable: boolean;
}

/*======= COMPONENT =======*/
const Overlay = ({ map, author }: OverlayProps) => {
  /*------- ATTRIBUTES -------*/
  const search_params = useSearchParams();
  const is_embed = search_params.get("embed") === "true";

  /*------- RENDERER -------*/
  return (
    <div className="w-full h-full absolute top-0 left-0 z-100 pointer-events-none">
      {/* BRANDING */}
      <Link
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/`}
        target="_blank"
        className="w-fit px-3 py-2 m-4 flex items-center space-x-1.5 absolute left-0 bottom-0 z-10 bg-black text-white rounded-sm pointer-events-auto"
      >
        <span className="text-sm">Hosted by</span>
        <span className="flex items-center space-x-1">
          <div className="p-1.5 flex justify-center items-center bg-black rounded-full">
            <MapIcon className="h-4 w-4 text-white" />
          </div>
          <span className="hidden md:block text-lg font-bold">MapHub.co</span>
        </span>
      </Link>

      {is_embed && (
        <div
          className={cn(
            "w-full p-4 flex justify-center",
            "absolute top-0 right-0 z-10",
            "rounded-md pointer-events-auto"
          )}
        >
          <div className="w-fit max-w-xl px-4 py-2 flex flex-col gap-y-0.5 justify-center items-center bg-white rounded-sm">
            {/* TITLE */}
            <h1 className="text-black font-bold text-base text-truncate">
              {map.name}
            </h1>

            {/* AUTHOR */}
            {author && (
              <p className="text-xs text-muted-foreground flex items-center">
                <span className="mr-1">By</span>
                <Link
                  href={`${process.env.NEXT_PUBLIC_BASE_URL}/profile/${author.id}`}
                  target="_blank"
                  className="hover:text-primary hover:underline"
                >
                  {author.display_name}
                </Link>
                <span>,</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
