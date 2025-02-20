import { User } from "@/interfaces/user";
import { Organization } from "@/interfaces/organization";
import { Entity } from "@/interfaces/entity";

export const user_to_entity = (user: User): Entity => ({
  id: user.uid,
  name: user.display_name,
  profile_picture: user.avatar_url,
  owner_uid: user.uid,
  type: "user",
});

export const organization_to_entity = (org: Organization): Entity => ({
  id: org.id,
  name: org.name,
  profile_picture: org.logo_url || "",
  owner_uid: org.owner_uid,
  type: "organization",
});
