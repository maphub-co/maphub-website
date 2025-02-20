// LIBRARIES
import { Loader2, Star } from "lucide-react";

// STORES
import { useMapStore } from "@/stores/map.store";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

/*======= COMPONENT =======*/
export default function StarCount({ className }: { className?: string }) {
  const { map, is_loading } = useMapStore();

  return (
    <div
      className={cn(
        "h-8 flex items-center px-4 gap-x-2 border border-input text-sm text-foreground rounded-sm",
        is_loading ? "opacity-50" : "opacity-100",
        className
      )}
      title="Star count"
    >
      <Star className="size-4" />

      {/* LOADER */}
      {is_loading && <Loader2 className="size-4 mx-2 animate-spin" />}

      {/* CONTENT */}
      {!is_loading && (
        <span className="text-xs">
          Stars <span>{map?.stars}</span>
        </span>
      )}
    </div>
  );
}
