export interface Workspace {
  id: string;
  organization_id: string | null;
  name: string;
  user_uid: string[];
  created_at: string;
  updated_at: string;
}
