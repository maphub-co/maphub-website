import { api } from "@/services/api/maphub.api";
import { Version, VersionUploadParams } from "@/interfaces/version";

export const version_services = {
  /**
   * Gets a specific version by ID
   */
  get_version_async: async (version_id: string): Promise<Version> => {
    try {
      const response = await api.get<Version>(`/versions/${version_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch version: ${error.message}`);
      }
      throw new Error("An unknown error occurred");
    }
  },

  /**
   * Gets all versions from a map
   */
  get_map_versions_async: async (map_id: string): Promise<Version[]> => {
    try {
      const response = await api.get<Version[]>(`/versions/map/${map_id}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch versions: ${error.message}`);
      }
      throw new Error("An unknown error occurred");
    }
  },

  /**
   * Gets all recent uploads from a user
   */
  get_recent_versions_from_user_async: async (): Promise<Version[]> => {
    try {
      const response = await api.get<Version[]>(`/versions/recent`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch versions: ${error.message}`);
      }
      throw new Error("An unknown error occurred");
    }
  },

  /**
   * Uploads a new version of a map
   */
  upload_version_async: async ({
    map_id,
    file,
    version_description,
    colormap,
    vector_lod,
  }: VersionUploadParams): Promise<{
    task_id: string;
    map_id: string;
    version: number;
    type: string;
  }> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Add version description as query parameter
      const queryParams = new URLSearchParams({
        version_description,
      });

      // Add optional parameters
      if (colormap) queryParams.append("colormap", colormap);
      if (vector_lod) queryParams.append("vector_lod", vector_lod.toString());

      const response = await api.post(
        `/versions?map_id=${map_id}&${queryParams.toString()}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to upload version: ${error.message}`);
      }
      throw new Error("An unknown error occurred");
    }
  },

  /**
   * Downloads a specific version
   */
  download_version_async: async (
    version_id: string,
    file_format?: string
  ): Promise<Blob> => {
    try {
      const queryParams = file_format ? `?file_format=${file_format}` : "";
      const response = await api.get(
        `/versions/${version_id}/download${queryParams}`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to download version: ${error.message}`);
      }
      throw new Error("An unknown error occurred");
    }
  },

  /**
   * Apply an alias to a version
   */
  apply_alias_async: async (
    version_id: string,
    alias: string = "latest"
  ): Promise<void> => {
    try {
      await api.put(`/versions/${version_id}/alias?alias=${alias}`);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to apply alias: ${error.message}`);
      }
      throw new Error("An unknown error occurred");
    }
  },
};
