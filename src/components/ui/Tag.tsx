"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/tailwindcss.utils";

interface TagProps {
  tag: string;
  onRemove?: () => void;
  is_editable?: boolean;
  className?: string;
}

export function Tag({
  tag,
  onRemove,
  is_editable = true,
  className,
}: TagProps) {
  return (
    <div
      className={cn(
        "px-2 py-1 flex items-center gap-x-1 bg-accent text-accent-foreground text-sm rounded-md",
        className
      )}
    >
      <span>{tag}</span>
      {is_editable && onRemove && (
        <button
          onClick={onRemove}
          className="hover:text-destructive transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
