// COMPONENTS
import { Textarea } from "@/components/ui/Textarea";

/*======= TYPES =======*/
interface DescriptionEditorProps {
  description: string;
  on_change: (description: string) => void;
  is_loading: boolean;
}

/*======= COMPONENT =======*/
export function DescriptionEditor({
  description,
  on_change,
  is_loading,
}: DescriptionEditorProps) {
  const max_length = 160;
  const current_length = description.length;
  const is_over_limit = current_length > max_length;

  return (
    <div className="flex flex-col gap-y-2">
      <label htmlFor="description" className="text-sm font-medium">
        Description{" "}
        <span className="text-xs text-muted-foreground">
          (max {max_length} characters)
        </span>
      </label>

      <Textarea
        id="description"
        value={description}
        maxLength={max_length}
        onChange={(e) => on_change(e.target.value)}
        placeholder="Add a description..."
        className="min-h-40 text-sm pr-16"
        disabled={is_loading}
      />

      <div className="ml-auto text-xs text-muted-foreground">
        <span className={is_over_limit ? "text-destructive" : ""}>
          {current_length}
        </span>
        <span className="text-muted-foreground">/{max_length}</span>
      </div>
    </div>
  );
}
