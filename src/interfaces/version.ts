export interface VersionState {
  status: "uploading" | "processing" | "completed" | "failed";
  progress: number;
  message?: string;
}

export interface Version {
  id: string;
  map_id: string;
  alias?: string;
  version_description: string;
  previous_version_id?: string;
  created_time: string;
  state: VersionState;
  meta_data: Record<string, any>;
}

export interface VersionUploadParams {
  map_id: string;
  file: File;
  version_description: string;
  colormap?: string;
  vector_lod?: number;
}
