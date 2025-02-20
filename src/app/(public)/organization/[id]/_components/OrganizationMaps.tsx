// LIBRARIES
import Link from "next/link";

// INTERFACES
import { MapInfos } from "@/interfaces/map";

// COMPONENTS
import MapCard from "@/components/maps/MapCard";

/*======= INTERFACES =======*/
interface OrganizationMapsProps {
  maps: MapInfos[];
}

/*======= COMPONENT =======*/
export default function OrganizationMaps({ maps }: OrganizationMapsProps) {
  if (maps.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Maps Yet</h2>
        <p className="text-muted-foreground">
          This organization hasn't published any maps yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Published Maps</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {maps.map((map) => (
          <MapCard key={map.id} id={map.id} params={map} />
        ))}
      </div>
    </div>
  );
}

