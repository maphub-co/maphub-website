import * as React from "react";

import { cn } from "@/utils/tailwindcss.utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "min-h-[80px] w-full px-3 py-2 flex rounded-md",
          "bg-muted border border-input ring-offset-background-primary",
          "placeholder:text-muted-foreground",
          "focus:bg-background-primary focus-visible:outline-hidden",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
