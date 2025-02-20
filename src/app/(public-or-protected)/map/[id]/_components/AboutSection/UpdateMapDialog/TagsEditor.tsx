// LIBRARIES
import { useState } from "react";
import { Tag, X } from "lucide-react";

// COMPONENTS
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/*======= TYPES =======*/
interface TagsEditorProps {
  tags: string[];
  on_change: (tags: string[]) => void;
  is_loading: boolean;
}

/*======= COMPONENT =======*/
export function TagsEditor({ tags, on_change, is_loading }: TagsEditorProps) {
  /*------- ATTRIBUTES -------*/
  const [new_tag, set_new_tag] = useState<string>("");

  /*------- METHODS -------*/
  const handle_add_tag = () => {
    if (new_tag.trim() && !tags.includes(new_tag.trim())) {
      on_change([...tags, new_tag.trim()]);
      set_new_tag("");
    }
  };

  const handle_remove_tag = (tag_to_remove: string) => {
    on_change(tags.filter((tag) => tag !== tag_to_remove));
  };

  const handle_key_press = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handle_add_tag();
    }
  };

  /*------- RENDERER -------*/
  return (
    <div className="flex flex-col gap-y-2">
      <label className="text-sm font-medium flex items-center gap-x-2">
        <Tag className="size-4" />
        Tags
      </label>

      <div className="flex flex-col gap-y-2">
        <div className="flex gap-x-2">
          <Input
            value={new_tag}
            onChange={(e) => set_new_tag(e.target.value)}
            onKeyPress={handle_key_press}
            placeholder="Add a tag..."
            className="text-sm"
            disabled={is_loading}
          />
          <Button
            onClick={handle_add_tag}
            disabled={is_loading || !new_tag.trim()}
            size="sm"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
            >
              <span>{tag}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handle_remove_tag(tag)}
                disabled={is_loading}
                className="h-auto p-0 hover:bg-blue-200"
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
