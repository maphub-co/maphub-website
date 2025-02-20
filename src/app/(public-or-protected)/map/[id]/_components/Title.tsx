// LIBRARIES
import { useState } from "react";
import { Edit, Save } from "lucide-react";

// STORES
import { useMapStore } from "@/stores/map.store";

// COMPONENTS
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function MapTitle() {
  /*------- ATTRIBUTES -------*/
  const [initial_name, is_editable, update_map] = useMapStore((state) => [
    state.map?.name,
    state.is_editable,
    state.update_map,
  ]);
  const [is_editing, set_editing] = useState(false);
  const [name, set_name] = useState(initial_name || "");

  /*------- METHODS -------*/
  const handle_cancel = () => {
    set_editing(false);
    set_name(initial_name || "");
  };

  const handle_save = async () => {
    if (name.trim() === "") return;

    const success = await update_map({ name });

    if (success) {
      set_editing(false);
    }
  };

  /*------- RENDER -------*/
  if (is_editable) {
    return is_editing ? (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handle_save();
        }}
        className="flex items-center gap-2"
      >
        <Input
          type="text"
          value={name}
          onChange={(e) => set_name(e.target.value)}
          className="text-lg font-semibold border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />

        <Button variant="ghost" size="sm" onClick={handle_cancel}>
          Cancel
        </Button>

        <Button variant="ghost" size="sm" type="submit">
          <Save className="size-4" />
        </Button>
      </form>
    ) : (
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">{name}</h1>

        <Button variant="ghost" size="sm" onClick={() => set_editing(true)}>
          <Edit className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <h1 className="text-lg font-semibold">{name}</h1>
    </div>
  );
}
