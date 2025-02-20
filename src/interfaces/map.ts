export interface Thumbnail {
  data: Blob;
  timestamp: number;
}

export interface Author {
  id: string;
  display_name: string;
  type: "user" | "organization";
}

export interface Source {
  name: string;
  url: string | null;
}

export enum Licenses {
  "open_data" = "ODbL 1.0",
  "creative_commons" = "CC BY-SA 4.0",
  "public_domain" = "CC 0 1.0",
}

export interface MapInfos {
  id: string;
  folder_id: string;
  name: string;
  type: string;
  meta_data: Metadata;
  public: boolean;
  created_time: string;
  updated_time: string;
  visuals: Record<string, any>; // Store as JSON object in database

  // SEO
  author?: Author;
  description: string;
  source: Source | null;
  license: Licenses | null;
  readme: string;
  tags: string[];

  // Metrics
  views: number;
  downloads: number;
  stars: number;
  starred_by: string[];
}

export interface Metadata {
  crs: string;
  bounds: number[];
  file_type: string;
  min?: number;
  max?: number;
  properties?: VectorProperty[];
}

export interface VectorProperty {
  max?: number;
  min?: number;
  mean?: number;
  median?: number;
  data_type: string;
  null_count: number;
  column_name: string;
  unique_values: number;
  max_length?: number;
  min_length?: number;
  geometry_types?: string[];
}

export interface LayerInfos {
  type: string;
  tiling_url: string;
  metadata_url?: string; // Optional metadata URL for vector maps
  max_zoom: number | null;
  min_zoom: number | null;
  bounds: [number, number, number, number];
}
