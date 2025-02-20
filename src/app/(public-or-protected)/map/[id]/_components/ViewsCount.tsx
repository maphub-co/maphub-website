// LIBRARIES
import { Eye, Loader2 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

// STORES
import { useMapStore } from "@/stores/map.store";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

/*======= COMPONENT =======*/
export default function ViewsCount({ className }: { className?: string }) {
  /*------- ATTRIBUTS -------*/
  const [views_count, is_loading] = useMapStore(
    useShallow((state) => [state.map?.views, state.is_loading])
  );

  /*------- RENDER -------*/
  return (
    <div
      className={cn(
        "w-fit h-8 flex justify-center items-center px-4 gap-x-2 border border-input text-sm text-foreground rounded-sm",
        is_loading ? "opacity-50" : "opacity-100",
        className
      )}
      title="Views count"
    >
      <Eye className="w-4 h-4" />

      {/* LOADER */}
      {is_loading && <Loader2 className="size-4 mx-2 animate-spin" />}

      {/* CONTENT */}
      {!is_loading && (
        <span className="text-xs">
          Views <span>{views_count}</span>
        </span>
      )}
    </div>
  );
}
