"use client";

// LIBRARIES
import { useMemo, useState } from "react";
import Image, { ImageProps } from "next/image";

// SERVICES
import { map_services } from "@/services/map.services";

// STORES
import { CircleX, Loader } from "lucide-react";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

/*======= INTERFACES =======*/
interface MapThumbnailProps extends Omit<ImageProps, "src"> {
  className?: string;
  map_id: string;
  onError?: () => void;
}

export function MapThumbnail({
  className = "",
  map_id,
  onError,
  alt = "Map thumbnail",
  ...props
}: MapThumbnailProps) {
  const [object_url, set_object_url] = useState<string>("");
  const [error, set_error] = useState<boolean>(false);
  const [is_loading, set_is_loading] = useState<boolean>(false);

  /*------- METHODS -------*/
  const load_thumbnail = async () => {
    try {
      set_is_loading(true);
      const thumbnail = await map_services.get_thumbnail(map_id);
      set_object_url(URL.createObjectURL(thumbnail.data));
    } catch (error) {
      set_error(true);
    } finally {
      set_is_loading(false);
    }
  };

  /*------- HOOKS -------*/
  useMemo(() => {
    load_thumbnail();
  }, [map_id]);

  /*------- RENDER -------*/

  if (is_loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="size-6 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (error || !object_url) {
    return (
      <div
        className={cn(
          "w-full h-full bg-muted flex items-center justify-center",
          className
        )}
      >
        <CircleX className="size-6 text-muted-foreground" />
      </div>
    );
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
