// INTERFACE
import { Entity } from "@/interfaces/entity";

// LIBRARIES
import { Building2, User } from "lucide-react";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

// COMPONENTS
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

export default function EntityAvatar({
  entity,
  size = 6,
  fallback_bg = false,
}: {
  entity: Entity;
  size?: number;
  fallback_bg?: boolean;
}) {
  return (
    <Avatar
      className={cn(
        `size-${size} flex items-center justify-center overflow-hidden`,
        entity.type === "organization" ? "rounded-xs" : "rounded-full"
      )}
    >
      {/* IMAGE */}
      <AvatarImage
        src={entity.profile_picture}
        alt={entity.name}
        className="object-cover h-full w-full"
      />

      {/* FALLBACK */}
      <AvatarFallback
        className={cn(
          "object-cover h-full w-full flex items-center justify-center",
          fallback_bg ? "bg-muted" : "bg-transparent",
          entity.type === "organization" ? "rounded-xs" : "rounded-full"
        )}
      >
        {entity.type === "organization" ? (
          <Building2 className="size-4" />
        ) : (
          <User className="size-4" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
