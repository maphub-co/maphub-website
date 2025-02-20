export const PLUS_SEATS_PRICE = 29;
export const PRO_SEATS_PRICE = 69;

export enum Tiers {
  PLUS = "Plus",
  PRO = "Pro",
}

export enum SubscriptionStatus {
  INACTIVE = "inactive",
  INCOMPLETE = "incomplete",
  INCOMPLETE_EXPIRED = "incomplete_expired",
  TRIALING = "trialing",
  ACTIVE = "active",
  PAST_DUE = "past_due",
  CANCELED = "canceled",
  UNPAID = "unpaid",
  PAUSED = "paused",
}

export interface SubscriptionItem {
  description: string | null;
  quantity: number;
  unit_price: number;
  total: number;
  currency: string;
}

export interface SubscriptionInfos {
  total_price: number;
  currency: string;
  interval: string;
  formatted: string;
  items: SubscriptionItem[];
  current_period_start: string | null;
  current_period_end: string | null;
  status: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  owner_uid: string;
  tier: Tiers;
  max_seats: number;
  max_total_storage: number;
  subscription_status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
}

export interface OrganizationQuotas {
  storage: {
    limit: number;
    used: number;
  };
  file_size: {
    limit: number;
  };
  seats: {
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
  support: {
    level: string;
  };
  extra_storage: {
    available: boolean;
    price_per_gb: number;
  };
}

export type OrganizationCreationStep = "name" | "setup";

export interface OrganizationData {
  organization_name: string;
}
