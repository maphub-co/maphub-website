// TYPES
export type Step =
  | "welcome"
  | "usage"
  | "features"
  | "traction_channel"
  | "organization_action"
  | "organization_name"
  | "organization_join"
  | "organization_join_confirmation"
  | "confirmation"
  | "setup";

export type UsageType = "work" | "education" | "personal";

export type OrganizationAction = "create" | "join";

export interface OnboardingData {
  name: string;
  usage: UsageType | undefined;
  role: string;
  industry: string;
  features: string[];
  traction_channel: string;
}
