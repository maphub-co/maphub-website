// LIBRARIES
import Link from "next/link";

// SERVICES
import { Organization } from "@/interfaces/organization";
import { MapInfos } from "@/interfaces/map";

// COMPONENTS
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Building2, Globe, Mail } from "lucide-react";

/*======= INTERFACES =======*/
interface OrganizationHeaderProps {
  organization: Organization & { top_maps?: MapInfos[] };
}

/*======= COMPONENT =======*/
export default function OrganizationHeader({
  organization,
}: OrganizationHeaderProps) {
  return (
    <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6 ">
      {/* PROFILE PICTURE */}
      <Avatar className="w-24 h-24 rounded-xs">
        <AvatarImage
          src={organization.logo_url || undefined}
          alt={organization.name}
        />
        <AvatarFallback>
          {organization.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <h1 className="text-2xl font-bold">{organization.name}</h1>
        {organization.description && (
          <p className="text-muted-foreground mb-4">
            {organization.description}
          </p>
        )}
      </div>
    </div>
  );
}
