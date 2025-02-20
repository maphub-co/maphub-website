// LIBRARIES
import { useMapStore } from "@/stores/map.store";
import { Tag } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

/*======= COMPONENT =======*/
export default function Tags() {
  /*------- ATTRIBUTS -------*/
  const [tags] = useMapStore(useShallow((state) => [state.map?.tags || []]));

  /*------- RENDER -------*/
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-2">
        <Tag className="size-4" />
        <span className="text-xs font-medium">Tags :</span>
      </div>
      {tags && tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "px-2 py-1 text-xs text-accent-foreground bg-accent ",
                "border border-accent-foreground/20 rounded-sm"
              )}
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-xs text-muted-foreground italic">
          No tags available
        </span>
      )}
    </div>
  );
}
