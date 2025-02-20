// TYPES
import { User } from "@/interfaces/user";
import { Entity } from "@/interfaces/entity";

// LIBRARIES
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserIcon } from "lucide-react";

// SERVICES
import { user_service } from "@/services/user.services";
import { get_organization_async } from "@/services/organization.services";

// STORES
import { useMapStore } from "@/stores/map.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

// UTILS
import { organization_to_entity, user_to_entity } from "@/utils/entity.utils";
import EntityAvatar from "@/components/entity/EntityAvatar";

/*======= COMPONENT =======*/
export default function AuthorSection() {
  /*------- ATTRIBUTES -------*/
  const [is_editable, author] = useMapStore((state) => [
    state.is_editable,
    state.author,
  ]);
  const [entity, set_entity] = useState<Entity | null>(null);
  const [is_loading, set_loading] = useState(false);

  /*------- METHODS -------*/
  const fetch_user = async () => {
    if (!author) return;

    try {
      const user = await user_service.get_user(author?.id);
      return user;
    } catch (error) {
      console.error("Failed to fetch author:", error);
    }
  };

  const fetch_organization = async () => {
    if (!author) return;

    try {
      const organization = await get_organization_async(author.id);
      return organization;
    } catch (error) {
      console.error("Failed to fetch organization:", error);
    }
  };

  const load_entity = async () => {
    if (!author) return;
    set_loading(true);

    if (author.type === "user") {
      const user = await fetch_user();
      console.log(user);
      if (user) {
        set_entity(user_to_entity(user));
      }
    } else {
      const organization = await fetch_organization();
      console.log(organization);
      if (organization) {
        set_entity(organization_to_entity(organization));
      }
    }

    set_loading(false);
  };

  /*------- HOOKS -------*/
  useEffect(() => {
    if (!author || is_editable) return;

    load_entity();
  }, [author, is_editable]);

  /*------- RENDERER -------*/
  if (is_editable || !entity || is_loading) return <></>;

  return (
    <div className="flex flex-col gap-y-4">
      {/* HEADER */}
      <div className="border-b py-4">
        <h3 className="font-semibold">Author</h3>
      </div>

      {/* AUTHORS */}
      <div className="flex flex-col gap-y-2">
        <Link
          href={
            entity.type === "user"
              ? `/profile/${entity.id}`
              : `/organization/${entity.id}`
          }
          className="flex items-center gap-x-2"
        >
          {/* USER PICTURE */}
          <EntityAvatar entity={entity} size={6} />

          {/* USER NAME */}
          <span className="hidden md:flex items-center gap-1">
            {entity.name}
          </span>
        </Link>
      </div>
    </div>
  );
}
