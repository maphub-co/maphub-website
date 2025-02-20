"use client";

// LIBRARIES
import { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";
import { useShallow } from "zustand/react/shallow";

// STORES
import { useMapStore } from "@/stores/map.store";

// INTERFACES
interface ThumbnailViewerProps extends Omit<ImageProps, "src"> {
  className?: string;
  onError?: () => void;
}

export function ThumbnailViewer({
  className = "",
  onError,
  alt = "Map thumbnail",
  ...props
}: ThumbnailViewerProps) {
  const [object_url, set_object_url] = useState<string>("");
  const thumbnail = useMapStore(useShallow((state) => state.thumbnail));

  useEffect(() => {
    if (!thumbnail) {
      set_object_url("");
      return;
    }

    // Create an object URL from the blob
    const url = URL.createObjectURL(thumbnail.data);
    set_object_url(url);

    // Clean up the object URL when the component unmounts or when the thumbnail changes
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [thumbnail?.timestamp]);

  if (!thumbnail || !object_url) {
    return null;
  }

  return (
    <Image
      src={object_url}
      alt={alt}
      className={className}
      onError={onError}
      {...props}
    />
  );
}
