export interface Entity {
  id: string;
  name: string;
  profile_picture: string;
  owner_uid: string;
  type: "user" | "organization";
}
