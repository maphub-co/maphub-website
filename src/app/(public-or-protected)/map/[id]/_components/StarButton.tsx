// LIBRARIES
import { useState, useEffect } from "react";
import { Loader2, Star } from "lucide-react";

// CONFIG
import { toast } from "@/lib/toast";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import { Button } from "@/components/ui/Button";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

/*======= COMPONENT =======*/
export default function StarButton({ className }: { className?: string }) {
  const [loading_map, star_count, get_star_status, toggle_star] = useMapStore(
    (state) => [
      state.is_loading,
      state.map?.stars,
      state.get_star_status,
      state.toggle_star,
    ]
  );
  const [is_starred, set_starred] = useState<boolean>(false);
  const [is_loading, set_loading] = useState<boolean>(false);

  /*------- HOOKS -------*/
  useEffect(() => {
    if (loading_map) return;

    const fetch_star_status = async () => {
      try {
        set_loading(true);
        const status = await get_star_status();
        set_starred(status.is_starred);
      } catch (err: unknown) {
        console.error("Error: Fail to fetch star status.\n", err);
      } finally {
        set_loading(false);
      }
    };

    fetch_star_status();
  }, [loading_map]);

  const handle_click = async () => {
    try {
      set_loading(true);
      const response = await toggle_star();
      set_starred(response.is_starred);
    } catch (err: unknown) {
      console.error("Failed to toggle star status:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to toggle star status",
      });
    } finally {
      set_loading(false);
    }
  };

  /*------- RENDERER -------*/
  return (
    <Button
      title={is_starred ? "Remove star" : "Star this map"}
      variant={"outline"}
      size={"sm"}
      className={cn("group flex items-center px-4 gap-x-2", className)}
      onClick={handle_click}
      disabled={loading_map || is_loading}
    >
      <Star
        className={`h-4 w-4 ${
          is_starred
            ? "fill-foreground group-hover:fill-background-primary transition-all"
            : ""
        }`}
      />

      {/* LOADER */}
      {is_loading && <Loader2 className="size-4 mx-2 animate-spin" />}

      {/* CONTENT */}
      {!is_loading && (
        <span className="text-xs">
          Stars <span>{star_count}</span>
        </span>
      )}
    </Button>
  );
}
