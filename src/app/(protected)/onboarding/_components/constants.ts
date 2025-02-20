import {
  Users,
  Share2,
  Building2,
  Users2,
  Mail,
  X,
  Linkedin,
  Search,
  Youtube,
  MoreHorizontal,
  Server,
  Layers2,
  Plug,
  FileStack,
} from "lucide-react";

export const MAX_SEATS = 20;

export const FEATURES = [
  {
    id: "hosting",
    label: "Hosting data",
    icon: Server,
    description: "Host and manage geospatial data",
  },
  {
    id: "collaboration",
    label: "Collaborating",
    icon: Users,
    description: "Work together with your team",
  },
  {
    id: "tiling",
    label: "Tiling services",
    icon: Layers2,
    description: "Access huge datasets through tiling services",
  },
  {
    id: "sharing",
    label: "Sharing & Publishing",
    icon: Share2,
    description: "Share maps with clients",
  },
  {
    id: "qgis",
    label: "QGIS to Cloud",
    icon: Plug,
    description: "QGIS plugin and direct intergration",
  },
  {
    id: "versioning",
    label: "Versioning",
    icon: FileStack,
    description: "Track changes and manage versions",
  },
];

export const TRACTION_CHANNEL_OPTIONS = [
  { id: "work", name: "From work", icon: Building2 },
  { id: "friend", name: "Friend or School", icon: Users2 },
  { id: "newsletter", name: "Newsletter or Blog", icon: Mail },
  { id: "x", name: "X (Twitter)", icon: X },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin },
  { id: "google", name: "Google", icon: Search },
  { id: "youtube", name: "YouTube", icon: Youtube },
  { id: "other", name: "Other", icon: MoreHorizontal },
];

export const PLAN_OPTIONS = [
  {
    id: "community" as const,
    label: "Community",
    description: "Perfect for individuals and small projects",
    features: [
      "Unlimited public maps",
      "Basic collaboration",
      "QGIS integration",
      "Community support",
      "5 GB storage",
    ],
  },
  {
    id: "team" as const,
    label: "Team",
    description: "Ideal for teams and organizations",
    features: [
      "Unlimited maps (public & private)",
      "Advanced collaboration",
      "QGIS integration",
      "Priority support",
      "50 GB storage per seat",
      "Advanced version control",
      "API access",
    ],
  },
];

export const ADVANTAGES = [
  "Collaboration",
  "3 seats included",
  "Unlimited maps (public & private)",
  "150 GB total storage",
  "Advanced version control",
  "API access",
  "Priority support",
];

export const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Government",
  "Non-profit",
  "Consulting",
  "Real Estate",
  "Transportation",
  "Energy",
  "Manufacturing",
  "Retail",
  "Other",
];

export const ROLES = [
  "Founder/CEO",
  "CTO/Technical Lead",
  "Project Manager",
  "Data Scientist",
  "GIS Specialist",
  "Developer",
  "Analyst",
  "Student",
  "Researcher",
  "Other",
];

export const STEPS_CONFIG = [
  {
    step: "welcome" as const,
    title: "Welcome",
    description: "Get started with MapHub",
  },
  {
    step: "traction_channel" as const,
    title: "Discovery",
    description: "How did you hear about us?",
  },
  {
    step: "usage" as const,
    title: "Usage",
    description: "How do you plan to use MapHub?",
  },
  {
    step: "features" as const,
    title: "Features",
    description: "Select your main use cases",
  },
  {
    step: "organization_action" as const,
    title: "Organization",
    description: "Choose your path",
  },
  {
    step: "organization_name" as const,
    title: "Organization",
    description: "Set up your workspace",
  },
  {
    step: "organization_join" as const,
    title: "Join Organization",
    description: "Select an organization to join",
  },
  {
    step: "organization_join_confirmation" as const,
    title: "Request Sent",
    description: "Join request submitted",
  },
  {
    step: "confirmation" as const,
    title: "Success",
    description: "Organization created",
  },
  {
    step: "setup" as const,
    title: "Setup",
    description: "Wait until your account is ready",
  },
];
