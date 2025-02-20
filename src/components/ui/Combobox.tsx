"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/utils/tailwindcss.utils";
import { Button } from "@/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

interface ComboboxProps<T> {
  options: T[];
  selected: T | null;
  onSelect: (option: T) => void;
  onSearch?: (query: string) => void;
  is_loading?: boolean;
  get_option_label: (option: T) => string;
  get_option_value: (option: T) => string;
  render_option?: (option: T, is_selected: boolean) => React.ReactNode;
  placeholder?: string;
  search_placeholder?: string;
  empty_message?: string;
  disabled?: boolean;
  className?: string;
}

export function Combobox<T>({
  options,
  selected,
  onSelect,
  onSearch,
  is_loading = false,
  get_option_label,
  get_option_value,
  render_option,
  placeholder = "Select an option...",
  search_placeholder = "Search...",
  empty_message = "No results found.",
  disabled = false,
  className,
}: ComboboxProps<T>) {
  const [open, set_open] = React.useState(false);
  const [search_value, set_search_value] = React.useState("");

  React.useEffect(() => {
    if (onSearch) {
      onSearch(search_value);
    }
  }, [search_value, onSearch]);

  const handle_select = (option: T) => {
    onSelect(option);
    set_open(false);
  };

  return (
    <Popover open={open} onOpenChange={set_open}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">
            {selected ? get_option_label(selected) : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={search_placeholder}
            value={search_value}
            onValueChange={set_search_value}
          />
          <CommandList>
            {is_loading && (
              <div className="py-6 text-center text-sm">Loading...</div>
            )}

            {!is_loading && options.length === 0 && (
              <CommandEmpty>{empty_message}</CommandEmpty>
            )}

            {!is_loading && options.length > 0 && (
              <CommandGroup>
                {options.map((option) => {
                  const value = get_option_value(option);
                  const label = get_option_label(option);
                  const is_selected =
                    selected && get_option_value(selected) === value;

                  return (
                    <CommandItem
                      key={value}
                      value={value}
                      onSelect={() => handle_select(option)}
                      className="cursor-pointer"
                    >
                      {render_option ? (
                        render_option(option, !!is_selected)
                      ) : (
                        <>
                          <Check
                            className={cn(
                              "mr-2 size-4",
                              is_selected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="truncate">{label}</span>
                        </>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
