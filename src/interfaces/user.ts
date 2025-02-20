export interface User {
  uid: string;
  display_name: string;
  email: string;
  email_verified: boolean;
  tier: string;
  bio: string;
  location: string;
  website: string;
  avatar_url: string;
  social_links: Record<string, string>;
  created_time: string;
  updated_time: string;
}

export interface Author {
  id: string;
  name: string;
}

export interface Quotas {
  tier: string;
  storage: {
    limit: number;
    used: number;
  };
  file_size_limit: number;
  public_maps: {
    limit: number;
    used: number;
  };
  private_maps: {
    limit: number;
    used: number;
  };
  features: {
    api_access: boolean;
    team_collaboration: boolean;
    webhook_integration: boolean;
    drive_connection: boolean;
    private_map_sharing: boolean;
    dedicated_tiler: boolean;
    custom_base_maps: boolean;
    versioning: boolean;
    usage_tracking: boolean;
  };
  support_level: string;
  extra_storage_price: number | null;
}
