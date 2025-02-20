import { User } from "@/interfaces/user";
import { MapInfos } from "@/interfaces/map";
import ProfileHeader from "./ProfileHeader";
import ProfileMaps from "./ProfileMaps";

interface ProfileContentProps {
  user: User;
  maps: MapInfos[];
}

export default function ProfileContent({ user, maps }: ProfileContentProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader profile={{ ...user, top_maps: maps }} />
      <ProfileMaps maps={maps} />
    </div>
  );
}
