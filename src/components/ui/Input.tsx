import * as React from "react";

import { cn } from "@/utils/tailwindcss.utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex px-3 py-2 w-full text-sm rounded-md",
          "bg-muted border border-input ring-offset-background-primary",
          "placeholder:text-muted-foreground",
          "focus:bg-background-primary focus-visible:outline-hidden",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
