// LIBRARIES
import { Metadata } from "next";
import { notFound } from "next/navigation";

// COMPONENTS
import ProfileContent from "./_components/ProfileContent";

// SERVICES
import { user_service } from "@/services/user.services";
import { maps_services } from "@/services/maps.services";

/*======= INTERFACE =======*/
interface PublicProfilePageProps {
  params: Promise<{ id: string }>;
}

/*======= METADATA =======*/
export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const user = await user_service.get_user(id);

    return {
      title: user?.display_name || "Profile",
      description: `View ${user?.display_name} profile on MapHub.co.`,
      alternates: {
        canonical: `https://www.maphub.co/profile/${user?.display_name}`,
      },
    };
  } catch (error) {
    return {
      title: "Profile",
      description: "View users profile and their published maps on MapHub.co.",
    };
  }
}

/*======= COMPONENT =======*/
export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  try {
    const { id } = await params;

    try {
      const [user, maps] = await Promise.all([
        user_service.get_user(id),
        maps_services.search_maps_async({
          user_uid: id,
        }),
      ]);

      return <ProfileContent user={user} maps={maps} />;
    } catch (error) {
      // Handle specific API errors
      if (error instanceof Error) {
        // If the profile doesn't exist, show 404
        if (
          error.message.includes("not found") ||
          error.message.includes("404")
        ) {
          notFound();
        }

        // For other API errors, throw them to be caught by error.tsx
        throw new Error(`Failed to load profile: ${error.message}`);
      }
      throw error;
    }
  } catch (error) {
    // Handle any other errors (like params parsing)
    throw new Error("Failed to load profile page");
  }
}
