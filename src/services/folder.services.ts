import { api } from "@/services/api/maphub.api";
import {
  FolderInfos,
  FolderContent,
  FolderPathItem,
} from "@/interfaces/folder";

/*======= SERVICES =======*/
export const folder_services = {
  /**
   * Get folder infos and its contents
   * @param id - The id of the folder
   * @returns Promise with the folder contents
   */
  get_folder_async: async (id: string): Promise<FolderContent> => {
    try {
      const response = await api.get(`/folders/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Get the root folder of a workspace
   * @returns Promise with the root folder
   */
  get_root_async: async (workspace_id: string): Promise<FolderContent> => {
    try {
      const response = await api.get(`/folders?workspace_id=${workspace_id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Get the path of a folder
   * @param folder_id - The id of the folder
   * @returns Promise with the folder path
   */
  get_ariane_path_async: async (
    folder_id: string
  ): Promise<FolderPathItem[]> => {
    try {
      const response = await api.get(`/folders/${folder_id}/path`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Create a new folder
   * @param parent_path - The path to the parent folder
   * @param folder_name - The name of the new folder
   * @returns Promise with the created folder details
   */
  create_async: async (
    parent_path: string,
    folder_name: string
  ): Promise<FolderInfos> => {
    try {
      const response = await api.post(
        `/folders?folder_name=${folder_name}&parent_folder_id=${parent_path}`
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Move a folder to a new parent folder
   * @param new_parent_id - The ID of the new parent folder
   * @param folder_id - The ID of the folder to move
   * @returns Promise with update confirmation message
   */
  update_parent_async: async (
    new_parent_id: string,
    folder_id: string
  ): Promise<{ message: string }> => {
    try {
      const params = new URLSearchParams();
      params.append("parent_folder_id", new_parent_id);

      const response = await api.put<{ message: string }>(
        `/folders/${folder_id}/parent?${params.toString()}`
      );

      if (!response.data) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update folder parent: ${error.message}`);
      }
      throw new Error("An unknown error occurred while updating folder parent");
    }
  },

  /**
   * Delete a folder
   * @param path - The path to the folder
   * @returns Promise indicating success
   */
  delete_async: async (path: string): Promise<void> => {
    try {
      await api.delete(`/folders/${path}`);
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Rename a folder
   * @param folder_id - The ID of the folder to rename
   * @param new_name - The new name for the folder
   * @returns Promise with the updated folder details
   */
  rename_async: async (
    folder_id: string,
    new_name: string
  ): Promise<FolderInfos> => {
    try {
      const response = await api.put(
        `/folders/${folder_id}/name?new_name=${new_name}`
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};
