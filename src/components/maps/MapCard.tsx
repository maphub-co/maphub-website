"use client";

// LIBRARIES
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Eye, Layers, Star } from "lucide-react";

// INTERFACES
import { MapInfos } from "@/interfaces/map";

// UTILS
import { cn } from "@/utils/tailwindcss.utils";

/*======= INTERFACES =======*/
interface MapCardProps {
  id: string;
  className?: string;
  params: MapInfos;
}

/*======= COMPONENT =======*/
export default function MapCard({ id, className, params }: MapCardProps) {
  /*------- ATTRIBUTS -------*/
  const { name, type, author, views, stars, tags, updated_time } = params;
  const [thumbnail_url, set_thumbnail_url] = useState<string | null>(
    `${process.env.NEXT_PUBLIC_MAPHUB_API_URL}/maps/${id}/thumbnail`
  );

  const Icon = type.toLowerCase() === "vector" ? Box : Layers;
  const css_gradient =
    type.toLowerCase() === "vector"
      ? "from-blue-600 to-emerald-600"
      : "from-blue-600 to-red-400";

  /*------- RENDERER -------*/
  return (
    <div
      className={cn(
        className,
        "flex flex-col items-center group border hover:shadow-md transition-all overflow-hidden backdrop-blur-sm rounded-md relative"
      )}
    >
      <Link className="absolute inset-0 z-1" href={`/map/${id}`} />

      {/* IMAGE */}
      <div className="relative w-full aspect-video">
        {thumbnail_url ? (
          <Image
            src={thumbnail_url}
            alt={name}
            fill
            sizes="288px"
            className="object-cover"
            onError={() => set_thumbnail_url(null)}
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${css_gradient} flex items-center justify-center`}
          >
            <Icon className="w-8 h-8 text-white/80" />
          </div>
        )}
      </div>

      {/* TEXT */}
      <div className="w-full h-full p-4 flex flex-col gap-2">
        {/* TITLE AND AUTHOR */}
        <div>
          <h3 className="font-medium mb-1 line-clamp-1">{name}</h3>
          {/* Map Author */}
          {author && (
            <div className="text-xs mt-1">
              by{" "}
              {author.id ? (
                <Link
                  href={
                    author.type === "user"
                      ? `/profile/${author.id}`
                      : `/organization/${author.id}`
                  }
                  className="hover:underline text-primary relative z-10"
                  onClick={(event) => event.stopPropagation()}
                >
                  @{author.display_name}
                </Link>
              ) : (
                <span>{author.display_name}</span>
              )}
            </div>
          )}
        </div>

        {/* METRICS */}
        <div className="flex items-center gap-2">
          {/* Stars */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4" />
            <span className="text-xs">{stars}</span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg">
            <Eye className="w-4 h-4" />
            <span className="text-xs">{views}</span>
          </div>
        </div>

        {/* TAGS */}
        <div className="flex flex-wrap items-center gap-2">
          {tags &&
            tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 inline-flex bg-accent text-accent-foreground text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
          {tags?.length > 3 && (
            <span className="text-xs">+{tags.length - 3} more</span>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-auto">
          <p className="text-xs text-muted-foreground">
            Updated {new Date(updated_time).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
