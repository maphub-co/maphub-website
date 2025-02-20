// API
import { api } from "@/services/api/maphub.api";

// Interfaces
import { RequestInfos, Request, RequestComment } from "@/interfaces/request";

export interface RequestListResponse {
  requests: RequestInfos[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export const requests_services = {
  /**
   * Get a specific dataset request by ID
   * @param request_id - The UUID of the dataset request
   * @returns Promise with the dataset request details
   */
  get_request_async: async (request_id: string): Promise<RequestInfos> => {
    try {
      const response = await api.get<RequestInfos>(`/requests/${request_id}`);

      if (!response.data) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch dataset request: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while fetching dataset request"
      );
    }
  },

  /**
   * Get a list of dataset requests with filtering and pagination
   * @param page - Page number (starts from 1)
   * @param pageSize - Number of items per page
   * @param status - Optional filter by status (open, fulfilled, validated, closed)
   * @param tags - Optional array of tags to filter by
   * @param search - Optional search text for title and description
   * @param sortBy - Sort method (recent, popular)
   * @param userId - Optional filter by requester user ID
   * @returns Promise with paginated list of dataset requests
   */
  get_requests_async: async (
    page: number = 1,
    pageSize: number = 10,
    status?: string,
    tags?: string[],
    search?: string,
    sortBy: string = "recent",
    userId?: string
  ): Promise<RequestListResponse> => {
    try {
      // Build query parameters
      const params: Record<string, any> = {
        page,
        page_size: pageSize,
        sort_by: sortBy,
      };

      // Handle special "validated" status
      if (status === "validated") {
        params.status = "fulfilled";
        params.is_validated = true;
      } else if (status && status !== "all") {
        params.status = status;
      }

      if (search) params.search = search;
      if (userId) params.user_id = userId;
      if (tags && tags.length > 0) {
        // For array parameters, we need to specify each item separately
        tags.forEach((tag, index) => {
          params[`tags[${index}]`] = tag;
        });
      }

      const response = await api.get<RequestListResponse>("/requests", {
        params,
      });

      if (
        !response.data ||
        !response.data.requests ||
        !response.data.pagination
      ) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch dataset requests: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while fetching dataset requests"
      );
    }
  },

  /**
   * Create a new dataset request
   * @param title - The title of the dataset request
   * @param description - The description of the dataset request
   * @param tags - Optional array of tags for the request
   * @returns Promise with the created dataset request
   */
  create_request_async: async (
    title: string,
    description: string,
    tags: string[] = []
  ): Promise<Request> => {
    try {
      const response = await api.post<Request>("/requests", {
        title,
        description,
        tags,
      });

      if (!response.data) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error: any) {
      if (!!error.data) {
        throw new Error(error.data.detail);
      }

      throw new Error(
        error.message ||
          "An unknown error occurred while creating dataset request"
      );
    }
  },

