// LIBRARIES
import { WithContext, WebSite, Organization, SearchAction } from "schema-dts";

export const OrganizationSchema: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MapHub.co",
  url: "https://www.maphub.co",
  logo: {
    "@type": "ImageObject",
    url: "https://www.maphub.co/favicon-32x32.png",
  },
};

export const HubSearchActionSchema: WithContext<SearchAction> = {
  "@context": "https://schema.org",
  "@type": "SearchAction",
  target: "https://www.maphub.co/hub?q={search_term_string}",
  query: "required name=search_term_string",
};

export const HomePageSchema: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MapHub.co",
  url: "https://www.maphub.co",
  description:
    "MapHub.co is the community hub for GIS users to host, visualize, and share geospatial datasets - all in one platform.",
  publisher: OrganizationSchema,
  potentialAction: HubSearchActionSchema,
};

export const EnterprisePageSchema: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Enterprise - Maphub.co",
  url: "https://www.maphub.co/enterprise",
  description:
    "Maphub.co Enterprise is a platform designed for GIS teams to collaborate, scale, manage and share geospatial data with enterprise-grade security and performance.",
  publisher: OrganizationSchema,
  potentialAction: HubSearchActionSchema,
};
