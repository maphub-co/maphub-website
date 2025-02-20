// LIBRARIES
import { Metadata } from "next";
import { notFound } from "next/navigation";

// COMPONENTS
import OrganizationContent from "./_components/OrganizationContent";

// SERVICES
import { get_organization_async } from "@/services/organization.services";
import { maps_services } from "@/services/maps.services";

/*======= INTERFACE =======*/
interface PublicOrganizationPageProps {
  params: Promise<{ id: string }>;
}

/*======= METADATA =======*/
export async function generateMetadata({
  params,
}: PublicOrganizationPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const organization = await get_organization_async(id);

    return {
      title: organization?.name || "Organization",
      description:
        organization?.description ||
        `View ${organization?.name} profile on MapHub.co.`,
      alternates: {
        canonical: `https://www.maphub.co/organisation/${organization?.id}`,
      },
    };
  } catch (error) {
    return {
      title: "Organization",
      description:
        "View organization profile and their published maps on MapHub.co.",
    };
  }
}

/*======= COMPONENT =======*/
export default async function PublicOrganizationPage({
  params,
}: PublicOrganizationPageProps) {
  try {
    const { id } = await params;

    try {
      const [organization, maps] = await Promise.all([
        get_organization_async(id),
        maps_services.search_maps_async({
          org_id: id,
        }),
      ]);

      return <OrganizationContent organization={organization} maps={maps} />;
    } catch (error) {
      // Handle specific API errors
      if (error instanceof Error) {
        // If the organization doesn't exist, show 404
        if (
          error.message.includes("not found") ||
          error.message.includes("404")
        ) {
          notFound();
        }

        // For other API errors, throw them to be caught by error.tsx
        throw new Error(`Failed to load organization: ${error.message}`);
      }
      throw error;
    }
  } catch (error) {
    // Handle any other errors (like params parsing)
    throw new Error("Failed to load organization page");
  }
}