  /**
   * Update an existing dataset request
   * @param request_id - The UUID of the dataset request to update
   * @param title - The updated title
   * @param description - The updated description
   * @param tags - The updated tags
   * @returns Promise with the updated dataset request
   */
  update_request_async: async (
    request_id: string,
    title: string,
    description: string,
    tags: string[] = []
  ): Promise<Request> => {
    try {
      const response = await api.put<Request>(`/requests/${request_id}`, {
        title,
        description,
        tags,
      });

      if (!response.data) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update dataset request: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while updating dataset request"
      );
    }
  },

  /**
   * Delete a dataset request
   * @param request_id - The UUID of the dataset request to delete
   * @returns Promise that resolves when deletion is successful
   */
  delete_request_async: async (request_id: string): Promise<void> => {
    try {
      await api.delete(`/requests/${request_id}`);
    } catch (error: any) {
      if (!!error.data) {
        throw new Error(error.data.detail);
      }

      if (error instanceof Error) {
        throw new Error(`Failed to delete dataset request: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while deleting dataset request"
      );
    }
  },

  /**
   * Upvote a dataset request
   * @param request_id - The UUID of the dataset request to upvote
   * @returns Promise with the new upvote count
   */
  upvote_request_async: async (request_id: string): Promise<number> => {
    try {
      const response = await api.post(`/requests/${request_id}/upvote`);
      return response.data.upvote_count;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to upvote dataset request: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while upvoting dataset request"
      );
    }
  },

  /**
   * Remove an upvote from a dataset request
   * @param request_id - The UUID of the dataset request to remove upvote from
   * @returns Promise with the new upvote count
   */
  remove_upvote_async: async (request_id: string): Promise<number> => {
    try {
      const response = await api.delete(`/requests/${request_id}/upvote`);
      return response.data.upvote_count;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to remove upvote: ${error.message}`);
      }
      throw new Error("An unknown error occurred while removing upvote");
    }
  },

  /**
   * Get comments for a dataset request
   * @param request_id - The UUID of the dataset request
   * @returns Promise with list of comments
   */
  get_comments_async: async (
    request_id: string
  ): Promise<{ comments: RequestComment[]; pagination: any }> => {
    try {
      const response = await api.get(`/requests/${request_id}/comments`);

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch comments: ${error.message}`);
      }
      throw new Error("An unknown error occurred while fetching comments");
    }
  },

  /**
   * Submit a comment on a dataset request
   * @param request_id - The UUID of the dataset request
   * @param content - The comment text
   * @param isRejectionReason - Whether this comment explains a rejection
   * @param parentId - Optional parent comment ID for threaded replies
   * @returns Promise with the created comment
   */
  add_comment_async: async (
    request_id: string,
    content: string,
    isRejectionReason: boolean = false,
    parentId?: string
  ): Promise<RequestComment> => {
    try {
      const requestData: any = {
        content,
        is_rejection_reason: isRejectionReason,
      };

      if (parentId) {
        requestData.parent_id = parentId;
      }

      const response = await api.post(
        `/requests/${request_id}/comments`,
        requestData
      );

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to add comment: ${error.message}`);
      }
      throw new Error("An unknown error occurred while adding comment");
    }
  },

  /**
   * Delete a comment on a dataset request
   * @param request_id - The UUID of the dataset request
   * @param comment_id - The UUID of the comment to delete
   * @returns Updated list of comments and total number of comments
   */
  delete_comment_async: async (
    request_id: string,
    comment_id: string
  ): Promise<{ comments: RequestComment[]; total: number }> => {
    try {
      const response = await api.delete(
        `/requests/${request_id}/comments/${comment_id}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete comment: ${error.message}`);
      }
      throw new Error("An unknown error occurred while deleting comment");
    }
  },

  /**
   * Mark a dataset request as fulfilled with a specific map
   * @param request_id - The UUID of the dataset request
   * @param mapId - The UUID of the map that fulfills the request
   * @returns Promise that resolves when submission is successful
   */
  submission_request_async: async (
    request_id: string,
    mapId: string
  ): Promise<void> => {
    try {
      await api.post(`/requests/${request_id}/submit`, {
        map_id: mapId,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to submit request: ${error.message}`);
      }
      throw new Error("An unknown error occurred while submiting request");
    }
  },

  /**
   * Validate a submission for a dataset request
   * @param request_id - The UUID of the dataset request
   * @returns Promise that resolves when validation is successful
   */
  validate_submission_async: async (request_id: string): Promise<void> => {
    try {
      await api.post(`/requests/${request_id}/validate`);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to validate submited map: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while validating submited map"
      );
    }
  },

  /**
   * Reject a submitment for a dataset request
   * @param request_id - The UUID of the dataset request
   * @param mapId - The UUID of the map to reject
   * @returns Promise that resolves when rejection is successful
   */
  reject_submission_async: async (
    request_id: string,
    mapId: string
  ): Promise<void> => {
    try {
      await api.post(`/requests/${request_id}/reject`, {
        map_id: mapId,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to reject map submission: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while rejecting map submission"
      );
    }
  },

  /**
   * Get list of dataset requests that the current user has upvoted
   * @returns Promise with array of upvoted request IDs
   */
  get_upvoted_requests_async: async (): Promise<string[]> => {
    try {
      const response = await api.get("/requests/user/upvoted");
      return response.data.upvoted_request_ids || [];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch upvoted requests: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while fetching upvoted requests"
      );
    }
  },
};
