// COMPONENTS
import { Button } from "@/components/ui/Button";
import TagIcon from "./TagIcon";

/*======= TYPE =======*/
interface TagToggleProps {
  name: string;
  count?: number;
  is_active: boolean;
  on_click: () => void;
}

/*======= COMPONENT =======*/
export default function TagToggle({
  name,
  count,
  is_active,
  on_click,
}: TagToggleProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`
        h-8 text-xs flex items-center px-3 gap-x-2 rounded-md
        ${is_active ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
      `}
      onClick={on_click}
    >
      {/* ICON */}
      <TagIcon
        tagName={name}
        className={is_active ? "text-primary" : "text-muted-foreground"}
      />

      {/* NAME */}
      <span>{name}</span>

      {/* COUNT */}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </Button>
  );
}
