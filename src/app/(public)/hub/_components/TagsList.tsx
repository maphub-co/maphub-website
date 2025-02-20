// LIBRARIES
import React, { useEffect, useState } from "react";
import TagToggle from "./TagToggle";

// SERVICES
import { maps_services } from "@/services/maps.services";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

/*======= INTERFACES =======*/
interface TagsToggleRowProps {
  onTagsChange: (selectedTags: string[]) => void;
  initialSelectedTags?: string[];
  className?: string;
}

/*======= COMPONENT =======*/
export default function TagsToggleRow({
  onTagsChange,
  initialSelectedTags = [],
  className = "",
}: TagsToggleRowProps) {
  const [commonTags, setCommonTags] = useState<
    { name: string; count: number }[]
  >([]);
  const [selectedTags, setSelectedTags] =
    useState<string[]>(initialSelectedTags);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the most common tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      try {
        const tags = await maps_services.fetch_common_tags_async(10);
        setCommonTags(tags);
      } catch (error) {
        console.error("Failed to fetch common tags:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  // Update selected tags if initialSelectedTags changes
  useEffect(() => {
    setSelectedTags(initialSelectedTags);
  }, [initialSelectedTags]);

  // Handle tag toggle
  const handleTagToggle = (tagName: string) => {
    // Check if the tag is already selected (case-insensitive comparison)
    const tagIndex = selectedTags.findIndex(
      (tag) => tag.toLowerCase() === tagName.toLowerCase()
    );

    let newSelectedTags: string[];
    if (tagIndex >= 0) {
      // If tag exists, remove it
      newSelectedTags = [
        ...selectedTags.slice(0, tagIndex),
        ...selectedTags.slice(tagIndex + 1),
      ];
    } else {
      // If tag doesn't exist, add it with original case preserved
      newSelectedTags = [...selectedTags, tagName];
    }

    setSelectedTags(newSelectedTags);
    onTagsChange(newSelectedTags);
  };

  if (isLoading) {
    return (
      <div className={cn("flex gap-2 py-2 overflow-x-auto", className)}>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="h-8 w-16 bg-muted animate-pulse rounded-md"
            />
          ))}
      </div>
    );
  }

  if (commonTags.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No tags found in database. Add tags to your maps to see them here.
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2 py-2 overflow-x-auto", className)}>
      {commonTags.map((tag) => (
        <TagToggle
          key={tag.name}
          name={tag.name}
          count={tag.count}
          is_active={selectedTags.some(
            (t) => t.toLowerCase() === tag.name.toLowerCase()
          )}
          on_click={() => handleTagToggle(tag.name)}
        />
      ))}
    </div>
  );
}
