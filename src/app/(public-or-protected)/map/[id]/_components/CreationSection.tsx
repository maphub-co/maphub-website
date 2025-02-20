// LIBRARIES
import { CalendarIcon } from "lucide-react";

// STORES
import { useMapStore } from "@/stores/map.store";

/*======= COMPONENT =======*/
export default function CreationSection() {
  /*------- ATTRIBUTES -------*/
  const [is_editable, creation_date] = useMapStore((state) => [
    state.is_editable,
    state.map?.created_time,
  ]);

  /*------- RENDERER -------*/
  if (is_editable || !creation_date) return <></>;

  return (
    <div className="flex flex-col gap-y-4">
      {/* HEADER */}
      <div className="border-b py-4">
        <h3 className="font-semibold">Created on</h3>
      </div>

      {/* CREATION DATE */}
      <div className="flex items-center gap-x-2 text-muted-foreground">
        <CalendarIcon className="size-4" />
        <span>{new Date(creation_date).toDateString()}</span>
      </div>
    </div>
  );
}
