import React from "react";
import { Icon } from "@iconify/react";
import { get_tag_icon } from "@/lib/iconify";
import type { IconifyIcon } from "@iconify/types";

interface TagIconProps {
  tagName: string;
  className?: string;
}

const TagIcon: React.FC<TagIconProps> = ({ tagName, className = "" }) => {
  // Get the appropriate icon and its type
  const { icon, is_colorful } = get_tag_icon(tagName);

  // If it's a colorful icon (IconifyIcon), use the Icon component
  if (is_colorful && typeof icon === "object") {
    return (
      <Icon icon={icon as IconifyIcon} className={`w-4 h-4 ${className}`} />
    );
  }

  // Otherwise, it's a Lucide icon component
  const LucideIconComponent = icon as React.ComponentType<{
    className?: string;
  }>;

  return <LucideIconComponent className={`w-4 h-4 ${className}`} />;
};

export default TagIcon;
