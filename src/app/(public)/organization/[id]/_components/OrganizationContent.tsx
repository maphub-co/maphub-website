import { Organization } from "@/interfaces/organization";
import { MapInfos } from "@/interfaces/map";
import OrganizationHeader from "./OrganizationHeader";
import OrganizationMaps from "./OrganizationMaps";

interface OrganizationContentProps {
  organization: Organization;
  maps: MapInfos[];
}

export default function OrganizationContent({ organization, maps }: OrganizationContentProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <OrganizationHeader organization={{ ...organization, top_maps: maps }} />
      <OrganizationMaps maps={maps} />
    </div>
  );
}

