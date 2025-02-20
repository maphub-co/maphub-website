// LIBRARIES
import Link from "next/link";
import { useShallow } from "zustand/react/shallow";
import { BookOpen, BookOpenCheck } from "lucide-react";

// STORES
import { useMapStore } from "@/stores/map.store";

/*======= COMPONENT =======*/
export default function Source() {
  /*------- ATTRIBUTS -------*/
  const [source] = useMapStore(useShallow((state) => [state.map?.source]));

  /*------- METHODS -------*/
  const get_absolute_url = (href: string) => {
    // Ensure href is treated as absolute URL
    return href?.startsWith("http")
      ? href
      : href?.startsWith("/")
      ? `${window.location.origin}${href}`
      : href?.startsWith("#")
      ? href
      : href
      ? `https://${href}`
      : "#";
  };

  /*------- RENDER -------*/
  return (
    <div className="flex items-center gap-x-2">
      <div className="flex items-center gap-x-2">
        {!!source ? (
          <BookOpenCheck className="size-4" />
        ) : (
          <BookOpen className="size-4" />
        )}

        <span className="text-xs font-medium">Source :</span>
      </div>
      {source?.name ? (
        source?.url ? (
          <Link
            href={get_absolute_url(source.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary underline"
          >
            {source.name}
          </Link>
        ) : (
          <span className="text-xs">{source.name}</span>
        )
      ) : (
        <span className="text-xs text-muted-foreground italic">
          No source available
        </span>
      )}
    </div>
  );
}
