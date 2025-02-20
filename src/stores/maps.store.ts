"use client";

// LIBRARIES
import { create } from "zustand";

// TYPES
import { MapInfos } from "@/interfaces/map";

// SERVICES
import { maps_services } from "@/services/maps.services";

interface MapsState {
  maps: MapInfos[];
  currentProjectId: string | null;
  is_loading: boolean;
  error: string | null;
  set_project_id: (projectId: string) => void;
  fetch_maps_async: (projectId?: string) => Promise<void>;
}

export const useMapsStore = create<MapsState>()((set, get) => ({
  maps: [],
  currentProjectId: null,
  is_loading: false,
  error: null,

  set_project_id: (projectId: string) => set({ currentProjectId: projectId }),

  fetch_maps_async: async (projectId?: string) => {
    try {
      set({ is_loading: true, error: null });

      const project_id = projectId || get().currentProjectId;

      if (!project_id) {
        throw new Error("No project ID provided");
      }

      const maps = await maps_services.get_maps_async(project_id);
      set({ maps, is_loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch maps",
        is_loading: false,
      });
    }
  },
}));
