// API
import { api } from "@/services/api/maphub.api";

// Types
import {
  Author,
  LayerInfos,
  MapInfos,
  Metadata,
  Source,
  Thumbnail,
} from "@/interfaces/map";

export interface MapDetailResponse {
  map: MapInfos;
  author: Author;
  meta_data: Metadata;
}

// Interface for star toggle response
interface StarToggleResponse {
  is_starred: boolean;
  metrics: {
    stars: number;
    views: number;
  };
}

// Interface for updating map properties
export interface MapUpdateRequest {
  name: string;
  folder_id: string;
  public: boolean;
  description: string;
  tags: string[];
  source: Source | null;
  license: string | null;
  readme: string;
  visuals: Record<string, any>; // Store as JSON object in database
}

export const map_services = {
  /*======= GET OPERATIONS =======*/

  /**
   * Retrieves the details for the specified map
   * @param file_id - The ID of the map
   * @param increment_views - Whether to increment the view count (defaults to true)
   * @returns Promise with map details including metadata
   */
  get_map_async: async (
    map_id: string,
    increment_views: boolean = true
  ): Promise<MapDetailResponse> => {
    try {
      const response = await api.get<MapDetailResponse>(
        `/maps/${map_id}?increment_views=${increment_views}`
      );

      if (!response.data || !response.data.map || !response.data.meta_data) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch map details: ${error.message}`);
      }
      throw new Error("An unknown error occurred while fetching map details");
    }
  },

  /**
   * Retrieves the can edit status for the given map ID
   * @param map_id - The ID of the map
   * @returns Promise with the can edit status
   */
  get_can_edit_async: async (map_id: string): Promise<boolean> => {
    try {
      const response = await api.get(`/maps/${map_id}/can_edit`);
      return response.data;
    } catch (error) {
      throw new Error(
        "An unknown error occurred while checking if the map can be edited"
      );
    }
  },

  /**
   * Retrieves the tiler URL for the given map ID
   * @param file_id - The ID of the map
   * @param version_id - Optional ID of a specific version to get the tiler URL for
   * @param alias - Optional alias of a version to get the tiler URL for
   * @returns Promise with the tiler URL template as a string
   */
  get_tiler_url_async: async (
    file_id: string,
    version_id?: string,
    alias?: string
  ): Promise<string> => {
    try {
      let url = `/maps/${file_id}/tiler_url`;

      // Add version parameters if specified
      if (version_id || alias) {
        const params = new URLSearchParams();
        if (version_id) params.append("version_id", version_id);
        if (alias) params.append("alias", alias);
        url += `?${params.toString()}`;
      }

      const response = await api.get(url, {
        responseType: "text",
        transformResponse: [(data) => data],
      });

      if (!response.data || typeof response.data !== "string") {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch tiler URL: ${error.message}`);
      }
      throw new Error("An unknown error occurred while fetching tiler URL");
    }
  },

  /**
   * Retrieves the tiler information for the given map ID
   * @param file_id - The ID of the map
   * @param version_id - Optional ID of a specific version to get the info for
   * @returns Promise with tiler information object
   */
  get_tiling_info_async: async (
    file_id: string,
    version_id?: string
  ): Promise<LayerInfos> => {
    try {
      // Build the URL with version parameter if available
      let url = `/maps/${file_id}/layer_info`;
      if (version_id) {
        url += `?version_id=${encodeURIComponent(version_id)}`;
      }

      const response = await api.get(url);

      if (!response.data) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch layer info: ${error.message}`);
      }
      throw new Error("An unknown error occurred while fetching layer info");
    }
  },

  /**
   * Checks if the authenticated user has starred a specific map
   * @param mapId - The ID of the map to check
   * @returns Promise with star status ({ is_starred: true || false })
   */
  get_star_status_async: async (
    map_id: string
  ): Promise<{
    is_starred: boolean;
  }> => {
    try {
      const response = await api.get(`/maps/${map_id}/star`);

      if (!response.data || response.data.is_starred === undefined) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch map star status: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while fetching map star status"
      );
    }
  },

  /**
   * Gets the thumbnail for a map
   * @param map_id - The ID of the map
   * @returns Promise with the thumbnail as a Blob
   */
  get_thumbnail: async (map_id: string): Promise<Thumbnail> => {
    try {
      const response = await api.get(`/maps/${map_id}/thumbnail`, {
        responseType: "blob",
      });

      const thumbnail: Thumbnail = {
        data: response.data,
        timestamp: Date.now(),
      };

      return thumbnail;
    } catch (error) {
      console.error("Error fetching thumbnail:", error);
      throw error;
    }
  },

  /*======= POST OPERATIONS =======*/
  /**
   * Toggles a star for a map by the authenticated user
   * @param map_id - The ID of the map to star/unstar
   * @returns Promise with updated metrics and new star status
   */
  toggle_star_async: async (map_id: string): Promise<StarToggleResponse> => {
    try {
      const response = await api.post<StarToggleResponse>(
        `/maps/${map_id}/star`
      );

      if (
        !response.data ||
        response.data.is_starred === undefined ||
        !response.data.metrics
      ) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to toggle map star: ${error.message}`);
      }
      throw new Error("An unknown error occurred while toggling map star");
    }
  },

  /*======= PUT OPERATIONS =======*/
  update_map_async: async (id: string, new_infos: MapUpdateRequest) => {
    try {
      const body = {
        name: new_infos?.name,
        folder_id: new_infos?.folder_id,
        public: new_infos?.public,
        description: new_infos?.description,
        tags: new_infos?.tags,
        source: new_infos?.source,
        license: new_infos?.license,
        readme: new_infos?.readme,
        visuals: new_infos?.visuals,
      };

      const response = await api.put<MapInfos>(`/maps/${id}`, body);

      if (!response.data) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update map: ${error.message}`);
      }
      throw new Error("An unknown error occurred while updating map");
    }
  },

  /**
   * Updates the folder location of a map
   * @param map_id - The ID of the map to move
   * @param folder_id - The ID of the target folder
   * @returns Promise with update confirmation message
   */

  update_folder_async: async (
    folder_id: string,
    map_id: string
  ): Promise<{ message: string }> => {
    try {
      const params = new URLSearchParams();
      params.append("folder_id", folder_id);

      const response = await api.put<{ message: string }>(
        `/maps/${map_id}/folder?${params.toString()}`
      );

      if (!response.data) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update map folder: ${error.message}`);
      }
      throw new Error("An unknown error occurred while updating map folder");
    }
  },

  /**
   * Uploads a custom thumbnail image for a map
   * @param map_id - The ID of the map to add the thumbnail to
   * @param file - The image file to upload (should be PNG or JPEG)
   * @returns Promise with the upload confirmation
   */
  update_thumbnail_from_file_async: async (
    map_id: string,
    file: File
  ): Promise<{ message: string }> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.put<{ message: string }>(
        `/maps/${map_id}/thumbnail`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to upload thumbnail: ${error.message}`);
      }
      throw new Error("An unknown error occurred while uploading thumbnail");
    }
  },

  /**
   * Saves the current map view as a thumbnail for the map
   * @param map_id - The ID of the map
   * @param image_data - Base64-encoded image data
   * @returns Promise with the save confirmation
   */
  update_thumbnail_from_image_data_async: async (
    map_id: string,
    image_data: string
  ): Promise<{ message: string }> => {
    try {
      if (!image_data || image_data.length < 100) {
        throw new Error("Invalid or empty image data");
      }

      if (!image_data.startsWith("data:image/png;base64,")) {
        image_data = "data:image/png;base64," + image_data;
      }

      try {
        const prefixRemoved = image_data.startsWith("data:image/png;base64,")
          ? image_data.replace("data:image/png;base64,", "")
          : image_data;

        const firstChunk = atob(prefixRemoved.substring(0, 10));
        if (!firstChunk.startsWith("\x89PNG")) {
          console.warn("Image data does not appear to be a valid PNG");
        }
      } catch (e) {
        console.warn("Unable to verify PNG signature:", e);
      }

      const response = await api.put<{ message: string }>(
        `/maps/${map_id}/thumbnail/from-view`,
        { image_data: image_data },
        {
          timeout: 30000,
        }
      );

      if (!response.data) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to save view as thumbnail: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while saving view as thumbnail"
      );
    }
  },

  /*======= DELETE OPERATIONS =======*/

  /**
   * Deletes a map by ID
   * @param file_id - The ID of the map to delete
   * @returns Promise with delete confirmation message
   */
  delete_map_async: async (file_id: string): Promise<{ message: string }> => {
    try {
      const response = await api.delete<{ message: string }>(
        `/maps/${file_id}`
      );

      if (!response.data) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete map: ${error.message}`);
      }
      throw new Error("An unknown error occurred while deleting the map");
    }
  },
};
