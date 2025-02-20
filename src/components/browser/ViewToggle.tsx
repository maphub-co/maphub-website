// LIBRARIES
import { useEffect } from "react";
import { Check, AlignJustify, LayoutGrid } from "lucide-react";

// COMPONENTS
import { Button } from "@/components/ui/Button";

/*======= PROPS =======*/
interface ViewToggleProps {
  view: "list" | "grid";
  set_view: (view: "list" | "grid") => void;
}

/*======= COMPONENT =======*/
export default function ViewToggle({ view, set_view }: ViewToggleProps) {
  /*------- METHODS -------*/
  const handle_view_change = (view: "list" | "grid") => {
    set_view(view);
    localStorage.setItem("view", view);
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    const view = localStorage.getItem("view");

    if (view) set_view(view as "list" | "grid");
  }, [set_view]);

  /*------- RENDER -------*/
  return (
    <div className="w-fit flex rounded-full border overflow-hidden">
      {/* LIST VIEW */}
      <Button
        variant="ghost"
        size="icon"
        className="w-16 h-auto p-2 flex items-center justify-center gap-x-1 rounded-r-none"
        onClick={() => handle_view_change("list")}
      >
        {view === "list" && <Check className="size-4" />}
        <AlignJustify className="size-4 shrink-0" />
      </Button>

      {/* GRID VIEW */}
      <Button
        variant="ghost"
        size="icon"
        className="w-16 h-auto p-2 flex items-center justify-center gap-x-1 border-l rounded-l-none"
        onClick={() => handle_view_change("grid")}
      >
        <LayoutGrid className="size-4 shrink-0" />
        {view === "grid" && <Check className="size-4" />}
      </Button>
    </div>
  );
}
