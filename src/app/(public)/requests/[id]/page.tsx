// LIBRARIES
import { Metadata } from "next";

// SERVICES
import { requests_services } from "@/services/requests.services";

// COMPONENTS
import RequestClient from "./page.client";

/*======= INTERFACES =======*/
interface RequestPageProps {
  params: Promise<{ id: string }>;
}

/*======= METADATA =======*/
export async function generateMetadata({
  params,
}: RequestPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const { request } = await requests_services.get_request_async(id);

    return {
      title: "Request Details",
      description: `View details for a dataset request and contribute or upvote`,
      alternates: {
        canonical: `https://www.maphub.co/requests/${request.title
          .toLowerCase()
          .replace(/ /g, "-")}`,
      },
    };
  } catch (error) {
    return {
      title: "Request Details",
      description:
        "View details for a dataset request and contribute or upvote",
      alternates: {
        canonical: "https://www.maphub.co/requests/request-details",
      },
    };
  }
}

/*======= PAGE =======*/
export default async function RequestPage({ params }: RequestPageProps) {
  const { id } = await params;

  return <RequestClient request_id={id} />;
}
