"use client";

// LIBRARIES
import * as React from "react";
import { PlusIcon } from "lucide-react";

// COMPONENTS
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

/*======= INTERFACES =======*/
interface TagsInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  max_tags?: number;
}

/*======= COMPONENT =======*/
export function TagsInput({
  tags,
  onChange,
  placeholder = "Add tags...",
  disabled = false,
  max_tags = 10,
  className,
  ...props
}: TagsInputProps) {
  /*------- ATTRIBUTES -------*/
  const [input_value, set_input_value] = React.useState("");
  const input_ref = React.useRef<HTMLInputElement>(null);

  /*------- METHODS -------*/
  const handle_input_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    set_input_value(e.target.value);
  };

  const handle_key_down = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input_value.trim()) {
      e.preventDefault();
      add_tag(input_value.trim());
    }
  };

  const add_tag = (tag: string) => {
    const normalized_tag = tag.toLowerCase();
    if (
      normalized_tag &&
      !tags.some((t) => t.toLowerCase() === normalized_tag) &&
      tags.length < max_tags
    ) {
      const new_tags = [...tags, normalized_tag];
      onChange(new_tags);
      set_input_value("");
    } else if (tags.length >= max_tags) {
      // Optionally show a message or toast about max tags limit
      console.warn(`Maximum number of tags (${max_tags}) reached`);
    }
  };

  const remove_tag = (index: number) => {
    const new_tags = [...tags];
    new_tags.splice(index, 1);
    onChange(new_tags);
  };

  /*------- RENDER -------*/
  return (
    <div className="space-y-2">
      {/* Input and Add Button */}
      <div className="flex items-center gap-x-2">
        <Input
          ref={input_ref}
          type="text"
          value={input_value}
          onChange={handle_input_change}
          onKeyDown={handle_key_down}
          placeholder={placeholder}
          disabled={disabled || tags.length >= max_tags}
          className="flex-1 text-sm"
          {...props}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="w-fit h-fit max-h-full p-3"
                onClick={() =>
                  input_value.trim() && add_tag(input_value.trim())
                }
                disabled={
                  disabled || tags.length >= max_tags || !input_value.trim()
                }
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add tag</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Tags List */}
      <div className="flex flex-wrap gap-2">
        {tags.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">
            No tags added yet.
          </p>
        ) : (
          tags.map((tag, index) => (
            <Tag
              key={`${tag}-${index}`}
              tag={tag}
              onRemove={() => remove_tag(index)}
              is_editable={!disabled}
            />
          ))
        )}
      </div>
    </div>
  );
}
