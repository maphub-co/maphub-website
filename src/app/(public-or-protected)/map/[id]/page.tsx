// LIBRARIES
import { Metadata } from "next";

// SERVICES
import { map_services } from "@/services/map.services";

// COMPONENTS
import Main from "./_components/Main";

// CONSTANTS
const BASE_URL = process.env.NEXT_PUBLIC_MAPHUB_API_URL;

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const map_info = await map_services.get_map_async(id, false);
    const { map, author } = map_info;

    return {
      title: map.name,
      description: map.description || "Explore this map on MapHub.co",
      alternates: {
        canonical: `https://www.maphub.co/map/${map.name
          .toLowerCase()
          .replace(/ /g, "-")}`,
      },
      authors: [
        {
          name: author.display_name || "unknown",
          url: author.id ? `${BASE_URL}/profile/${author.id}` : undefined,
        },
      ],
      creator: author.display_name || "unknown",
      keywords: map.tags.length > 0 ? map.tags : undefined,
      openGraph: {
        title: `${map.name} - MapHub.co`,
        description: map.description || "Explore this map on MapHub.co",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: map.name,
        description: map.description || "Explore this map on MapHub.co",
      },
    };
  } catch (error) {
    return {
      title: { absolute: "MapHub.co" },
      description: "Explore maps and geospatial datasets on MapHub.co",
      openGraph: {
        title: `MapHub.co`,
        description: "Explore maps and geospatial datasets on MapHub.co",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "MapHub.co",
        description: "Explore maps and geospatial datasets on MapHub.co",
      },
    };
  }
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <Main id={id} />;
}
