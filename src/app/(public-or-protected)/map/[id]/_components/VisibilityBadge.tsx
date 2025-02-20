"use client";

// LIBRARIES
import { useShallow } from "zustand/react/shallow";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import { Badge } from "@/components/ui/Badge";

export default function VisibilityBadge() {
  /*------- ATTRIBUTES -------*/
  const [is_editable, is_public] = useMapStore(
    useShallow((state) => [state.is_editable, state.map?.public])
  );

  /*------- RENDERER -------*/
  if (!is_editable) return <></>;

  return (
    <Badge variant="outline" className="text-xs border-foreground">
      {is_public ? "Public" : "Private"}
    </Badge>
  );
}
