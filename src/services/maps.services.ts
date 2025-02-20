// API
import { api } from "@/services/api/maphub.api";
import axios from "axios";

// Types
import { MapInfos } from "@/interfaces/map";
import { Entity } from "@/interfaces/entity";

// Interface for paginated maps response
export interface PaginatedMapsResponse {
  maps: MapInfos[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export const maps_services = {
  /**
   * Retrieves the list of maps for the given project
   * @param projectId - The UUID of the project to fetch maps for
   * @returns Promise with array of map items
   */
  get_maps_async: async (projectId: string): Promise<MapInfos[]> => {
    try {
      const response = await api.get<MapInfos[]>(
        `/maps?project_id=${projectId}`
      );

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch maps: ${error.message}`);
      }
      throw new Error("An unknown error occurred while fetching maps");
    }
  },

  /**
   * Retrieves the list of featured maps (most viewed)
   * @returns Promise with array of map items
   */
  get_featured_maps_async: async (): Promise<MapInfos[]> => {
    try {
      const response = await api.get<MapInfos[]>("/maps/recent");

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch maps: ${error.message}`);
      }
      throw new Error("An unknown error occurred while fetching maps");
    }
  },

  /**
   * Retrieves maps with pagination and sorting options
   * @param sortBy - Sort by: "recent", "stars", or "views"
   * @param page - Page number (starts from 1)
   * @param pageSize - Number of items per page
   * @returns Promise with paginated maps response
   */
  get_paginated_maps_async: async (
    sortBy: string = "recent",
    page: number = 1,
    pageSize: number = 9
  ): Promise<PaginatedMapsResponse> => {
    try {
      const response = await api.get<PaginatedMapsResponse>(`/maps/list`, {
        params: {
          sort_by: sortBy,
          page: page,
          page_size: pageSize,
        },
      });

      if (!response.data || !response.data.maps || !response.data.pagination) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch maps: ${error.message}`);
      }
      throw new Error("An unknown error occurred while fetching maps");
    }
  },

  /**
   * Search for maps based on query text, type, and tags
   * @param searchQuery - Text to search in name and description
   * @param vectorType - Optional type filter (raster/vector)
   * @param tags - Optional tags to filter by
   * @param authorUid - Optional author UID to filter by
   * @returns Promise with array of maps that match the search criteria
   */
  search_maps_async: async ({
    query,
    tags,
    user_uid,
    org_id,
  }: {
    query?: string;
    tags?: string[];
    user_uid?: string;
    org_id?: string;
  }): Promise<MapInfos[]> => {
    try {
      const body: any = {};

      // Only include parameters that are defined
      if (query !== undefined && query !== "") {
        body.search_query = query;
      }

      if (tags && tags.length > 0) {
        body.tags = tags;
      }

      if (!!user_uid) {
        body.author_uid = user_uid;
      }

      if (!!org_id) {
        body.organization_id = org_id;
      }

      console.log(body);
      const response = await api.post<PaginatedMapsResponse>(
        "/maps/search_v2",
        body
      );

      const maps = response.data.maps;

      console.log(maps);

      if (!maps || !Array.isArray(maps)) {
        throw new Error("Invalid server response format");
      }

      return maps;
    } catch (error) {
      console.error("Search error:", error);

      // Extract the most specific error message we can
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const serverError = error.response.data?.detail || error.message;
        throw new Error(`Search failed (${status}): ${serverError}`);
      }

      if (error instanceof Error) {
        throw new Error(`Search failed: ${error.message}`);
      }

      throw new Error("An unknown error occurred while searching maps");
    }
  },

  /**
   * Fetch the most common tags used across all public maps
   * @param limit Maximum number of tags to return
   * @returns Array of tag objects with name and count
   */
  fetch_common_tags_async: async (
    limit: number = 10
  ): Promise<{ name: string; count: number }[]> => {
    try {
      const response = await api.get(`/maps/tags/common`, {
        params: { limit },
      });

      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Error fetching common tags:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch common tags:", error);
      return [];
    }
  },
};
