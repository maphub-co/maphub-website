import { api } from "@/services/api/maphub.api";
import { Workspace } from "@/interfaces/workspace";
import { User } from "@/interfaces/user";

export const workspace_services = {
  /**
   * Get a workspace by its ID
   * @param id - The ID of the workspace to retrieve
   * @returns Promise with the workspace details
   */
  get_workspace_async: async (id: string): Promise<Workspace> => {
    try {
      const response = await api.get(`/workspaces/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Get all workspaces the user has access to
   * @returns Promise with the list of workspaces
   */
  get_workspaces_async: async (): Promise<Workspace[]> => {
    try {
      const response = await api.get("/workspaces");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Create a new workspace
   * @param name - The name of the workspace to create
   * @returns Promise with the created workspace details
   */
  create_workspace_async: async (name: string): Promise<Workspace> => {
    try {
      const response = await api.post(
        `/workspaces?workspace_name=${encodeURIComponent(name)}`
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Update a workspace's name
   * @param id - The ID of the workspace to update
   * @param new_name - The new name for the workspace
   * @returns Promise with the updated workspace details
   */
  update_workspace_async: async (
    id: string,
    new_name: string
  ): Promise<Workspace> => {
    try {
      const response = await api.put(
        `/workspaces/${id}?workspace_name=${encodeURIComponent(new_name)}`
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Delete a workspace
   * @param id - The ID of the workspace to delete
   */
  delete_workspace_async: async (id: string): Promise<void> => {
    try {
      await api.delete(`/workspaces/${id}`);
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Get all users in a workspace
   * @param workspace_id - The ID of the workspace
   * @returns Promise with the list of users
   */
  get_workspace_users_async: async (workspace_id: string): Promise<User[]> => {
    try {
      const response = await api.get(`/workspaces/${workspace_id}/users`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Add a user to a workspace by email
   * @param workspace_id - The ID of the workspace
   * @param user_email - The email of the user to add
   * @returns Promise with the added user details
   */
  add_workspace_user_async: async (
    workspace_id: string,
    user_email: string
  ): Promise<any> => {
    try {
      const response = await api.post(
        `/workspaces/${workspace_id}/users?user_email=${encodeURIComponent(
          user_email
        )}`
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Remove a user from a workspace
   * @param workspace_id - The ID of the workspace
   * @param user_id - The ID of the user to remove
   */
  remove_workspace_user_async: async (
    workspace_id: string,
    user_id: string
  ): Promise<void> => {
    try {
      await api.delete(`/workspaces/${workspace_id}/users/${user_id}`);
    } catch (error: any) {
      throw error;
    }
  },
};
