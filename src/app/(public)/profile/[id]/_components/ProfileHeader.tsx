// LIBRARIES
import Link from "next/link";

// SERVICES
import { User } from "@/interfaces/user";
import { MapInfos } from "@/interfaces/map";

// COMPONENTS
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { MapPin, Globe, Twitter, Linkedin, Github, Mail } from "lucide-react";

import { Icon } from "@iconify/react";
import Discord from "@iconify-icons/mdi/discord";

/*======= INTERFACES =======*/
interface ProfileHeaderProps {
  profile: User & { top_maps: MapInfos[] };
}

/*======= COMPONENT =======*/
export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
      {/* PROFILE PICTURE */}
      <Avatar className="w-24 h-24">
        <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
        <AvatarFallback>
          {profile.display_name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">{profile.display_name}</h1>
        {profile.bio && (
          <p className="text-muted-foreground mb-4">{profile.bio}</p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {profile.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <Link
                href={
                  profile.website.startsWith("http")
                    ? profile.website
                    : `https://${profile.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Website
              </Link>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {/* EMAIL */}
          {profile.social_links?.email && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`mailto:${profile.social_links.email}`}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Link>
            </Button>
          )}

          {/* TWITTER */}
          {profile.social_links?.twitter && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`https://twitter.com/${profile.social_links.twitter}`}
                target="_blank"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Link>
            </Button>
          )}

          {/* GITHUB */}
          {profile.social_links?.github && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`https://github.com/${profile.social_links.github}`}
                target="_blank"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Link>
            </Button>
          )}

          {/* LINKEDIN */}
          {profile.social_links?.linkedin && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={
                  profile.social_links.linkedin.startsWith("http")
                    ? profile.social_links.linkedin
                    : `https://${profile.social_links.linkedin}`
                }
                target="_blank"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Link>
            </Button>
          )}
          {profile.social_links?.discord && (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`https://discord.com/users/${profile.social_links.discord}`}
                target="_blank"
              >
                <Icon icon={Discord} className="h-4 w-4 mr-2" />
                Discord
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
