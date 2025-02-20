"use client";

// LIBRARIES
import { useState, useEffect } from "react";
import { ArrowDownUp, SearchIcon } from "lucide-react";

// COMPONENTS
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import TagsList from "./TagsList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

// Define sorting options
const sort_options = [
  { value: "recent", label: "Most recent" },
  { value: "stars", label: "Most starred" },
  { value: "views", label: "Most viewed" },
];

/*======= INTERFACES =======*/
interface SearchbarProps {
  on_change: (params: {
    search_query: string;
    selected_tags: string[];
    sort_by: string;
  }) => void;
  initial_search_query?: string;
  initial_selected_tags?: string[];
  initial_sort_by?: string;
}

/*======= COMPONENT =======*/
export default function Searchbar({
  on_change,
  initial_search_query = "",
  initial_selected_tags = [],
  initial_sort_by = "views",
}: SearchbarProps) {
  /*------- ATTRIBUTES -------*/
  const [search_input, set_search_input] = useState(initial_search_query);
  const [selected_tags, set_selected_tags] = useState<string[]>(
    initial_selected_tags
  );
  const [sort_by, set_sort_by] = useState<string>(initial_sort_by);

  /*------- HOOKS -------*/
  // Update local state when initial props change (for URL-based initialization)
  useEffect(() => {
    set_search_input(initial_search_query);
  }, [initial_search_query]);

  useEffect(() => {
    set_selected_tags(initial_selected_tags);
  }, [initial_selected_tags]);

  useEffect(() => {
    set_sort_by(initial_sort_by);
  }, [initial_sort_by]);

  // Debounced change detection
  useEffect(() => {
    const timeout_id = setTimeout(() => {
      on_change({
        search_query: search_input,
        selected_tags,
        sort_by,
      });
    }, 1000);

    return () => clearTimeout(timeout_id);
  }, [search_input, selected_tags, sort_by]);

  /*------- METHODS -------*/
  const handle_submit = (e: React.FormEvent) => {
    e.preventDefault();
    on_change({
      search_query: search_input,
      selected_tags,
      sort_by,
    });
  };

  const handle_sort_change = (new_sort: string) => {
    if (new_sort === sort_by) return;
    set_sort_by(new_sort);
  };

  /*------- RENDER -------*/
  return (
    <div className="space-y-4 w-full">
      <form onSubmit={handle_submit} className="relative">
        <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search maps by name, description..."
          className="pl-9"
          value={search_input}
          onChange={(event) => set_search_input(event.target.value)}
        />
      </form>

      {/* FILTERS */}
      <div className="w-full flex flex-col md:flex-row md:items-center gap-4 md:gap-2">
        {/* TAGS */}
        <TagsList
          className="flex-1"
          onTagsChange={set_selected_tags}
          initialSelectedTags={selected_tags}
        />

        {/* SORT */}
        <Label className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground flex items-center whitespace-nowrap">
            <ArrowDownUp className="w-4 h-4 mr-1" />
            Sort :
          </span>

          <Select value={sort_by} onValueChange={handle_sort_change}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Select sort" />
            </SelectTrigger>
            <SelectContent>
              {sort_options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>
      </div>
    </div>
  );
}
