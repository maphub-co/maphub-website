// TYPES
import { Source } from "@/interfaces/map";

// LIBRARIES
import { BookOpen } from "lucide-react";

// COMPONENTS
import { Input } from "@/components/ui/Input";

/*======= TYPES =======*/
interface SourceEditorProps {
  source: Source | null;
  on_change: (source: Source | null) => void;
  is_loading: boolean;
}

/*======= COMPONENT =======*/
export function SourceEditor({
  source,
  on_change,
  is_loading,
}: SourceEditorProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <label className="text-sm font-medium flex items-center gap-x-2">
        <BookOpen className="size-4" />
        Source
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Input
          placeholder="Source name (e.g., Rome)"
          value={source?.name || ""}
          onChange={(e) =>
            on_change({ ...source, name: e.target.value } as Source)
          }
          disabled={is_loading}
        />
        <Input
          placeholder="Source URL (optional)"
          value={source?.url || ""}
          onChange={(e) =>
            on_change({ ...source, url: e.target.value } as Source)
          }
          disabled={is_loading}
        />
      </div>
    </div>
  );
}
