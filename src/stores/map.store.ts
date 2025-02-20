"use client";

// INTERFACES
import { Author, Source } from "@/interfaces/map";
import { MapUpdateRequest } from "@/services/map.services";

// LIBRARIES
import { create } from "zustand";

// TYPES
import { Thumbnail, MapInfos, Metadata, LayerInfos } from "@/interfaces/map";

// INTERFACES
import { Version } from "@/interfaces/version";

// SERVICES
import { map_services } from "@/services/map.services";
import { version_services } from "@/services/version.services";

/*======= INTERFACES =======*/
export interface MapUpdateObject {
  name?: string;
  folder_id?: string;
  public?: boolean;
  description?: string;
  tags?: string[];
  source?: Source | null;
  license?: string | null;
  readme?: string;
  visuals?: Record<string, any>;
}

interface MapState {
  /*------- STATE -------*/
  map: MapInfos | null;
  use_qgis_style: boolean;
  thumbnail: Thumbnail | null;
  author: Author | null;
  meta_data: Metadata | null;
  layer_infos: LayerInfos | null;
  is_editable: boolean;
  is_loading: boolean;
  error: string | null;
  versions: Version[];
  selected_version: Version | null;

  /*------- ACTIONS -------*/
  load_map_detail: (map_id: string, increment_views?: boolean) => Promise<void>;
  reload_map_detail: () => Promise<void>;
  load_layer_infos: (map_id: string, version_id?: string) => Promise<void>;
  toggle_qgis_style: () => void;
  fetch_tiler_url: (
    map_id: string,
    version_id?: string,
    alias?: string
  ) => Promise<string>;
  get_star_status: () => Promise<{ is_starred: boolean }>;
  toggle_star: () => Promise<{ is_starred: boolean }>;
  update_source_file: (file: File, description: string) => Promise<void>;
  update_thumbnail: (file: File | string) => Promise<void>;
  update_map: (update_data: MapUpdateObject) => Promise<boolean>;
  update_visuals: (visuals: object) => Promise<boolean>;
  delete_map: (mapId: string) => Promise<boolean>;

  // Version-related methods
  load_versions: () => Promise<Version[]>;
  load_version: (version_id: string) => Promise<Version>;
  set_selected_version: (new_version: Version) => void;
  upload_new_version: (file: File, description: string) => Promise<void>;
  download_version: (
    version_id: string,
    file_format?: string
  ) => Promise<{ blob: Blob; filename: string }>;
  apply_alias: (version_id: string, alias: string) => Promise<void>;
  switch_version: (version_id: string) => Promise<void>;
}

