import { api } from "@/services/api/maphub.api";
import { Version } from "@/interfaces/version";

/*======= INTERFACES =======*/
interface UploadFileResponse {
  task_id: string;
  map_id: string;
  status: "uploading";
  message: string;
}

interface UploadFileParams {
  folder_id: string;
  map_name: string;
  is_public: boolean;
  file: File;
  colormap?: string;
  on_progress?: (progress: number) => void;
}

interface UpdateMapParams {
  map_id: string;
  file: File;
  colormap?: string;
  vector_lod?: number;
}

export interface FormatOption {
  id: string;
  name: string;
  description: string;
  available: boolean;
  reason?: string;
}

/*======= SERVICES =======*/
export const file_services = {
  /**
   * Uploads a map file to the server
   * @param params - Object containing file and metadata
   * @returns Promise with the task ID and map ID
   */
  upload_file_async: async ({
    folder_id,
    map_name,
    is_public,
    file,
    colormap = "viridis",
    on_progress,
  }: UploadFileParams): Promise<Version> => {
    const formData = new FormData();
    formData.append("file", file);

    // Add the additional parameters to the query string
    const queryParams = new URLSearchParams({
      folder_id: folder_id,
      map_name: map_name,
      public: is_public.toString(),
      colormap: colormap,
    });

    try {
      const response = await api.post(
        `/maps?${queryParams.toString()}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          maxRedirects: 0,
          onUploadProgress: (event) => {
            if (!on_progress || !event.total) return;

            const progress = Math.round((event.loaded * 100) / event.total);
            on_progress(progress);
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Downloads a map file by ID
   * @param map_id - The ID of the map to download
   * @param format - Optional format to download the file in (e.g. 'geojson', 'shp')
   * @returns Promise that resolves when download begins
   */
  download_file_async: async (
    map_id: string,
    format?: string
  ): Promise<{ name: string; content: Blob }> => {
    try {
      // Add format parameter to query string if provided
      const url = format
        ? `/maps/${map_id}/download?format=${encodeURIComponent(format)}`
        : `/maps/${map_id}/download`;

      console.log(`Sending download request to: ${url}`);

      const response = await api.get(url, {
        responseType: "blob",
      });

      console.log(`Download response received, status: ${response.status}`);

      // Log all headers to diagnose issues
      const headers = response.headers;
      console.log("Response headers:");
      Object.keys(headers).forEach((key) => {
        console.log(`  ${key}: ${headers[key]}`);
      });

      // Try different ways to access content-disposition header
      let content_disposition =
        headers["content-disposition"] || headers["Content-Disposition"];

      // Check if headers has a get method (depends on the Axios version)
      if (typeof headers.get === "function") {
        content_disposition =
          content_disposition ||
          headers.get("content-disposition") ||
          headers.get("Content-Disposition");
      }

      console.log(`Content-Disposition header found: ${content_disposition}`);

      if (!content_disposition) {
        console.error("No content-disposition header in response");

        // Fallback: generate a filename from the format
        const fallback_filename = `map_${map_id}.${format || "data"}`;
        console.log(`Using fallback filename: ${fallback_filename}`);

        return {
          name: fallback_filename,
          content: new Blob([response.data]),
        };
      }

      // Extract filename
      const match = content_disposition.match(/filename=['"]?(.*?)['"]?$/);
      const filename = match?.[1] || `map_${map_id}.${format || "data"}`;
      console.log("Download filename:", filename);

      // Create a blob URL from the response data
      const blob = new Blob([response.data]);
      console.log(`Created blob with size: ${blob.size} bytes`);

      // Ensure proper MIME type for ZIP files (shapefiles)
      if (filename.toLowerCase().endsWith(".zip") || format === "shp") {
        console.log(
          "Handling ZIP file (shapefile) - ensuring proper MIME type"
        );
        // Create a new blob with the correct MIME type
        const zipBlob = new Blob([response.data], { type: "application/zip" });
        return { name: filename, content: zipBlob };
      }

      return { name: filename, content: blob };
    } catch (error: any) {
      // Log detailed error information
      console.error("Download error:", error);

      if (error.data) {
        console.error(`Error response status: ${error.status}`);
        console.error(`Error response data:`, error.data);

        // Check if response data is a Blob but contains error text
        if (
          error.data instanceof Blob &&
          error.data.type.includes("application/json")
        ) {
          try {
            // Try to read the blob as text to get error details
            const text = await error.data.text();
            const error_data = JSON.parse(text);
            console.error("Error data from blob:", error_data);
            if (error_data.detail) {
              throw new Error(error_data.detail);
            }
          } catch (blobError) {
            console.error("Error parsing blob error data:", blobError);
          }
        }
      }

      // Check if the error is due to file size (413 status)
      if (error.data && error.status === 413) {
        throw new Error(
          "File is too large for download (>1GB). Please contact us on Discord for alternative download options."
        );
      }

      if (error instanceof Error) {
        throw new Error(`Failed to download map: ${error.message}`);
      }

      throw new Error("An unknown error occurred while downloading the map");
    }
  },

  /**
   * Updates an existing map with a new file
   * @param params - Object containing map_id, file and optional parameters
   * @returns Promise with the updated map metadata
   */
  update_map_async: async ({
    map_id,
    file,
    colormap,
    vector_lod,
  }: UpdateMapParams): Promise<UploadFileResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Add optional parameters to query string
      const queryParams = new URLSearchParams();
      if (colormap) queryParams.append("colormap", colormap);
      if (vector_lod) queryParams.append("vector_lod", vector_lod.toString());

      const queryString = queryParams.toString();
      const url = `/maps/${map_id}/update${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await api.put<UploadFileResponse>(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data) {
        throw new Error("Invalid server response format");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Update failed: ${error.message}`);
      }
      throw new Error("An unknown error occurred during map update");
    }
  },

  /**
   * Gets available download formats for a map
   * @param map_id - The ID of the map
   * @returns Promise that resolves to an object with available formats
   */
  get_download_formats_async: async (
    map_id: string
  ): Promise<Array<FormatOption>> => {
    try {
      const response = await api.get(`/maps/${map_id}/formats`);

      return response.data.formats;
    } catch (error: any) {
      console.error("Error fetching formats:", error);
      if (error.message) {
        throw new Error(`Failed to get download formats: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while fetching download formats"
      );
    }
  },
};