/*======= STORE =======*/
export const useMapStore = create<MapState>()((set, get) => ({
  map: null,
  use_qgis_style: false,
  thumbnail: null,
  author: null,
  meta_data: null,
  layer_infos: null,
  is_editable: false,
  is_loading: false,
  error: null,
  // Version-related state initialization
  versions: [],
  selected_version: null,
  set_selected_version: (new_version: Version) => {
    set({ selected_version: new_version });
  },

  /*------- GET OPERATIONS -------*/
  load_map_detail: async (map_id: string): Promise<void> => {
    set({ is_loading: true, error: null });

    try {
      const is_editable = await map_services.get_can_edit_async(map_id);
      const increment_views = !is_editable;
      set({ is_editable });

      const details = await map_services.get_map_async(map_id, increment_views);
      set({
        map: details.map,
        author: details.author,
        meta_data: details.meta_data,
        use_qgis_style: details.map.visuals?.qgis
          ? get().use_qgis_style
          : false,
      });

      // Fetch the thumbnail as a blob
      try {
        const thumbnail = await map_services.get_thumbnail(map_id);
        set({ thumbnail });
      } catch (error) {
        console.warn("Failed to load thumbnail, continuing without it:", error);
        // Set thumbnail to null to indicate it's not available
        set({ thumbnail: null });
      }

      await get().load_layer_infos(map_id);

      // Load versions for this map and wait for the result
      // This ensures we have versions available for selection before continuing
      const versions = await version_services.get_map_versions_async(map_id);
      set({ versions, selected_version: null });
    } catch (error: any) {
      // Get latest version
      version_services.get_map_versions_async(map_id).then(
        (versions) => {
          set({ versions, selected_version: versions[0] });
        },
        (error) => {
          set({ error: error.message });
        }
      );
    } finally {
      set({ is_loading: false });
    }
  },

  reload_map_detail: async () => {
    const map_id = get().map?.id;

    if (!map_id) return;

    await get().load_map_detail(map_id);
  },

  load_layer_infos: async (map_id: string, version_id?: string) => {
    const layer_infos = await map_services.get_tiling_info_async(
      map_id,
      version_id
    );
    set({ layer_infos });
  },

  toggle_qgis_style: () => {
    set((state) => ({
      use_qgis_style: !state.use_qgis_style,
    }));
  },

  fetch_tiler_url: async (map_id: string) => {
    try {
      const url = await map_services.get_tiler_url_async(map_id);
      return url;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch tiler URL",
      });
      throw error;
    }
  },

  get_star_status: async () => {
    const map = get().map;
    if (!map) return { is_starred: false };

    try {
      const response = await map_services.get_star_status_async(map.id);
      return response;
    } catch (error: any) {
      const message = error?.message || "Failed to get star status";
      set({ error: message });
      throw error;
    }
  },

  /*------- PUT OPERATIONS -------*/
  update_map: async (update_data: MapUpdateObject) => {
    const map = get().map;
    if (!map) return false;

    // Merge new infos with existing map infos
    const updated_infos: MapUpdateRequest = {
      name: update_data.name ?? map.name,
      folder_id: update_data.folder_id ?? map.folder_id,
      public: update_data.public ?? map.public,
      description: update_data.description ?? map.description,
      source:
        update_data.source !== undefined ? update_data.source : map.source,
      license:
        update_data.license !== undefined ? update_data.license : map.license,
      tags: update_data.tags ?? map.tags,
      readme: update_data.readme ?? map.readme,
      visuals: update_data.visuals ?? map.visuals,
    };

    try {
      const updated_map = await map_services.update_map_async(
        map.id,
        updated_infos
      );

      // Update the current map detail if it matches the updated map
      const current_map = get().map;
      if (current_map && current_map?.id === map.id) {
        set({
          map: {
            ...current_map,
            ...updated_map,
          },
        });
      }

      return true;
    } catch (error: any) {
      throw new Error(error?.message || "Failed to update map");
    }
  },

  update_visuals: async (visuals: Record<string, any>) => {
    const map = get().map;
    if (!map) return false;

    try {
      await get().update_map({ visuals });

      set({
        map: {
          ...map,
          visuals: visuals,
        },
      });

      // DEPENDENCIES
      if (map.type === "raster") {
        const layer_infos = await map_services.get_tiling_info_async(map.id);
        set({ layer_infos });
      }

      return true;
    } catch (error: any) {
      throw error;
    }
  },

  toggle_star: async () => {
    const map = get().map;
    if (!map) return { is_starred: false };

    try {
      const response = await map_services.toggle_star_async(map.id);

      // Update the current map detail if it matches the updated map
      const current_map = get().map;
      if (current_map && current_map?.id === map.id) {
        set({
          map: {
            ...current_map,
            stars: response.is_starred
              ? (current_map.stars || 0) + 1
              : (current_map.stars || 1) - 1,
          },
        });
      }

      return response;
    } catch (error: any) {
      const message = error?.message || "Failed to toggle star status";
      set({ error: message });
      throw error;
    }
  },

  update_source_file: async (
    file: File,
    description: string = "Updated map"
  ) => {
    await get().upload_new_version(file, description);
    // Refresh map details after update
    await get().reload_map_detail();
  },

  update_thumbnail: async (file: File | string) => {
    const map = get().map;
    if (map === null) return;

    try {
      if (typeof file === "string") {
        await map_services.update_thumbnail_from_image_data_async(map.id, file);
      } else {
        await map_services.update_thumbnail_from_file_async(map.id, file);
      }

      // Fetch the updated thumbnail as a blob
      try {
        const thumbnail = await map_services.get_thumbnail(map.id);
        set({ thumbnail });
      } catch (error) {
        console.warn("Failed to load updated thumbnail:", error);
        // Keep the existing thumbnail or set to null if none exists
        set({ thumbnail: get().thumbnail || null });
      }
    } catch (error: any) {
      throw error;
    }
  },

  /*------- DELETE OPERATIONS -------*/
  delete_map: async (map_id: string) => {
    set({ is_loading: true, error: null });

    try {
      await map_services.delete_map_async(map_id);

      // Clear the current map detail if it matches the deleted map
      const current_map = get().map;
      if (current_map && current_map?.id === map_id) {
        set({ map: null });
      }

      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete map",
      });
      throw error;
    } finally {
      set({ is_loading: false });
    }
  },

  // Version-related methods
  load_versions: async () => {
    const map = get().map;
    if (!map) return [];

    try {
      const versions = await version_services.get_map_versions_async(map.id);

      // Just update the versions without auto-selecting
      set({ versions });

      return versions;
    } catch (error: any) {
      const message = error?.message || "Failed to load versions";
      set({ error: message });
      throw error;
    }
  },

  load_version: async (version_id: string) => {
    try {
      const version = await version_services.get_version_async(version_id);
      set({ selected_version: version });
      return version;
    } catch (error: any) {
      const message = error?.message || "Failed to load version";
      set({ error: message });
      throw error;
    }
  },

  upload_new_version: async (file: File, description: string) => {
    const map = get().map;
    if (!map) throw new Error("No map loaded");

    try {
      await version_services.upload_version_async({
        map_id: map.id,
        file,
        version_description: description,
      });

      // Refresh versions after upload
      await get().load_versions();
    } catch (error: any) {
      const message = error?.message || "Failed to upload new version";
      set({ error: message });
      throw error;
    }
  },

  download_version: async (
    version_id: string,
    file_format?: string
  ): Promise<{ blob: Blob; filename: string }> => {
    try {
      const blob = await version_services.download_version_async(
        version_id,
        file_format
      );

      // Generate appropriate filename
      let filename = `version_${version_id}`;
      if (file_format === "shp") {
        filename += ".zip";
      } else if (file_format) {
        filename += `.${file_format}`;
      } else {
        // Try to determine from header or use default
        filename += ".geojson";
      }

      return { blob, filename };
    } catch (error: any) {
      const message = error?.message || "Failed to download version";
      set({ error: message });
      throw error;
    }
  },

  apply_alias: async (version_id: string, alias: string) => {
    try {
      await version_services.apply_alias_async(version_id, alias);
      // Refresh versions to show updated alias
      await get().load_versions();
    } catch (error: any) {
      const message = error?.message || "Failed to apply alias";
      set({ error: message });
      throw error;
    }
  },

  switch_version: async (version_id: string) => {
    const map = get().map;
    const current_version = get().selected_version;
    const is_loading = get().is_loading;

    // Important checks to prevent infinite loops

    // 1. If already selected, don't do anything
    if (current_version?.id === version_id) {
      return;
    }

    // 2. If already loading, don't trigger another load
    if (is_loading) {
      console.warn("Ignoring version switch request - already loading");
      return;
    }

    // 3. Require a map
    if (!map) throw new Error("No map loaded");

    // Set loading state and selected version in one update
    set({ is_loading: true });

    try {
      // Load the version details
      const version = await version_services.get_version_async(version_id);
      set({ selected_version: version });

      // Get layer info for this version
      const layer_infos = await map_services.get_tiling_info_async(
        map.id,
        version_id
      );

      // Safely try to clear the MapBox tile cache
      if (typeof window !== "undefined") {
        try {
          // @ts-ignore - Access global registry if it exists
          const mapInstances = window.maphubMapInstances;
          if (mapInstances) {
            Object.values(mapInstances).forEach((mapInstance: any) => {
              try {
                if (mapInstance && typeof mapInstance.getMap === "function") {
                  const mapboxMap = mapInstance.getMap();
                  if (
                    mapboxMap &&
                    typeof mapboxMap.getStyle === "function" &&
                    typeof mapboxMap.setStyle === "function"
                  ) {
                    const currentStyle = mapboxMap.getStyle();
                    mapboxMap.setStyle(currentStyle, { diff: false });
                  }
                }
              } catch (e) {
                console.error("Failed to reset map style:", e);
              }
            });
          }
        } catch (error) {
          console.error("Error accessing map instances:", error);
        }
      }

      // Finish by setting loading to false
      set({
        layer_infos,
      });
    } catch (error: any) {
      // On error, make sure to reset loading state
      set({
        error: error?.message || "Failed to switch version",
      });
      throw error;
    } finally {
      set({ is_loading: false });
    }
  },
}));
